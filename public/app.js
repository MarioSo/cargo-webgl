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
    // src: 'http://localhost:3000/public/dpmap.jpg',
    src: 'public/dpmap.jpg',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGVhMzdkNjI1YzkyYWNjMmIxMjgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2Rpc3BsYWNlLTIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy9lbGVtZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3N0eWxlcy5zY3NzPzllY2IiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQTtBQUNBLHFCQUFxQixlQUFlO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsZUFBZTtBQUNmOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDdlNlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTs7Ozs7Ozs7O0FDL0NBO0FBQ0E7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBNEIsVUFBVTtBQUN0QztBQUFBO0FBQUE7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSCw2QkFBNkIsVUFBVTtBQUN2QztBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsdUVBQXVFLCtCQUErQjtBQUN0RztBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFBQTtBQUFBOzs7QUFHQTtBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUN0RkEseUMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL3B1YmxpYy9qcy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwZWEzN2Q2MjVjOTJhY2MyYjEyOCIsImNvbnN0IGRwMiA9IChjYW52YXMsIG9wdGlvbnMpID0+IHtcbiAgdmFyIHZzID0gYFxuYXR0cmlidXRlIHZlYzQgcG9zaXRpb247XG5hdHRyaWJ1dGUgdmVjMiB0ZXhjb29yZDtcblxudW5pZm9ybSBtYXQ0IHVfbWF0cml4O1xuXG52YXJ5aW5nIHZlYzIgdl90ZXhjb29yZDtcblxudm9pZCBtYWluKCkge1xuICBnbF9Qb3NpdGlvbiA9IHVfbWF0cml4ICogcG9zaXRpb247XG4gIHZfdGV4Y29vcmQgPSB0ZXhjb29yZDtcbn1cbmA7XG5cbiAgdmFyIGZzID0gYFxucHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG5cbnZhcnlpbmcgdmVjMiB2X3RleGNvb3JkO1xuXG51bmlmb3JtIHNhbXBsZXIyRCB1X3RleHR1cmU7XG51bmlmb3JtIHZlYzQgdV9tdWx0O1xuXG52b2lkIG1haW4oKSB7XG4gIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1X3RleHR1cmUsIHZfdGV4Y29vcmQpICogdV9tdWx0O1xuICBnbF9GcmFnQ29sb3IucmdiICo9IGdsX0ZyYWdDb2xvci5hOyAgLy8gcHJlbXVsdGlwbHkgYWxwaGEgc28gYmxlbmRpbmcgd29ya3Ncbn1cbmA7XG4gIHZhciB2c1F1YWQgPSBgXG5hdHRyaWJ1dGUgdmVjNCBwb3NpdGlvbjtcbmF0dHJpYnV0ZSB2ZWMyIHRleGNvb3JkO1xuXG51bmlmb3JtIG1hdDQgdV9tYXRyaXg7XG5cbnZhcnlpbmcgdmVjMiB2X3RleGNvb3JkO1xuXG52b2lkIG1haW4oKSB7XG4gIGdsX1Bvc2l0aW9uID0gdV9tYXRyaXggKiBwb3NpdGlvbjtcbiAgdl90ZXhjb29yZCA9IHRleGNvb3JkO1xufVxuYDtcbiAgdmFyIGZzRmFkZSA9IGBcbnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuXG52YXJ5aW5nIHZlYzIgdl90ZXhjb29yZDtcblxudW5pZm9ybSBzYW1wbGVyMkQgdV90ZXh0dXJlO1xudW5pZm9ybSBmbG9hdCB1X21peEFtb3VudDtcblxuY29uc3QgZmxvYXQga0Vwc2lsb24gPSAyLi8yNTYuO1xuXG52b2lkIG1haW4oKSB7XG4gIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodV90ZXh0dXJlLCB2X3RleGNvb3JkKSAqIDIuIC0gMS47XG4gIHZlYzQgYWRqdXN0ID0gLWNvbG9yICogdV9taXhBbW91bnQ7XG4gIGFkanVzdCA9IG1peChhZGp1c3QsIHNpZ24oY29sb3IpICogLWtFcHNpbG9uLCBzdGVwKGFicyhhZGp1c3QpLCB2ZWM0KGtFcHNpbG9uKSkpO1xuICBjb2xvciArPSBhZGp1c3Q7XG4gIGdsX0ZyYWdDb2xvciA9IGNvbG9yICogLjUgKyAuNTtcbn1cbmA7XG4gIHZhciBmc0Rpc3BsYWNlID0gYFxucHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG5cbnZhcnlpbmcgdmVjMiB2X3RleGNvb3JkO1xuXG51bmlmb3JtIHNhbXBsZXIyRCB1X3RleHR1cmU7XG51bmlmb3JtIHNhbXBsZXIyRCB1X2Rpc3BsYWNlbWVudFRleHR1cmU7XG51bmlmb3JtIHZlYzIgdV9kaXNwbGFjZW1lbnRSYW5nZTtcblxudm9pZCBtYWluKCkge1xuXG4gIC8vIGFzc3VtaW5nIHRoZSBkaXNwbGFjZW1lbnQgdGV4dHVyZSBpcyB0aGUgc2FtZSBzaXplIGFzXG4gIC8vIHRoZSBtYWluIHRleHR1cmUgeW91IGNhbiB1c2UgdGhlIHNhbWUgdGV4dHVyZSBjb29yZHNcblxuICAvLyBmaXJzdCBsb29rIHVwIHRoZSBkaXNwbGFjZW1lbnQgYW5kIGNvbnZlcnQgdG8gLTEgPC0+IDEgcmFuZ2VcbiAgLy8gd2UncmUgb25seSB1c2luZyB0aGUgUiBhbmQgRyBjaGFubmVscyB3aGljaCB3aWxsIGJlY29tZSBVIGFuZCBWXG4gIC8vIGRpc3BsYWNlbWVudHMgdG8gb3VyIHRleHR1cmUgY29vcmRpbmF0ZXNcbiAgdmVjMiBkaXNwbGFjZW1lbnQgPSB0ZXh0dXJlMkQodV9kaXNwbGFjZW1lbnRUZXh0dXJlLCB2X3RleGNvb3JkKS5yZyAqIDIuIC0gMS47XG5cbiAgdmVjMiB1diA9IHZfdGV4Y29vcmQgKyBkaXNwbGFjZW1lbnQgKiB1X2Rpc3BsYWNlbWVudFJhbmdlO1xuXG4gIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1X3RleHR1cmUsIHV2KTtcbn1cbmA7XG5cbiAgdmFyICQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yLmJpbmQoZG9jdW1lbnQpO1xuXG4gIHZhciBtaXhBbW91bnQgPSAwLjAzO1xuXG4gIGNvbnNvbGUubG9nKGNhbnZhcylcbiAgLy8gdmFyIGdsID0gJChcImNhbnZhc1wiKS5nZXRDb250ZXh0KFwid2ViZ2xcIik7XG4gIHZhciBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIik7XG4gIHZhciBtNCA9IHR3Z2wubTQ7XG4gIHZhciBwcm9ncmFtSW5mbyA9IHR3Z2wuY3JlYXRlUHJvZ3JhbUluZm8oZ2wsIFt2cywgZnNdKTtcbiAgdmFyIGZhZGVQcm9ncmFtSW5mbyA9IHR3Z2wuY3JlYXRlUHJvZ3JhbUluZm8oZ2wsIFt2c1F1YWQsIGZzRmFkZV0pO1xuICB2YXIgZGlzcGxhY2VQcm9ncmFtSW5mbyA9IHR3Z2wuY3JlYXRlUHJvZ3JhbUluZm8oZ2wsIFt2c1F1YWQsIGZzRGlzcGxhY2VdKTtcblxuICAvLyB0aGlzIHdpbGwgYmUgcmVwbGFjZWQgd2hlbiB0aGUgaW1hZ2UgaGFzIGxvYWRlZDtcbiAgdmFyIGltZyA9IHsgd2lkdGg6IDEsIGhlaWdodDogMSB9O1xuXG4gIGNvbnN0IHRleCA9IHR3Z2wuY3JlYXRlVGV4dHVyZShnbCwge1xuICAgIHNyYzogb3B0aW9ucy5pbWcsXG4gICAgY3Jvc3NPcmlnaW46ICcnLFxuICB9LCBmdW5jdGlvbihlcnIsIHRleHR1cmUsIHNvdXJjZSkge1xuICAgIGltZyA9IHNvdXJjZTtcbiAgfSk7XG5cbiAgLy8gbWFrZSBhIGRpc3BsYWNlbWVudCB0ZXh0dXJlLCAxMjcgPSBubyBkaXNwbGFjZW1lbnRcbiAgZnVuY3Rpb24gbWFrZURpc3BUZXh0dXJlKCkge1xuICAgIHZhciBkaXNwV2lkdGggPSA2NDtcbiAgICB2YXIgZGlzcEhlaWdodCA9IDY0O1xuICAgIHZhciBkaXNwID0gbmV3IFVpbnQ4QXJyYXkoZGlzcFdpZHRoICogZGlzcEhlaWdodCAqIDQpO1xuICAgIHZhciByYWRpdXMgPSBkaXNwV2lkdGggLyA4O1xuXG4gICAgZm9yICh2YXIgeSA9IDA7IHkgPCBkaXNwSGVpZ2h0OyArK3kpIHtcbiAgICAgIHZhciBkeSA9IGRpc3BIZWlnaHQgLyAyIC0geTtcbiAgICAgIHZhciBkdiA9IGZsaXAoY2xhbXAoZHkgLyByYWRpdXMsIC0xLCAxKSk7XG4gICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGRpc3BXaWR0aDsgKyt4KSB7XG4gICAgICAgIHZhciBkeCA9IHggLSBkaXNwV2lkdGggLyAyO1xuICAgICAgICB2YXIgZHUgPSBmbGlwKGNsYW1wKGR4IC8gcmFkaXVzLCAtMSwgMSkpO1xuICAgICAgICB2YXIgb2ZmID0gKHkgKiBkaXNwV2lkdGggKyB4KSAqIDQ7XG4gICAgICAgIGRpc3Bbb2ZmICsgMF0gPSAoLWR1ICogLjUgKyAuNSkgKiAyNTU7XG4gICAgICAgIGRpc3Bbb2ZmICsgMV0gPSAoLWR2ICogLjUgKyAuNSkgKiAyNTU7XG4gICAgICAgIGRpc3Bbb2ZmICsgM10gPSAyNTU7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4gdHdnbC5jcmVhdGVUZXh0dXJlKGdsLCB7XG4gICAgICBzcmM6IGRpc3AsXG4gICAgfSk7XG4gIH1cblxuICB2YXIgZHBNYXAgPSB7IHdpZHRoOiAxLCBoZWlnaHQ6IDEgfTtcbiAgdmFyIGRpc3BUZXhcblxuICBjb25zdCB0ZXh0dXJJbWcgPSB0d2dsLmNyZWF0ZVRleHR1cmUoZ2wsIHtcbiAgICAvLyBzcmM6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvcHVibGljL2RwbWFwLmpwZycsXG4gICAgc3JjOiAncHVibGljL2RwbWFwLmpwZycsXG4gICAgY3Jvc3NPcmlnaW46ICcnLFxuICB9LCBmdW5jdGlvbihlcnIsIHRleHR1cmUsIHNvdXJjZSkge1xuICAgIGRwTWFwID0gc291cmNlO1xuICAgIGRpc3BUZXggPSB0ZXh0dXJlXG4gIH0pO1xuXG5cbiAgLy8gQ3JlYXRlcyBhIC0xIHRvICsxIHF1YWRcbiAgdmFyIHF1YWRCdWZmZXJJbmZvID0gdHdnbC5wcmltaXRpdmVzLmNyZWF0ZVhZUXVhZEJ1ZmZlckluZm8oZ2wpO1xuXG4gIC8vIENyZWF0ZXMgMiBSR0JBIHRleHR1cmUgKyBkZXB0aCBmcmFtZWJ1ZmZlcnNcbiAgdmFyIGZhZGVBdHRhY2htZW50cyA9IFtcbiAgICB7IGZvcm1hdDogZ2wuUkdCQSxcbiAgICAgIG1pbjogZ2wuTkVBUkVTVCxcbiAgICAgIG1heDogZ2wuTkVBUkVTVCxcbiAgICAgIHdyYXA6IGdsLkNMQU1QX1RPX0VER0UsXG4gICAgfSxcbiAgXTtcbiAgdmFyIGZhZGVGYmkxID0gdHdnbC5jcmVhdGVGcmFtZWJ1ZmZlckluZm8oZ2wsIGZhZGVBdHRhY2htZW50cyk7XG4gIHZhciBmYWRlRmJpMiA9IHR3Z2wuY3JlYXRlRnJhbWVidWZmZXJJbmZvKGdsLCBmYWRlQXR0YWNobWVudHMpO1xuXG4gIGZ1bmN0aW9uIGRyYXdUaGluZyhnbCwgeCwgeSwgcm90YXRpb24sIHNjYWxlKSB7XG4gICAgdmFyIG1hdHJpeCA9IG00Lm9ydGhvKDAsIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCwgMCwgLTEsIDEpO1xuICAgIG1hdHJpeCA9IG00LnRyYW5zbGF0ZShtYXRyaXgsIFt4LCB5LCAwXSk7XG4gICAgLy8gbWF0cml4ID0gbTQucm90YXRlWihtYXRyaXgsIHJvdGF0aW9uKTtcbiAgICBtYXRyaXggPSBtNC5zY2FsZShtYXRyaXgsIFtzY2FsZSwgc2NhbGUsIDFdKTtcblxuICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbUluZm8ucHJvZ3JhbSk7XG4gICAgdHdnbC5zZXRCdWZmZXJzQW5kQXR0cmlidXRlcyhnbCwgcHJvZ3JhbUluZm8sIHF1YWRCdWZmZXJJbmZvKTtcbiAgICB0d2dsLnNldFVuaWZvcm1zKHByb2dyYW1JbmZvLCB7XG4gICAgICB1X21hdHJpeDogbWF0cml4LFxuICAgICAgdV90ZXh0dXJlOiBkaXNwVGV4LFxuICAgICAgdV9tdWx0OiBbMSwgMSwgMSwgMC4yXSwgIC8vIHNldCBtdWx0IHNvIHdlIGNhbiBhZGp1c3QgYmxlbmRpbmdcbiAgICB9KTtcbiAgICB0d2dsLmRyYXdCdWZmZXJJbmZvKGdsLCBnbC5UUklBTkdMRVMsIHF1YWRCdWZmZXJJbmZvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmQobWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbik7XG4gIH1cblxuICBmdW5jdGlvbiBjbGFtcCh2LCBtaW4sIG1heCkge1xuICAgIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKG1heCwgdikpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmxpcCh2KSB7XG4gICAgcmV0dXJuIE1hdGguc2lnbih2KSAqICgxIC0gTWF0aC5hYnModikpO1xuICB9XG5cbiAgdmFyIGRyYXdSZWN0ID0gZmFsc2U7XG4gIHZhciByZWN0WDtcbiAgdmFyIHJlY3RZO1xuICB2YXIgY3VycmVudE1hdHJpeDtcblxuICBmdW5jdGlvbiByZW5kZXIodGltZSkge1xuICAgIGlmICh0d2dsLnJlc2l6ZUNhbnZhc1RvRGlzcGxheVNpemUoZ2wuY2FudmFzKSkge1xuICAgICAgLy8gc2V0IHRoZSBjbGVhciBjb2xvciB0byAwLjUgd2hpY2ggaXMgMCBkaXNwbGFjZW1lbnRcbiAgICAgIC8vIGZvciBvdXIgc2hhZGVyXG4gICAgICBnbC5jbGVhckNvbG9yKDAuNSwgMC41LCAwLjUsIDAuNSk7XG4gICAgICAvLyByZXNpemUgdGhlIGZyYW1lYnVmZmVyJ3MgYXR0YWNobWVudHMgc28gdGhlaXIgdGhlXG4gICAgICAvLyBzYW1lIHNpemUgYXMgdGhlIGNhbnZhc1xuICAgICAgdHdnbC5yZXNpemVGcmFtZWJ1ZmZlckluZm8oZ2wsIGZhZGVGYmkxLCBmYWRlQXR0YWNobWVudHMpO1xuICAgICAgLy8gY2xlYXIgdGhlIGNvbG9yIGJ1ZmZlciB0byAwLjVcbiAgICAgIHR3Z2wuYmluZEZyYW1lYnVmZmVySW5mbyhnbCwgZmFkZUZiaTEpO1xuICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG4gICAgICAvLyByZXNpemUgdGhlIDJuZCBmcmFtZWJ1ZmZlcidzIGF0dGFjaG1lbnRzIHNvIHRoZWlyIHRoZVxuICAgICAgLy8gc2FtZSBzaXplIGFzIHRoZSBjYW52YXNcbiAgICAgIHR3Z2wucmVzaXplRnJhbWVidWZmZXJJbmZvKGdsLCBmYWRlRmJpMiwgZmFkZUF0dGFjaG1lbnRzKTtcbiAgICAgIC8vIGNsZWFyIHRoZSBjb2xvciBidWZmZXIgdG8gMC41XG4gICAgICB0d2dsLmJpbmRGcmFtZWJ1ZmZlckluZm8oZ2wsIGZhZGVGYmkyKTtcbiAgICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuICAgIH1cblxuICAgIC8vIGZhZGUgYnkgY29weWluZyBmcm9tIGZhZGVGYmkxIGludG8gZmFiZUZiaTIgdXNpbmcgbWl4QW1vdW50LlxuICAgIC8vIGZhZGVGYmkyIHdpbGwgY29udGFpbiBtaXgoZmFkZUZiMSwgdV9mYWRlQ29sb3IsIHVfbWl4QW1vdW50KVxuICAgIHR3Z2wuYmluZEZyYW1lYnVmZmVySW5mbyhnbCwgZmFkZUZiaTIpO1xuXG4gICAgZ2wudXNlUHJvZ3JhbShmYWRlUHJvZ3JhbUluZm8ucHJvZ3JhbSk7XG4gICAgdHdnbC5zZXRCdWZmZXJzQW5kQXR0cmlidXRlcyhnbCwgZmFkZVByb2dyYW1JbmZvLCBxdWFkQnVmZmVySW5mbyk7XG4gICAgdHdnbC5zZXRVbmlmb3JtcyhmYWRlUHJvZ3JhbUluZm8sIHtcbiAgICAgIHVfbWF0cml4OiBtNC5pZGVudGl0eSgpLFxuICAgICAgdV90ZXh0dXJlOiBmYWRlRmJpMS5hdHRhY2htZW50c1swXSxcbiAgICAgIHVfbWl4QW1vdW50OiBtaXhBbW91bnQsXG4gICAgfSk7XG4gICAgdHdnbC5kcmF3QnVmZmVySW5mbyhnbCwgZ2wuVFJJQU5HTEVTLCBxdWFkQnVmZmVySW5mbyk7XG5cbiAgICBpZiAoZHJhd1JlY3QpIHtcbiAgICAgIGRyYXdSZWN0ID0gZmFsc2U7XG4gICAgICAvLyBub3cgZHJhdyBuZXcgc3R1ZmYgdG8gZmFkZUZiMi4gTm90aWNlIHdlIGRvbid0IGNsZWFyIVxuICAgICAgdHdnbC5iaW5kRnJhbWVidWZmZXJJbmZvKGdsLCBmYWRlRmJpMik7XG4gICAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgICAgZ2wuYmxlbmRGdW5jKGdsLk9ORSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSk7XG5cbiAgICAgIHZhciByb3RhdGlvbiA9IHRpbWUgKiAwLjAxO1xuICAgICAgdmFyIHNjYWxlID0gMzA7XG4gICAgICBkcmF3VGhpbmcoZ2wsIHJlY3RYLCByZWN0WSwgcm90YXRpb24sIHNjYWxlKTtcblxuICAgICAgZ2wuZGlzYWJsZShnbC5CTEVORCk7XG4gICAgfVxuXG4gICAgLy8gbm93IHVzZSBmYWRlRmJpMiBhcyBhIGRpc3BsYWNlbWVudCB3aGlsZSBkcmF3aW5nIHRleCB0byB0aGUgY2FudmFzXG4gICAgdHdnbC5iaW5kRnJhbWVidWZmZXJJbmZvKGdsLCBudWxsKTtcblxuICAgIHZhciBtYXQgPSBtNC5vcnRobygwLCBnbC5jYW52YXMuY2xpZW50V2lkdGgsIGdsLmNhbnZhcy5jbGllbnRIZWlnaHQsIDAsIC0xLCAxKTtcbiAgICBtYXQgPSBtNC50cmFuc2xhdGUobWF0LCBbZ2wuY2FudmFzLmNsaWVudFdpZHRoIC8gMiwgZ2wuY2FudmFzLmNsaWVudEhlaWdodCAvIDIsIDBdKTtcbiAgICBtYXQgPSBtNC5zY2FsZShtYXQsIFtpbWcud2lkdGggKiAxLjUsIGltZy5oZWlnaHQgKiAxLjUsIDFdKTtcblxuICAgIGN1cnJlbnRNYXRyaXggPSBtYXQ7XG5cbiAgICBnbC51c2VQcm9ncmFtKGRpc3BsYWNlUHJvZ3JhbUluZm8ucHJvZ3JhbSk7XG4gICAgdHdnbC5zZXRCdWZmZXJzQW5kQXR0cmlidXRlcyhnbCwgZGlzcGxhY2VQcm9ncmFtSW5mbywgcXVhZEJ1ZmZlckluZm8pO1xuICAgIHR3Z2wuc2V0VW5pZm9ybXMoZGlzcGxhY2VQcm9ncmFtSW5mbywge1xuICAgICAgdV9tYXRyaXg6IG1hdCxcbiAgICAgIHVfdGV4dHVyZTogdGV4LFxuICAgICAgdV9kaXNwbGFjZW1lbnRUZXh0dXJlOiBmYWRlRmJpMi5hdHRhY2htZW50c1swXSxcbiAgICAgIHVfZGlzcGxhY2VtZW50UmFuZ2U6IFswLjA1LCAwLjA1XSxcbiAgICB9KTtcbiAgICB0d2dsLmRyYXdCdWZmZXJJbmZvKGdsLCBnbC5UUklBTkdMRVMsIHF1YWRCdWZmZXJJbmZvKTtcblxuICAgIC8vIHN3YXAgdGhlIHZhcmlhYmxlcyBzbyB3ZSByZW5kZXIgdG8gdGhlIG9wcG9zaXRlIHRleHR1cmVzIG5leHQgdGltZVxuICAgIHZhciB0ZW1wID0gZmFkZUZiaTE7XG4gICAgZmFkZUZiaTEgPSBmYWRlRmJpMjtcbiAgICBmYWRlRmJpMiA9IHRlbXA7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgfVxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICBnbC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZXZlbnQsIHRhcmdldCkge1xuICAgIHRhcmdldCA9IHRhcmdldCB8fCBldmVudC50YXJnZXQ7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIGNvbnN0IHJ4ID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCByeSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcDtcblxuICAgIGNvbnN0IHggPSByeCAqIHRhcmdldC53aWR0aCAgLyB0YXJnZXQuY2xpZW50V2lkdGg7XG4gICAgY29uc3QgeSA9IHJ5ICogdGFyZ2V0LmhlaWdodCAvIHRhcmdldC5jbGllbnRIZWlnaHQ7XG5cbiAgICAvLyByZXZlcnNlIHByb2plY3QgdGhlIG1vdXNlIG9udG8gdGhlIGltYWdlXG4gICAgdmFyIHJtYXQgPSBtNC5pbnZlcnNlKGN1cnJlbnRNYXRyaXgpO1xuICAgIHZhciBjbGlwc3BhY2VQb2ludCA9IFt4IC8gdGFyZ2V0LndpZHRoICogMiAtIDEsIC0oeSAvIHRhcmdldC5oZWlnaHQgKiAyIC0gMSksIDBdO1xuICAgIHZhciBzID0gbTQudHJhbnNmb3JtUG9pbnQocm1hdCwgY2xpcHNwYWNlUG9pbnQpO1xuXG4gICAgLy8gcyBpcyBub3cgYSBwb2ludCBpbiB0aGUgc3BhY2Ugb2YgdGhlIGltYWdlJ3MgcXVhZC4gVGhlIHF1YWQgZ29lcyAtMSB0byAxXG4gICAgLy8gYW5kIHdlJ3JlIGdvaW5nIHRvIGRyYXcgaW50byBpdCB1c2luZyBwaXhlbHMgYmVjYXVzZSBkcmF3VGhpbmcgdGFrZXNcbiAgICAvLyBhIHBpeGVsIHZhbHVlIGFuZCBvdXIgZGlzcGxhY2VtZW50IG1hcCBpcyB0aGUgc2FtZSBzaXplIGFzIHRoZSBjYW52YXNcbiAgICBkcmF3UmVjdCA9IHRydWU7XG4gICAgcmVjdFggPSAoIHNbMF0gKiAuNSArIC41KSAqIGdsLmNhbnZhcy53aWR0aDtcbiAgICByZWN0WSA9ICgtc1sxXSAqIC41ICsgLjUpICogZ2wuY2FudmFzLmhlaWdodDtcbiAgfSk7XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgZHAyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9kaXNwbGFjZS0yLmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9qcy9kaXNwbGFjZS0yLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGZpbmQgfSBmcm9tICcuL3V0aWxzL2VsZW1lbnRzJ1xuLy8gaW1wb3J0IHBpeGkgZnJvbSAnLi9waXhpanMtMScgLy8gZmlyc3QgZGVtbyBhcXVhIG1hZ25pZnlcbi8vIGltcG9ydCBwaXhpIGZyb20gJy4vcmVzaXplJ1xuLy8gaW1wb3J0IGxpcXVpZnkgZnJvbSAnLi9saXF1aWZ5LW9uZSdcbi8vIGltcG9ydCBsaXF1aWZ5IGZyb20gJy4vbGlxdWlmeS10d28nXG4vLyBpbXBvcnQgc21va2V5IGZyb20gJy4vc21va2UnXG4vLyBpbXBvcnQgd2F0ZXJJbWFnZSBmcm9tICcuL3dhdGVyLWltYWdlJ1xuLy8gaW1wb3J0IHNpbXBsZURpc3BsYWNlbWVudCBmcm9tICcuL3NpbXBsZS1kaXNwbGFjZW1lbnQnXG4vLyBpbXBvcnQgc21lYXIgZnJvbSAnLi9zbWVhcidcbi8vIGltcG9ydCB3b2JibGUgZnJvbSAnLi93b2JibGUnXG4vLyBpbXBvcnQgcmVnbCBmcm9tICcuL3JlZ2wnXG4vLyBpbXBvcnQgd2F0ZXIgZnJvbSAnLi90aHJlZS13YXRlcidcbi8vIGltcG9ydCB3YXRlckZsdWlkIGZyb20gJy4uLy4uL3B1YmxpYy93YXRlci1mbHVpZC9tYWluJ1xuLy9cbmltcG9ydCBkcDIgZnJvbSAnLi9kaXNwbGFjZS0yJ1xuaW1wb3J0IHN0eWxlcyBmcm9tICcuLi9zdHlsZXMvc3R5bGVzLnNjc3MnXG5cblxuY29uc3QgZG9jUmVhZHkgPSAoLyogZXZlbnQgKi8pID0+IHtcbiAgLy8gcGl4aSgpXG4gIC8vIGxpcXVpZnkoKVxuICAvLyBzbW9rZXkoKVxuICAvLyBzbW9rZXlQaXhpKClcbiAgLy8gd2F0ZXJJbWFnZSgpXG4gIC8vIHNpbXBsZURpc3BsYWNlbWVudCgpXG4gIC8vIHNtZWFyKClcbiAgLy8gd29iYmxlKClcbiAgLy8gcmVnbCgpXG4gIC8vIHdhdGVyKClcbiAgLy8gd2F0ZXJGbHVpZCgpXG4gIC8vIHJlZ2woKVxuXG4gIGRwMihmaW5kKCcuYy1pbWcnKVswXSwge1xuICAgIGltZzogJ2h0dHBzOi8vZmFybTYuc3RhdGljZmxpY2tyLmNvbS81MDc4LzE0MDMyOTM1NTU5XzhjMTNlOWIxODFfel9kLmpwZydcbiAgfSlcblxuICBkcDIoZmluZCgnLmMtbG9nbycpWzBdLCB7XG4gICAgLy8gaW1nOiAncHVibGljL3R1cnRsZS01MTIuanBnJ1xuICAgIGltZzogJ3B1YmxpYy9jYXJnby1sb2dvLnBuZydcbiAgfSlcbn1cblxuY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGRvY1JlYWR5KVxufVxuXG5cbmluaXQoKVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2pzL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjb25zdCBmaW5kID0gKHF1ZXJ5U2VsZWN0b3IsIGVsZW1lbnQgPSBkb2N1bWVudCkgPT5cbiAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5U2VsZWN0b3IpKVxuXG5jb25zdCBpc0VsZW1lbnQgPSAoZWwpID0+IHtcbiAgdHJ5IHtcbiAgICAvLyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbWUpXG4gICAgLy8gcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgIGlmICghKGVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gZmluZChlbClbMF0ubGVuZ3RoID4gMFxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gQnJvd3NlcnMgbm90IHN1cHBvcnRpbmcgVzMgRE9NMiBkb24ndCBoYXZlIEhUTUxFbGVtZW50IGFuZFxuICAgIC8vIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG4gICAgcmV0dXJuICh0eXBlb2YgZWwgPT09ICdvYmplY3QnKSAmJlxuICAgICAgKGVsLm5vZGVUeXBlID09PSAxKSAmJiAodHlwZW9mIGVsLnN0eWxlID09PSAnb2JqZWN0JykgJiZcbiAgICAgICh0eXBlb2YgZWwub3duZXJEb2N1bWVudCA9PT0gJ29iamVjdCcpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGhhc0NsYXNzID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT4ge1xuICBpZiAoIWlzRWxlbWVudChlbGVtZW50KSkgcmV0dXJuIGZhbHNlXG5cbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSlcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVnRXhwKGAoXnwgKSR7Y2xhc3NOYW1lfSggfCQpYCwgJ2dpJykudGVzdChlbGVtZW50LmNsYXNzTmFtZSlcbn1cblxuXG5leHBvcnQgY29uc3QgYWRkQ2xhc3MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PiB7XG4gIGlmICghaXNFbGVtZW50KGVsZW1lbnQpKSByZXR1cm4gZmFsc2VcblxuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKVxuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9IGAgJHtjbGFzc05hbWV9YFxuICB9XG4gIHJldHVybiBlbGVtZW50XG59XG5cblxuZXhwb3J0IGNvbnN0IHJlbW92ZUNsYXNzID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT4ge1xuICBpZiAoIWlzRWxlbWVudChlbGVtZW50KSkgcmV0dXJuIGZhbHNlXG5cbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSlcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UobmV3IFJlZ0V4cChgKF58XFxcXGIpJHtjbGFzc05hbWUuc3BsaXQoJyAnKS5qb2luKCd8Jyl9KFxcXFxifCQpYCwgJ2dpJyksICcgJylcbiAgfVxuICByZXR1cm4gZWxlbWVudFxufVxuXG5leHBvcnQgY29uc3QgdG9nZ2xlQ2xhc3MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PlxuICBoYXNDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpID8gcmVtb3ZlQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSA6IGFkZENsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSlcblxuXG5leHBvcnQgY29uc3QgZXhpc3RzID0gKHNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQpID0+IGVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgIT09IG51bGxcblxuZXhwb3J0IGNvbnN0IGZpbmRQYXJlbnRCeUNsYXNzID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT4ge1xuICBsZXQgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIGlmIChwYXJlbnQgIT09IG51bGwpIHtcbiAgICBpZiAoaGFzQ2xhc3MocGFyZW50LCBjbGFzc05hbWUpKSB7XG4gICAgICByZXR1cm4gcGFyZW50XG4gICAgfVxuXG4gICAgcGFyZW50ID0gZmluZFBhcmVudEJ5Q2xhc3MocGFyZW50LCBjbGFzc05hbWUpXG4gIH1cbiAgcmV0dXJuIHBhcmVudFxufVxuXG5leHBvcnQgY29uc3QgZmluZFBvcyA9IChvYmopID0+IHtcbiAgbGV0IGN1cmxlZnQgPSAwXG4gIGxldCBjdXJ0b3AgPSAwXG5cbiAgaWYgKG9iai5vZmZzZXRQYXJlbnQpIHtcbiAgICBkbyB7XG4gICAgICBjdXJsZWZ0ICs9IG9iai5vZmZzZXRMZWZ0XG4gICAgICBjdXJ0b3AgKz0gb2JqLm9mZnNldFRvcFxuICAgIH0gd2hpbGUgKG9iaiA9IG9iai5vZmZzZXRQYXJlbnQpXG5cbiAgICByZXR1cm4gW2N1cnRvcCwgY3VybGVmdF1cbiAgfVxuICByZXR1cm4gW2N1cnRvcCwgY3VybGVmdF1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL3V0aWxzL2VsZW1lbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9qcy91dGlscy9lbGVtZW50cy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlcy9zdHlsZXMuc2Nzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvc3R5bGVzL3N0eWxlcy5zY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=