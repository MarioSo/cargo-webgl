/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/displace-2.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const dp2 = (canvas, options) => {
  var vs = `
attribute vec4 position;
attribute vec2 texcoord;

uniform mat4 u_matrix;

varying vec2 v_texcoord;

void main() {
  gl_Position = u_matrix * position;
  v_texcoord = texcoord;
}
`;

  var fs = `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec4 u_mult;

void main() {
  gl_FragColor = texture2D(u_texture, v_texcoord) * u_mult;
  gl_FragColor.rgb *= gl_FragColor.a;  // premultiply alpha so blending works
}
`;
  var vsQuad = `
attribute vec4 position;
attribute vec2 texcoord;

uniform mat4 u_matrix;

varying vec2 v_texcoord;

void main() {
  gl_Position = u_matrix * position;
  v_texcoord = texcoord;
}
`;
  var fsFade = `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform float u_mixAmount;

const float kEpsilon = 2./256.;

void main() {
  vec4 color = texture2D(u_texture, v_texcoord) * 2. - 1.;
  vec4 adjust = -color * u_mixAmount;
  adjust = mix(adjust, sign(color) * -kEpsilon, step(abs(adjust), vec4(kEpsilon)));
  color += adjust;
  gl_FragColor = color * .5 + .5;
}
`;
  var fsDisplace = `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_displacementTexture;
uniform vec2 u_displacementRange;

void main() {

  // assuming the displacement texture is the same size as
  // the main texture you can use the same texture coords

  // first look up the displacement and convert to -1 <-> 1 range
  // we're only using the R and G channels which will become U and V
  // displacements to our texture coordinates
  vec2 displacement = texture2D(u_displacementTexture, v_texcoord).rg * 2. - 1.;

  vec2 uv = v_texcoord + displacement * u_displacementRange;

  gl_FragColor = texture2D(u_texture, uv);
}
`;

  var $ = document.querySelector.bind(document);

  var mixAmount = 0.03;

  console.log(canvas)
  // var gl = $("canvas").getContext("webgl");
  var gl = canvas.getContext("webgl");
  var m4 = twgl.m4;
  var programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  var fadeProgramInfo = twgl.createProgramInfo(gl, [vsQuad, fsFade]);
  var displaceProgramInfo = twgl.createProgramInfo(gl, [vsQuad, fsDisplace]);

  // this will be replaced when the image has loaded;
  var img = { width: 1, height: 1 };

  const tex = twgl.createTexture(gl, {
    src: options.img,
    crossOrigin: '',
  }, function(err, texture, source) {
    img = source;
  });

  // make a displacement texture, 127 = no displacement
  function makeDispTexture() {
    var dispWidth = 64;
    var dispHeight = 64;
    var disp = new Uint8Array(dispWidth * dispHeight * 4);
    var radius = dispWidth / 8;

    for (var y = 0; y < dispHeight; ++y) {
      var dy = dispHeight / 2 - y;
      var dv = flip(clamp(dy / radius, -1, 1));
      for (var x = 0; x < dispWidth; ++x) {
        var dx = x - dispWidth / 2;
        var du = flip(clamp(dx / radius, -1, 1));
        var off = (y * dispWidth + x) * 4;
        disp[off + 0] = (-du * .5 + .5) * 255;
        disp[off + 1] = (-dv * .5 + .5) * 255;
        disp[off + 3] = 255;
      }
    }


    return twgl.createTexture(gl, {
      src: disp,
    });
  }

  var dpMap = { width: 1, height: 1 };
  var dispTex

  const texturImg = twgl.createTexture(gl, {
    src: 'http://localhost:3000/public/dpmap.jpg',
    crossOrigin: '',
  }, function(err, texture, source) {
    dpMap = source;
    dispTex = texture
  });


  // Creates a -1 to +1 quad
  var quadBufferInfo = twgl.primitives.createXYQuadBufferInfo(gl);

  // Creates 2 RGBA texture + depth framebuffers
  var fadeAttachments = [
    { format: gl.RGBA,
      min: gl.NEAREST,
      max: gl.NEAREST,
      wrap: gl.CLAMP_TO_EDGE,
    },
  ];
  var fadeFbi1 = twgl.createFramebufferInfo(gl, fadeAttachments);
  var fadeFbi2 = twgl.createFramebufferInfo(gl, fadeAttachments);

  function drawThing(gl, x, y, rotation, scale) {
    var matrix = m4.ortho(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
    matrix = m4.translate(matrix, [x, y, 0]);
    // matrix = m4.rotateZ(matrix, rotation);
    matrix = m4.scale(matrix, [scale, scale, 1]);

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, quadBufferInfo);
    twgl.setUniforms(programInfo, {
      u_matrix: matrix,
      u_texture: dispTex,
      u_mult: [1, 1, 1, 0.2],  // set mult so we can adjust blending
    });
    twgl.drawBufferInfo(gl, gl.TRIANGLES, quadBufferInfo);
  }

  function rand(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return min + Math.random() * (max - min);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function flip(v) {
    return Math.sign(v) * (1 - Math.abs(v));
  }

  var drawRect = false;
  var rectX;
  var rectY;
  var currentMatrix;

  function render(time) {
    if (twgl.resizeCanvasToDisplaySize(gl.canvas)) {
      // set the clear color to 0.5 which is 0 displacement
      // for our shader
      gl.clearColor(0.5, 0.5, 0.5, 0.5);
      // resize the framebuffer's attachments so their the
      // same size as the canvas
      twgl.resizeFramebufferInfo(gl, fadeFbi1, fadeAttachments);
      // clear the color buffer to 0.5
      twgl.bindFramebufferInfo(gl, fadeFbi1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      // resize the 2nd framebuffer's attachments so their the
      // same size as the canvas
      twgl.resizeFramebufferInfo(gl, fadeFbi2, fadeAttachments);
      // clear the color buffer to 0.5
      twgl.bindFramebufferInfo(gl, fadeFbi2);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    // fade by copying from fadeFbi1 into fabeFbi2 using mixAmount.
    // fadeFbi2 will contain mix(fadeFb1, u_fadeColor, u_mixAmount)
    twgl.bindFramebufferInfo(gl, fadeFbi2);

    gl.useProgram(fadeProgramInfo.program);
    twgl.setBuffersAndAttributes(gl, fadeProgramInfo, quadBufferInfo);
    twgl.setUniforms(fadeProgramInfo, {
      u_matrix: m4.identity(),
      u_texture: fadeFbi1.attachments[0],
      u_mixAmount: mixAmount,
    });
    twgl.drawBufferInfo(gl, gl.TRIANGLES, quadBufferInfo);

    if (drawRect) {
      drawRect = false;
      // now draw new stuff to fadeFb2. Notice we don't clear!
      twgl.bindFramebufferInfo(gl, fadeFbi2);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      var rotation = time * 0.01;
      var scale = 30;
      drawThing(gl, rectX, rectY, rotation, scale);

      gl.disable(gl.BLEND);
    }

    // now use fadeFbi2 as a displacement while drawing tex to the canvas
    twgl.bindFramebufferInfo(gl, null);

    var mat = m4.ortho(0, gl.canvas.clientWidth, gl.canvas.clientHeight, 0, -1, 1);
    mat = m4.translate(mat, [gl.canvas.clientWidth / 2, gl.canvas.clientHeight / 2, 0]);
    mat = m4.scale(mat, [img.width * 1.5, img.height * 1.5, 1]);

    currentMatrix = mat;

    gl.useProgram(displaceProgramInfo.program);
    twgl.setBuffersAndAttributes(gl, displaceProgramInfo, quadBufferInfo);
    twgl.setUniforms(displaceProgramInfo, {
      u_matrix: mat,
      u_texture: tex,
      u_displacementTexture: fadeFbi2.attachments[0],
      u_displacementRange: [0.05, 0.05],
    });
    twgl.drawBufferInfo(gl, gl.TRIANGLES, quadBufferInfo);

    // swap the variables so we render to the opposite textures next time
    var temp = fadeFbi1;
    fadeFbi1 = fadeFbi2;
    fadeFbi2 = temp;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  gl.canvas.addEventListener('mousemove', function(event, target) {
    target = target || event.target;
    const rect = target.getBoundingClientRect();

    const rx = event.clientX - rect.left;
    const ry = event.clientY - rect.top;

    const x = rx * target.width  / target.clientWidth;
    const y = ry * target.height / target.clientHeight;

    // reverse project the mouse onto the image
    var rmat = m4.inverse(currentMatrix);
    var clipspacePoint = [x / target.width * 2 - 1, -(y / target.height * 2 - 1), 0];
    var s = m4.transformPoint(rmat, clipspacePoint);

    // s is now a point in the space of the image's quad. The quad goes -1 to 1
    // and we're going to draw into it using pixels because drawThing takes
    // a pixel value and our displacement map is the same size as the canvas
    drawRect = true;
    rectX = ( s[0] * .5 + .5) * gl.canvas.width;
    rectY = (-s[1] * .5 + .5) * gl.canvas.height;
  });

}

/* harmony default export */ __webpack_exports__["a"] = dp2;


/***/ }),

/***/ "./src/js/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_elements__ = __webpack_require__("./src/js/utils/elements.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__displace_2__ = __webpack_require__("./src/js/displace-2.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__styles_styles_scss__ = __webpack_require__("./src/styles/styles.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__styles_styles_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__styles_styles_scss__);

// import pixi from './pixijs-1' // first demo aqua magnify
// import pixi from './resize'
// import liquify from './liquify-one'
// import liquify from './liquify-two'
// import smokey from './smoke'
// import waterImage from './water-image'
// import simpleDisplacement from './simple-displacement'
// import smear from './smear'
// import wobble from './wobble'
// import regl from './regl'
// import water from './three-water'
// import waterFluid from '../../public/water-fluid/main'
//




const docReady = (/* event */) => {
  // pixi()
  // liquify()
  // smokey()
  // smokeyPixi()
  // waterImage()
  // simpleDisplacement()
  // smear()
  // wobble()
  // regl()
  // water()
  // waterFluid()
  // regl()

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__displace_2__["a" /* default */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_elements__["a" /* find */])('.c-img')[0], {
    img: 'https://farm6.staticflickr.com/5078/14032935559_8c13e9b181_z_d.jpg'
  })

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__displace_2__["a" /* default */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_elements__["a" /* find */])('.c-logo')[0], {
    // img: 'public/turtle-512.jpg'
    img: 'public/cargo-logo.png'
  })
}

const init = () => {
  document.addEventListener('DOMContentLoaded', docReady)
}


init()


/***/ }),

/***/ "./src/js/utils/elements.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const find = (querySelector, element = document) =>
  Array.prototype.slice.call(element.querySelectorAll(querySelector))
/* harmony export (immutable) */ __webpack_exports__["a"] = find;


const isElement = (el) => {
  try {
    // Using W3 DOM2 (works for FF, Opera and Chrome)
    // return obj instanceof HTMLElement;
    if (!(el instanceof HTMLElement)) {
      return find(el)[0].length > 0
    }
    return true
  } catch (e) {
    // Browsers not supporting W3 DOM2 don't have HTMLElement and
    // an exception is thrown and we end up here. Testing some
    // properties that all elements have. (works on IE7)
    return (typeof el === 'object') &&
      (el.nodeType === 1) && (typeof el.style === 'object') &&
      (typeof el.ownerDocument === 'object')
  }
}

const hasClass = (element, className) => {
  if (!isElement(element)) return false

  if (element.classList) {
    return element.classList.contains(className)
  }

  return new RegExp(`(^| )${className}( |$)`, 'gi').test(element.className)
}
/* unused harmony export hasClass */



const addClass = (element, className) => {
  if (!isElement(element)) return false

  if (element.classList) {
    element.classList.add(className)
  } else {
    element.className += ` ${className}`
  }
  return element
}
/* unused harmony export addClass */



const removeClass = (element, className) => {
  if (!isElement(element)) return false

  if (element.classList) {
    element.classList.remove(className)
  } else {
    element.className = element.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ')
  }
  return element
}
/* unused harmony export removeClass */


const toggleClass = (element, className) =>
  hasClass(element, className) ? removeClass(element, className) : addClass(element, className)
/* unused harmony export toggleClass */



const exists = (selector, element = document) => element.querySelector(selector) !== null
/* unused harmony export exists */


const findParentByClass = (element, className) => {
  let parent = element.parentNode
  if (parent !== null) {
    if (hasClass(parent, className)) {
      return parent
    }

    parent = findParentByClass(parent, className)
  }
  return parent
}
/* unused harmony export findParentByClass */


const findPos = (obj) => {
  let curleft = 0
  let curtop = 0

  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft
      curtop += obj.offsetTop
    } while (obj = obj.offsetParent)

    return [curtop, curleft]
  }
  return [curtop, curleft]
}
/* unused harmony export findPos */



/***/ }),

/***/ "./src/styles/styles.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/js/index.js");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjkwZGUwYTMzOGE4ZjJhYTYyZTIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2Rpc3BsYWNlLTIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy9lbGVtZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3N0eWxlcy5zY3NzPzllY2IiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQTtBQUNBLHFCQUFxQixlQUFlO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsZUFBZTtBQUNmOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBOzs7Ozs7Ozs7Ozs7OztBQ3RTZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7Ozs7Ozs7OztBQy9DQTtBQUNBO0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsNEJBQTRCLFVBQVU7QUFDdEM7QUFBQTtBQUFBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsNkJBQTZCLFVBQVU7QUFDdkM7QUFDQTtBQUNBO0FBQUE7QUFBQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNILHVFQUF1RSwrQkFBK0I7QUFDdEc7QUFDQTtBQUNBO0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTs7O0FBR0E7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7O0FDdEZBLHlDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9wdWJsaWMvanMvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYjkwZGUwYTMzOGE4ZjJhYTYyZTIiLCJjb25zdCBkcDIgPSAoY2FudmFzLCBvcHRpb25zKSA9PiB7XG4gIHZhciB2cyA9IGBcbmF0dHJpYnV0ZSB2ZWM0IHBvc2l0aW9uO1xuYXR0cmlidXRlIHZlYzIgdGV4Y29vcmQ7XG5cbnVuaWZvcm0gbWF0NCB1X21hdHJpeDtcblxudmFyeWluZyB2ZWMyIHZfdGV4Y29vcmQ7XG5cbnZvaWQgbWFpbigpIHtcbiAgZ2xfUG9zaXRpb24gPSB1X21hdHJpeCAqIHBvc2l0aW9uO1xuICB2X3RleGNvb3JkID0gdGV4Y29vcmQ7XG59XG5gO1xuXG4gIHZhciBmcyA9IGBcbnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuXG52YXJ5aW5nIHZlYzIgdl90ZXhjb29yZDtcblxudW5pZm9ybSBzYW1wbGVyMkQgdV90ZXh0dXJlO1xudW5pZm9ybSB2ZWM0IHVfbXVsdDtcblxudm9pZCBtYWluKCkge1xuICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodV90ZXh0dXJlLCB2X3RleGNvb3JkKSAqIHVfbXVsdDtcbiAgZ2xfRnJhZ0NvbG9yLnJnYiAqPSBnbF9GcmFnQ29sb3IuYTsgIC8vIHByZW11bHRpcGx5IGFscGhhIHNvIGJsZW5kaW5nIHdvcmtzXG59XG5gO1xuICB2YXIgdnNRdWFkID0gYFxuYXR0cmlidXRlIHZlYzQgcG9zaXRpb247XG5hdHRyaWJ1dGUgdmVjMiB0ZXhjb29yZDtcblxudW5pZm9ybSBtYXQ0IHVfbWF0cml4O1xuXG52YXJ5aW5nIHZlYzIgdl90ZXhjb29yZDtcblxudm9pZCBtYWluKCkge1xuICBnbF9Qb3NpdGlvbiA9IHVfbWF0cml4ICogcG9zaXRpb247XG4gIHZfdGV4Y29vcmQgPSB0ZXhjb29yZDtcbn1cbmA7XG4gIHZhciBmc0ZhZGUgPSBgXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcblxudmFyeWluZyB2ZWMyIHZfdGV4Y29vcmQ7XG5cbnVuaWZvcm0gc2FtcGxlcjJEIHVfdGV4dHVyZTtcbnVuaWZvcm0gZmxvYXQgdV9taXhBbW91bnQ7XG5cbmNvbnN0IGZsb2F0IGtFcHNpbG9uID0gMi4vMjU2Ljtcblxudm9pZCBtYWluKCkge1xuICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVfdGV4dHVyZSwgdl90ZXhjb29yZCkgKiAyLiAtIDEuO1xuICB2ZWM0IGFkanVzdCA9IC1jb2xvciAqIHVfbWl4QW1vdW50O1xuICBhZGp1c3QgPSBtaXgoYWRqdXN0LCBzaWduKGNvbG9yKSAqIC1rRXBzaWxvbiwgc3RlcChhYnMoYWRqdXN0KSwgdmVjNChrRXBzaWxvbikpKTtcbiAgY29sb3IgKz0gYWRqdXN0O1xuICBnbF9GcmFnQ29sb3IgPSBjb2xvciAqIC41ICsgLjU7XG59XG5gO1xuICB2YXIgZnNEaXNwbGFjZSA9IGBcbnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuXG52YXJ5aW5nIHZlYzIgdl90ZXhjb29yZDtcblxudW5pZm9ybSBzYW1wbGVyMkQgdV90ZXh0dXJlO1xudW5pZm9ybSBzYW1wbGVyMkQgdV9kaXNwbGFjZW1lbnRUZXh0dXJlO1xudW5pZm9ybSB2ZWMyIHVfZGlzcGxhY2VtZW50UmFuZ2U7XG5cbnZvaWQgbWFpbigpIHtcblxuICAvLyBhc3N1bWluZyB0aGUgZGlzcGxhY2VtZW50IHRleHR1cmUgaXMgdGhlIHNhbWUgc2l6ZSBhc1xuICAvLyB0aGUgbWFpbiB0ZXh0dXJlIHlvdSBjYW4gdXNlIHRoZSBzYW1lIHRleHR1cmUgY29vcmRzXG5cbiAgLy8gZmlyc3QgbG9vayB1cCB0aGUgZGlzcGxhY2VtZW50IGFuZCBjb252ZXJ0IHRvIC0xIDwtPiAxIHJhbmdlXG4gIC8vIHdlJ3JlIG9ubHkgdXNpbmcgdGhlIFIgYW5kIEcgY2hhbm5lbHMgd2hpY2ggd2lsbCBiZWNvbWUgVSBhbmQgVlxuICAvLyBkaXNwbGFjZW1lbnRzIHRvIG91ciB0ZXh0dXJlIGNvb3JkaW5hdGVzXG4gIHZlYzIgZGlzcGxhY2VtZW50ID0gdGV4dHVyZTJEKHVfZGlzcGxhY2VtZW50VGV4dHVyZSwgdl90ZXhjb29yZCkucmcgKiAyLiAtIDEuO1xuXG4gIHZlYzIgdXYgPSB2X3RleGNvb3JkICsgZGlzcGxhY2VtZW50ICogdV9kaXNwbGFjZW1lbnRSYW5nZTtcblxuICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodV90ZXh0dXJlLCB1dik7XG59XG5gO1xuXG4gIHZhciAkID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvci5iaW5kKGRvY3VtZW50KTtcblxuICB2YXIgbWl4QW1vdW50ID0gMC4wMztcblxuICBjb25zb2xlLmxvZyhjYW52YXMpXG4gIC8vIHZhciBnbCA9ICQoXCJjYW52YXNcIikuZ2V0Q29udGV4dChcIndlYmdsXCIpO1xuICB2YXIgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIpO1xuICB2YXIgbTQgPSB0d2dsLm00O1xuICB2YXIgcHJvZ3JhbUluZm8gPSB0d2dsLmNyZWF0ZVByb2dyYW1JbmZvKGdsLCBbdnMsIGZzXSk7XG4gIHZhciBmYWRlUHJvZ3JhbUluZm8gPSB0d2dsLmNyZWF0ZVByb2dyYW1JbmZvKGdsLCBbdnNRdWFkLCBmc0ZhZGVdKTtcbiAgdmFyIGRpc3BsYWNlUHJvZ3JhbUluZm8gPSB0d2dsLmNyZWF0ZVByb2dyYW1JbmZvKGdsLCBbdnNRdWFkLCBmc0Rpc3BsYWNlXSk7XG5cbiAgLy8gdGhpcyB3aWxsIGJlIHJlcGxhY2VkIHdoZW4gdGhlIGltYWdlIGhhcyBsb2FkZWQ7XG4gIHZhciBpbWcgPSB7IHdpZHRoOiAxLCBoZWlnaHQ6IDEgfTtcblxuICBjb25zdCB0ZXggPSB0d2dsLmNyZWF0ZVRleHR1cmUoZ2wsIHtcbiAgICBzcmM6IG9wdGlvbnMuaW1nLFxuICAgIGNyb3NzT3JpZ2luOiAnJyxcbiAgfSwgZnVuY3Rpb24oZXJyLCB0ZXh0dXJlLCBzb3VyY2UpIHtcbiAgICBpbWcgPSBzb3VyY2U7XG4gIH0pO1xuXG4gIC8vIG1ha2UgYSBkaXNwbGFjZW1lbnQgdGV4dHVyZSwgMTI3ID0gbm8gZGlzcGxhY2VtZW50XG4gIGZ1bmN0aW9uIG1ha2VEaXNwVGV4dHVyZSgpIHtcbiAgICB2YXIgZGlzcFdpZHRoID0gNjQ7XG4gICAgdmFyIGRpc3BIZWlnaHQgPSA2NDtcbiAgICB2YXIgZGlzcCA9IG5ldyBVaW50OEFycmF5KGRpc3BXaWR0aCAqIGRpc3BIZWlnaHQgKiA0KTtcbiAgICB2YXIgcmFkaXVzID0gZGlzcFdpZHRoIC8gODtcblxuICAgIGZvciAodmFyIHkgPSAwOyB5IDwgZGlzcEhlaWdodDsgKyt5KSB7XG4gICAgICB2YXIgZHkgPSBkaXNwSGVpZ2h0IC8gMiAtIHk7XG4gICAgICB2YXIgZHYgPSBmbGlwKGNsYW1wKGR5IC8gcmFkaXVzLCAtMSwgMSkpO1xuICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBkaXNwV2lkdGg7ICsreCkge1xuICAgICAgICB2YXIgZHggPSB4IC0gZGlzcFdpZHRoIC8gMjtcbiAgICAgICAgdmFyIGR1ID0gZmxpcChjbGFtcChkeCAvIHJhZGl1cywgLTEsIDEpKTtcbiAgICAgICAgdmFyIG9mZiA9ICh5ICogZGlzcFdpZHRoICsgeCkgKiA0O1xuICAgICAgICBkaXNwW29mZiArIDBdID0gKC1kdSAqIC41ICsgLjUpICogMjU1O1xuICAgICAgICBkaXNwW29mZiArIDFdID0gKC1kdiAqIC41ICsgLjUpICogMjU1O1xuICAgICAgICBkaXNwW29mZiArIDNdID0gMjU1O1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgcmV0dXJuIHR3Z2wuY3JlYXRlVGV4dHVyZShnbCwge1xuICAgICAgc3JjOiBkaXNwLFxuICAgIH0pO1xuICB9XG5cbiAgdmFyIGRwTWFwID0geyB3aWR0aDogMSwgaGVpZ2h0OiAxIH07XG4gIHZhciBkaXNwVGV4XG5cbiAgY29uc3QgdGV4dHVySW1nID0gdHdnbC5jcmVhdGVUZXh0dXJlKGdsLCB7XG4gICAgc3JjOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwL3B1YmxpYy9kcG1hcC5qcGcnLFxuICAgIGNyb3NzT3JpZ2luOiAnJyxcbiAgfSwgZnVuY3Rpb24oZXJyLCB0ZXh0dXJlLCBzb3VyY2UpIHtcbiAgICBkcE1hcCA9IHNvdXJjZTtcbiAgICBkaXNwVGV4ID0gdGV4dHVyZVxuICB9KTtcblxuXG4gIC8vIENyZWF0ZXMgYSAtMSB0byArMSBxdWFkXG4gIHZhciBxdWFkQnVmZmVySW5mbyA9IHR3Z2wucHJpbWl0aXZlcy5jcmVhdGVYWVF1YWRCdWZmZXJJbmZvKGdsKTtcblxuICAvLyBDcmVhdGVzIDIgUkdCQSB0ZXh0dXJlICsgZGVwdGggZnJhbWVidWZmZXJzXG4gIHZhciBmYWRlQXR0YWNobWVudHMgPSBbXG4gICAgeyBmb3JtYXQ6IGdsLlJHQkEsXG4gICAgICBtaW46IGdsLk5FQVJFU1QsXG4gICAgICBtYXg6IGdsLk5FQVJFU1QsXG4gICAgICB3cmFwOiBnbC5DTEFNUF9UT19FREdFLFxuICAgIH0sXG4gIF07XG4gIHZhciBmYWRlRmJpMSA9IHR3Z2wuY3JlYXRlRnJhbWVidWZmZXJJbmZvKGdsLCBmYWRlQXR0YWNobWVudHMpO1xuICB2YXIgZmFkZUZiaTIgPSB0d2dsLmNyZWF0ZUZyYW1lYnVmZmVySW5mbyhnbCwgZmFkZUF0dGFjaG1lbnRzKTtcblxuICBmdW5jdGlvbiBkcmF3VGhpbmcoZ2wsIHgsIHksIHJvdGF0aW9uLCBzY2FsZSkge1xuICAgIHZhciBtYXRyaXggPSBtNC5vcnRobygwLCBnbC5jYW52YXMud2lkdGgsIGdsLmNhbnZhcy5oZWlnaHQsIDAsIC0xLCAxKTtcbiAgICBtYXRyaXggPSBtNC50cmFuc2xhdGUobWF0cml4LCBbeCwgeSwgMF0pO1xuICAgIC8vIG1hdHJpeCA9IG00LnJvdGF0ZVoobWF0cml4LCByb3RhdGlvbik7XG4gICAgbWF0cml4ID0gbTQuc2NhbGUobWF0cml4LCBbc2NhbGUsIHNjYWxlLCAxXSk7XG5cbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW1JbmZvLnByb2dyYW0pO1xuICAgIHR3Z2wuc2V0QnVmZmVyc0FuZEF0dHJpYnV0ZXMoZ2wsIHByb2dyYW1JbmZvLCBxdWFkQnVmZmVySW5mbyk7XG4gICAgdHdnbC5zZXRVbmlmb3Jtcyhwcm9ncmFtSW5mbywge1xuICAgICAgdV9tYXRyaXg6IG1hdHJpeCxcbiAgICAgIHVfdGV4dHVyZTogZGlzcFRleCxcbiAgICAgIHVfbXVsdDogWzEsIDEsIDEsIDAuMl0sICAvLyBzZXQgbXVsdCBzbyB3ZSBjYW4gYWRqdXN0IGJsZW5kaW5nXG4gICAgfSk7XG4gICAgdHdnbC5kcmF3QnVmZmVySW5mbyhnbCwgZ2wuVFJJQU5HTEVTLCBxdWFkQnVmZmVySW5mbyk7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xhbXAodiwgbWluLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIHYpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsaXAodikge1xuICAgIHJldHVybiBNYXRoLnNpZ24odikgKiAoMSAtIE1hdGguYWJzKHYpKTtcbiAgfVxuXG4gIHZhciBkcmF3UmVjdCA9IGZhbHNlO1xuICB2YXIgcmVjdFg7XG4gIHZhciByZWN0WTtcbiAgdmFyIGN1cnJlbnRNYXRyaXg7XG5cbiAgZnVuY3Rpb24gcmVuZGVyKHRpbWUpIHtcbiAgICBpZiAodHdnbC5yZXNpemVDYW52YXNUb0Rpc3BsYXlTaXplKGdsLmNhbnZhcykpIHtcbiAgICAgIC8vIHNldCB0aGUgY2xlYXIgY29sb3IgdG8gMC41IHdoaWNoIGlzIDAgZGlzcGxhY2VtZW50XG4gICAgICAvLyBmb3Igb3VyIHNoYWRlclxuICAgICAgZ2wuY2xlYXJDb2xvcigwLjUsIDAuNSwgMC41LCAwLjUpO1xuICAgICAgLy8gcmVzaXplIHRoZSBmcmFtZWJ1ZmZlcidzIGF0dGFjaG1lbnRzIHNvIHRoZWlyIHRoZVxuICAgICAgLy8gc2FtZSBzaXplIGFzIHRoZSBjYW52YXNcbiAgICAgIHR3Z2wucmVzaXplRnJhbWVidWZmZXJJbmZvKGdsLCBmYWRlRmJpMSwgZmFkZUF0dGFjaG1lbnRzKTtcbiAgICAgIC8vIGNsZWFyIHRoZSBjb2xvciBidWZmZXIgdG8gMC41XG4gICAgICB0d2dsLmJpbmRGcmFtZWJ1ZmZlckluZm8oZ2wsIGZhZGVGYmkxKTtcbiAgICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuICAgICAgLy8gcmVzaXplIHRoZSAybmQgZnJhbWVidWZmZXIncyBhdHRhY2htZW50cyBzbyB0aGVpciB0aGVcbiAgICAgIC8vIHNhbWUgc2l6ZSBhcyB0aGUgY2FudmFzXG4gICAgICB0d2dsLnJlc2l6ZUZyYW1lYnVmZmVySW5mbyhnbCwgZmFkZUZiaTIsIGZhZGVBdHRhY2htZW50cyk7XG4gICAgICAvLyBjbGVhciB0aGUgY29sb3IgYnVmZmVyIHRvIDAuNVxuICAgICAgdHdnbC5iaW5kRnJhbWVidWZmZXJJbmZvKGdsLCBmYWRlRmJpMik7XG4gICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgICB9XG5cbiAgICAvLyBmYWRlIGJ5IGNvcHlpbmcgZnJvbSBmYWRlRmJpMSBpbnRvIGZhYmVGYmkyIHVzaW5nIG1peEFtb3VudC5cbiAgICAvLyBmYWRlRmJpMiB3aWxsIGNvbnRhaW4gbWl4KGZhZGVGYjEsIHVfZmFkZUNvbG9yLCB1X21peEFtb3VudClcbiAgICB0d2dsLmJpbmRGcmFtZWJ1ZmZlckluZm8oZ2wsIGZhZGVGYmkyKTtcblxuICAgIGdsLnVzZVByb2dyYW0oZmFkZVByb2dyYW1JbmZvLnByb2dyYW0pO1xuICAgIHR3Z2wuc2V0QnVmZmVyc0FuZEF0dHJpYnV0ZXMoZ2wsIGZhZGVQcm9ncmFtSW5mbywgcXVhZEJ1ZmZlckluZm8pO1xuICAgIHR3Z2wuc2V0VW5pZm9ybXMoZmFkZVByb2dyYW1JbmZvLCB7XG4gICAgICB1X21hdHJpeDogbTQuaWRlbnRpdHkoKSxcbiAgICAgIHVfdGV4dHVyZTogZmFkZUZiaTEuYXR0YWNobWVudHNbMF0sXG4gICAgICB1X21peEFtb3VudDogbWl4QW1vdW50LFxuICAgIH0pO1xuICAgIHR3Z2wuZHJhd0J1ZmZlckluZm8oZ2wsIGdsLlRSSUFOR0xFUywgcXVhZEJ1ZmZlckluZm8pO1xuXG4gICAgaWYgKGRyYXdSZWN0KSB7XG4gICAgICBkcmF3UmVjdCA9IGZhbHNlO1xuICAgICAgLy8gbm93IGRyYXcgbmV3IHN0dWZmIHRvIGZhZGVGYjIuIE5vdGljZSB3ZSBkb24ndCBjbGVhciFcbiAgICAgIHR3Z2wuYmluZEZyYW1lYnVmZmVySW5mbyhnbCwgZmFkZUZiaTIpO1xuICAgICAgZ2wuZW5hYmxlKGdsLkJMRU5EKTtcbiAgICAgIGdsLmJsZW5kRnVuYyhnbC5PTkUsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xuXG4gICAgICB2YXIgcm90YXRpb24gPSB0aW1lICogMC4wMTtcbiAgICAgIHZhciBzY2FsZSA9IDMwO1xuICAgICAgZHJhd1RoaW5nKGdsLCByZWN0WCwgcmVjdFksIHJvdGF0aW9uLCBzY2FsZSk7XG5cbiAgICAgIGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuICAgIH1cblxuICAgIC8vIG5vdyB1c2UgZmFkZUZiaTIgYXMgYSBkaXNwbGFjZW1lbnQgd2hpbGUgZHJhd2luZyB0ZXggdG8gdGhlIGNhbnZhc1xuICAgIHR3Z2wuYmluZEZyYW1lYnVmZmVySW5mbyhnbCwgbnVsbCk7XG5cbiAgICB2YXIgbWF0ID0gbTQub3J0aG8oMCwgZ2wuY2FudmFzLmNsaWVudFdpZHRoLCBnbC5jYW52YXMuY2xpZW50SGVpZ2h0LCAwLCAtMSwgMSk7XG4gICAgbWF0ID0gbTQudHJhbnNsYXRlKG1hdCwgW2dsLmNhbnZhcy5jbGllbnRXaWR0aCAvIDIsIGdsLmNhbnZhcy5jbGllbnRIZWlnaHQgLyAyLCAwXSk7XG4gICAgbWF0ID0gbTQuc2NhbGUobWF0LCBbaW1nLndpZHRoICogMS41LCBpbWcuaGVpZ2h0ICogMS41LCAxXSk7XG5cbiAgICBjdXJyZW50TWF0cml4ID0gbWF0O1xuXG4gICAgZ2wudXNlUHJvZ3JhbShkaXNwbGFjZVByb2dyYW1JbmZvLnByb2dyYW0pO1xuICAgIHR3Z2wuc2V0QnVmZmVyc0FuZEF0dHJpYnV0ZXMoZ2wsIGRpc3BsYWNlUHJvZ3JhbUluZm8sIHF1YWRCdWZmZXJJbmZvKTtcbiAgICB0d2dsLnNldFVuaWZvcm1zKGRpc3BsYWNlUHJvZ3JhbUluZm8sIHtcbiAgICAgIHVfbWF0cml4OiBtYXQsXG4gICAgICB1X3RleHR1cmU6IHRleCxcbiAgICAgIHVfZGlzcGxhY2VtZW50VGV4dHVyZTogZmFkZUZiaTIuYXR0YWNobWVudHNbMF0sXG4gICAgICB1X2Rpc3BsYWNlbWVudFJhbmdlOiBbMC4wNSwgMC4wNV0sXG4gICAgfSk7XG4gICAgdHdnbC5kcmF3QnVmZmVySW5mbyhnbCwgZ2wuVFJJQU5HTEVTLCBxdWFkQnVmZmVySW5mbyk7XG5cbiAgICAvLyBzd2FwIHRoZSB2YXJpYWJsZXMgc28gd2UgcmVuZGVyIHRvIHRoZSBvcHBvc2l0ZSB0ZXh0dXJlcyBuZXh0IHRpbWVcbiAgICB2YXIgdGVtcCA9IGZhZGVGYmkxO1xuICAgIGZhZGVGYmkxID0gZmFkZUZiaTI7XG4gICAgZmFkZUZiaTIgPSB0ZW1wO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gIH1cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgZ2wuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGV2ZW50LCB0YXJnZXQpIHtcbiAgICB0YXJnZXQgPSB0YXJnZXQgfHwgZXZlbnQudGFyZ2V0O1xuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBjb25zdCByeCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgY29uc3QgcnkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICBjb25zdCB4ID0gcnggKiB0YXJnZXQud2lkdGggIC8gdGFyZ2V0LmNsaWVudFdpZHRoO1xuICAgIGNvbnN0IHkgPSByeSAqIHRhcmdldC5oZWlnaHQgLyB0YXJnZXQuY2xpZW50SGVpZ2h0O1xuXG4gICAgLy8gcmV2ZXJzZSBwcm9qZWN0IHRoZSBtb3VzZSBvbnRvIHRoZSBpbWFnZVxuICAgIHZhciBybWF0ID0gbTQuaW52ZXJzZShjdXJyZW50TWF0cml4KTtcbiAgICB2YXIgY2xpcHNwYWNlUG9pbnQgPSBbeCAvIHRhcmdldC53aWR0aCAqIDIgLSAxLCAtKHkgLyB0YXJnZXQuaGVpZ2h0ICogMiAtIDEpLCAwXTtcbiAgICB2YXIgcyA9IG00LnRyYW5zZm9ybVBvaW50KHJtYXQsIGNsaXBzcGFjZVBvaW50KTtcblxuICAgIC8vIHMgaXMgbm93IGEgcG9pbnQgaW4gdGhlIHNwYWNlIG9mIHRoZSBpbWFnZSdzIHF1YWQuIFRoZSBxdWFkIGdvZXMgLTEgdG8gMVxuICAgIC8vIGFuZCB3ZSdyZSBnb2luZyB0byBkcmF3IGludG8gaXQgdXNpbmcgcGl4ZWxzIGJlY2F1c2UgZHJhd1RoaW5nIHRha2VzXG4gICAgLy8gYSBwaXhlbCB2YWx1ZSBhbmQgb3VyIGRpc3BsYWNlbWVudCBtYXAgaXMgdGhlIHNhbWUgc2l6ZSBhcyB0aGUgY2FudmFzXG4gICAgZHJhd1JlY3QgPSB0cnVlO1xuICAgIHJlY3RYID0gKCBzWzBdICogLjUgKyAuNSkgKiBnbC5jYW52YXMud2lkdGg7XG4gICAgcmVjdFkgPSAoLXNbMV0gKiAuNSArIC41KSAqIGdsLmNhbnZhcy5oZWlnaHQ7XG4gIH0pO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRwMlxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvZGlzcGxhY2UtMi5qc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvanMvZGlzcGxhY2UtMi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBmaW5kIH0gZnJvbSAnLi91dGlscy9lbGVtZW50cydcbi8vIGltcG9ydCBwaXhpIGZyb20gJy4vcGl4aWpzLTEnIC8vIGZpcnN0IGRlbW8gYXF1YSBtYWduaWZ5XG4vLyBpbXBvcnQgcGl4aSBmcm9tICcuL3Jlc2l6ZSdcbi8vIGltcG9ydCBsaXF1aWZ5IGZyb20gJy4vbGlxdWlmeS1vbmUnXG4vLyBpbXBvcnQgbGlxdWlmeSBmcm9tICcuL2xpcXVpZnktdHdvJ1xuLy8gaW1wb3J0IHNtb2tleSBmcm9tICcuL3Ntb2tlJ1xuLy8gaW1wb3J0IHdhdGVySW1hZ2UgZnJvbSAnLi93YXRlci1pbWFnZSdcbi8vIGltcG9ydCBzaW1wbGVEaXNwbGFjZW1lbnQgZnJvbSAnLi9zaW1wbGUtZGlzcGxhY2VtZW50J1xuLy8gaW1wb3J0IHNtZWFyIGZyb20gJy4vc21lYXInXG4vLyBpbXBvcnQgd29iYmxlIGZyb20gJy4vd29iYmxlJ1xuLy8gaW1wb3J0IHJlZ2wgZnJvbSAnLi9yZWdsJ1xuLy8gaW1wb3J0IHdhdGVyIGZyb20gJy4vdGhyZWUtd2F0ZXInXG4vLyBpbXBvcnQgd2F0ZXJGbHVpZCBmcm9tICcuLi8uLi9wdWJsaWMvd2F0ZXItZmx1aWQvbWFpbidcbi8vXG5pbXBvcnQgZHAyIGZyb20gJy4vZGlzcGxhY2UtMidcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi4vc3R5bGVzL3N0eWxlcy5zY3NzJ1xuXG5cbmNvbnN0IGRvY1JlYWR5ID0gKC8qIGV2ZW50ICovKSA9PiB7XG4gIC8vIHBpeGkoKVxuICAvLyBsaXF1aWZ5KClcbiAgLy8gc21va2V5KClcbiAgLy8gc21va2V5UGl4aSgpXG4gIC8vIHdhdGVySW1hZ2UoKVxuICAvLyBzaW1wbGVEaXNwbGFjZW1lbnQoKVxuICAvLyBzbWVhcigpXG4gIC8vIHdvYmJsZSgpXG4gIC8vIHJlZ2woKVxuICAvLyB3YXRlcigpXG4gIC8vIHdhdGVyRmx1aWQoKVxuICAvLyByZWdsKClcblxuICBkcDIoZmluZCgnLmMtaW1nJylbMF0sIHtcbiAgICBpbWc6ICdodHRwczovL2Zhcm02LnN0YXRpY2ZsaWNrci5jb20vNTA3OC8xNDAzMjkzNTU1OV84YzEzZTliMTgxX3pfZC5qcGcnXG4gIH0pXG5cbiAgZHAyKGZpbmQoJy5jLWxvZ28nKVswXSwge1xuICAgIC8vIGltZzogJ3B1YmxpYy90dXJ0bGUtNTEyLmpwZydcbiAgICBpbWc6ICdwdWJsaWMvY2FyZ28tbG9nby5wbmcnXG4gIH0pXG59XG5cbmNvbnN0IGluaXQgPSAoKSA9PiB7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBkb2NSZWFkeSlcbn1cblxuXG5pbml0KClcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9qcy9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY29uc3QgZmluZCA9IChxdWVyeVNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQpID0+XG4gIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChxdWVyeVNlbGVjdG9yKSlcblxuY29uc3QgaXNFbGVtZW50ID0gKGVsKSA9PiB7XG4gIHRyeSB7XG4gICAgLy8gVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb21lKVxuICAgIC8vIHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICBpZiAoIShlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgcmV0dXJuIGZpbmQoZWwpWzBdLmxlbmd0aCA+IDBcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAvLyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuICAgIHJldHVybiAodHlwZW9mIGVsID09PSAnb2JqZWN0JykgJiZcbiAgICAgIChlbC5ub2RlVHlwZSA9PT0gMSkgJiYgKHR5cGVvZiBlbC5zdHlsZSA9PT0gJ29iamVjdCcpICYmXG4gICAgICAodHlwZW9mIGVsLm93bmVyRG9jdW1lbnQgPT09ICdvYmplY3QnKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBoYXNDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcbiAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkpIHJldHVybiBmYWxzZVxuXG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpXG4gIH1cblxuICByZXR1cm4gbmV3IFJlZ0V4cChgKF58ICkke2NsYXNzTmFtZX0oIHwkKWAsICdnaScpLnRlc3QoZWxlbWVudC5jbGFzc05hbWUpXG59XG5cblxuZXhwb3J0IGNvbnN0IGFkZENsYXNzID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT4ge1xuICBpZiAoIWlzRWxlbWVudChlbGVtZW50KSkgcmV0dXJuIGZhbHNlXG5cbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSlcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSArPSBgICR7Y2xhc3NOYW1lfWBcbiAgfVxuICByZXR1cm4gZWxlbWVudFxufVxuXG5cbmV4cG9ydCBjb25zdCByZW1vdmVDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcbiAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkpIHJldHVybiBmYWxzZVxuXG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoYChefFxcXFxiKSR7Y2xhc3NOYW1lLnNwbGl0KCcgJykuam9pbignfCcpfShcXFxcYnwkKWAsICdnaScpLCAnICcpXG4gIH1cbiAgcmV0dXJuIGVsZW1lbnRcbn1cblxuZXhwb3J0IGNvbnN0IHRvZ2dsZUNsYXNzID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT5cbiAgaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSA/IHJlbW92ZUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkgOiBhZGRDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpXG5cblxuZXhwb3J0IGNvbnN0IGV4aXN0cyA9IChzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50KSA9PiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpICE9PSBudWxsXG5cbmV4cG9ydCBjb25zdCBmaW5kUGFyZW50QnlDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcbiAgbGV0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBpZiAocGFyZW50ICE9PSBudWxsKSB7XG4gICAgaWYgKGhhc0NsYXNzKHBhcmVudCwgY2xhc3NOYW1lKSkge1xuICAgICAgcmV0dXJuIHBhcmVudFxuICAgIH1cblxuICAgIHBhcmVudCA9IGZpbmRQYXJlbnRCeUNsYXNzKHBhcmVudCwgY2xhc3NOYW1lKVxuICB9XG4gIHJldHVybiBwYXJlbnRcbn1cblxuZXhwb3J0IGNvbnN0IGZpbmRQb3MgPSAob2JqKSA9PiB7XG4gIGxldCBjdXJsZWZ0ID0gMFxuICBsZXQgY3VydG9wID0gMFxuXG4gIGlmIChvYmoub2Zmc2V0UGFyZW50KSB7XG4gICAgZG8ge1xuICAgICAgY3VybGVmdCArPSBvYmoub2Zmc2V0TGVmdFxuICAgICAgY3VydG9wICs9IG9iai5vZmZzZXRUb3BcbiAgICB9IHdoaWxlIChvYmogPSBvYmoub2Zmc2V0UGFyZW50KVxuXG4gICAgcmV0dXJuIFtjdXJ0b3AsIGN1cmxlZnRdXG4gIH1cbiAgcmV0dXJuIFtjdXJ0b3AsIGN1cmxlZnRdXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy91dGlscy9lbGVtZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvanMvdXRpbHMvZWxlbWVudHMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZXMvc3R5bGVzLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL3N0eWxlcy9zdHlsZXMuc2Nzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9