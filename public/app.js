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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2Q4YWZmYjJhNzU3N2RmZTM3YzYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2Rpc3BsYWNlLTIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy9lbGVtZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3N0eWxlcy5zY3NzPzllY2IiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQSxxQkFBcUIsZUFBZTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxlQUFlO0FBQ2Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNwU2U7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBOzs7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDRCQUE0QixVQUFVO0FBQ3RDO0FBQUE7QUFBQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNILDZCQUE2QixVQUFVO0FBQ3ZDO0FBQ0E7QUFDQTtBQUFBO0FBQUE7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSCx1RUFBdUUsK0JBQStCO0FBQ3RHO0FBQ0E7QUFDQTtBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUFBO0FBQUE7OztBQUdBO0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7OztBQ3RGQSx5QyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvcHVibGljL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDdkOGFmZmIyYTc1NzdkZmUzN2M2IiwiY29uc3QgZHAyID0gKGNhbnZhcywgb3B0aW9ucykgPT4ge1xuICB2YXIgdnMgPSBgXG5hdHRyaWJ1dGUgdmVjNCBwb3NpdGlvbjtcbmF0dHJpYnV0ZSB2ZWMyIHRleGNvb3JkO1xuXG51bmlmb3JtIG1hdDQgdV9tYXRyaXg7XG5cbnZhcnlpbmcgdmVjMiB2X3RleGNvb3JkO1xuXG52b2lkIG1haW4oKSB7XG4gIGdsX1Bvc2l0aW9uID0gdV9tYXRyaXggKiBwb3NpdGlvbjtcbiAgdl90ZXhjb29yZCA9IHRleGNvb3JkO1xufVxuYDtcblxuICB2YXIgZnMgPSBgXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcblxudmFyeWluZyB2ZWMyIHZfdGV4Y29vcmQ7XG5cbnVuaWZvcm0gc2FtcGxlcjJEIHVfdGV4dHVyZTtcbnVuaWZvcm0gdmVjNCB1X211bHQ7XG5cbnZvaWQgbWFpbigpIHtcbiAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVfdGV4dHVyZSwgdl90ZXhjb29yZCkgKiB1X211bHQ7XG4gIGdsX0ZyYWdDb2xvci5yZ2IgKj0gZ2xfRnJhZ0NvbG9yLmE7ICAvLyBwcmVtdWx0aXBseSBhbHBoYSBzbyBibGVuZGluZyB3b3Jrc1xufVxuYDtcbiAgdmFyIHZzUXVhZCA9IGBcbmF0dHJpYnV0ZSB2ZWM0IHBvc2l0aW9uO1xuYXR0cmlidXRlIHZlYzIgdGV4Y29vcmQ7XG5cbnVuaWZvcm0gbWF0NCB1X21hdHJpeDtcblxudmFyeWluZyB2ZWMyIHZfdGV4Y29vcmQ7XG5cbnZvaWQgbWFpbigpIHtcbiAgZ2xfUG9zaXRpb24gPSB1X21hdHJpeCAqIHBvc2l0aW9uO1xuICB2X3RleGNvb3JkID0gdGV4Y29vcmQ7XG59XG5gO1xuICB2YXIgZnNGYWRlID0gYFxucHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG5cbnZhcnlpbmcgdmVjMiB2X3RleGNvb3JkO1xuXG51bmlmb3JtIHNhbXBsZXIyRCB1X3RleHR1cmU7XG51bmlmb3JtIGZsb2F0IHVfbWl4QW1vdW50O1xuXG5jb25zdCBmbG9hdCBrRXBzaWxvbiA9IDIuLzI1Ni47XG5cbnZvaWQgbWFpbigpIHtcbiAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1X3RleHR1cmUsIHZfdGV4Y29vcmQpICogMi4gLSAxLjtcbiAgdmVjNCBhZGp1c3QgPSAtY29sb3IgKiB1X21peEFtb3VudDtcbiAgYWRqdXN0ID0gbWl4KGFkanVzdCwgc2lnbihjb2xvcikgKiAta0Vwc2lsb24sIHN0ZXAoYWJzKGFkanVzdCksIHZlYzQoa0Vwc2lsb24pKSk7XG4gIGNvbG9yICs9IGFkanVzdDtcbiAgZ2xfRnJhZ0NvbG9yID0gY29sb3IgKiAuNSArIC41O1xufVxuYDtcbiAgdmFyIGZzRGlzcGxhY2UgPSBgXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcblxudmFyeWluZyB2ZWMyIHZfdGV4Y29vcmQ7XG5cbnVuaWZvcm0gc2FtcGxlcjJEIHVfdGV4dHVyZTtcbnVuaWZvcm0gc2FtcGxlcjJEIHVfZGlzcGxhY2VtZW50VGV4dHVyZTtcbnVuaWZvcm0gdmVjMiB1X2Rpc3BsYWNlbWVudFJhbmdlO1xuXG52b2lkIG1haW4oKSB7XG5cbiAgLy8gYXNzdW1pbmcgdGhlIGRpc3BsYWNlbWVudCB0ZXh0dXJlIGlzIHRoZSBzYW1lIHNpemUgYXNcbiAgLy8gdGhlIG1haW4gdGV4dHVyZSB5b3UgY2FuIHVzZSB0aGUgc2FtZSB0ZXh0dXJlIGNvb3Jkc1xuXG4gIC8vIGZpcnN0IGxvb2sgdXAgdGhlIGRpc3BsYWNlbWVudCBhbmQgY29udmVydCB0byAtMSA8LT4gMSByYW5nZVxuICAvLyB3ZSdyZSBvbmx5IHVzaW5nIHRoZSBSIGFuZCBHIGNoYW5uZWxzIHdoaWNoIHdpbGwgYmVjb21lIFUgYW5kIFZcbiAgLy8gZGlzcGxhY2VtZW50cyB0byBvdXIgdGV4dHVyZSBjb29yZGluYXRlc1xuICB2ZWMyIGRpc3BsYWNlbWVudCA9IHRleHR1cmUyRCh1X2Rpc3BsYWNlbWVudFRleHR1cmUsIHZfdGV4Y29vcmQpLnJnICogMi4gLSAxLjtcblxuICB2ZWMyIHV2ID0gdl90ZXhjb29yZCArIGRpc3BsYWNlbWVudCAqIHVfZGlzcGxhY2VtZW50UmFuZ2U7XG5cbiAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVfdGV4dHVyZSwgdXYpO1xufVxuYDtcblxuICB2YXIgJCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IuYmluZChkb2N1bWVudCk7XG5cbiAgdmFyIG1peEFtb3VudCA9IDAuMDM7XG5cbiAgLy8gdmFyIGdsID0gJChcImNhbnZhc1wiKS5nZXRDb250ZXh0KFwid2ViZ2xcIik7XG4gIHZhciBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIik7XG4gIHZhciBtNCA9IHR3Z2wubTQ7XG4gIHZhciBwcm9ncmFtSW5mbyA9IHR3Z2wuY3JlYXRlUHJvZ3JhbUluZm8oZ2wsIFt2cywgZnNdKTtcbiAgdmFyIGZhZGVQcm9ncmFtSW5mbyA9IHR3Z2wuY3JlYXRlUHJvZ3JhbUluZm8oZ2wsIFt2c1F1YWQsIGZzRmFkZV0pO1xuICB2YXIgZGlzcGxhY2VQcm9ncmFtSW5mbyA9IHR3Z2wuY3JlYXRlUHJvZ3JhbUluZm8oZ2wsIFt2c1F1YWQsIGZzRGlzcGxhY2VdKTtcblxuICAvLyB0aGlzIHdpbGwgYmUgcmVwbGFjZWQgd2hlbiB0aGUgaW1hZ2UgaGFzIGxvYWRlZDtcbiAgdmFyIGltZyA9IHsgd2lkdGg6IDEsIGhlaWdodDogMSB9O1xuXG4gIGNvbnN0IHRleCA9IHR3Z2wuY3JlYXRlVGV4dHVyZShnbCwge1xuICAgIHNyYzogb3B0aW9ucy5pbWcsXG4gICAgY3Jvc3NPcmlnaW46ICcnLFxuICB9LCBmdW5jdGlvbihlcnIsIHRleHR1cmUsIHNvdXJjZSkge1xuICAgIGltZyA9IHNvdXJjZTtcbiAgfSk7XG5cbiAgLy8gbWFrZSBhIGRpc3BsYWNlbWVudCB0ZXh0dXJlLCAxMjcgPSBubyBkaXNwbGFjZW1lbnRcbiAgZnVuY3Rpb24gbWFrZURpc3BUZXh0dXJlKCkge1xuICAgIHZhciBkaXNwV2lkdGggPSA2NDtcbiAgICB2YXIgZGlzcEhlaWdodCA9IDY0O1xuICAgIHZhciBkaXNwID0gbmV3IFVpbnQ4QXJyYXkoZGlzcFdpZHRoICogZGlzcEhlaWdodCAqIDQpO1xuICAgIHZhciByYWRpdXMgPSBkaXNwV2lkdGggLyA4O1xuXG4gICAgZm9yICh2YXIgeSA9IDA7IHkgPCBkaXNwSGVpZ2h0OyArK3kpIHtcbiAgICAgIHZhciBkeSA9IGRpc3BIZWlnaHQgLyAyIC0geTtcbiAgICAgIHZhciBkdiA9IGZsaXAoY2xhbXAoZHkgLyByYWRpdXMsIC0xLCAxKSk7XG4gICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGRpc3BXaWR0aDsgKyt4KSB7XG4gICAgICAgIHZhciBkeCA9IHggLSBkaXNwV2lkdGggLyAyO1xuICAgICAgICB2YXIgZHUgPSBmbGlwKGNsYW1wKGR4IC8gcmFkaXVzLCAtMSwgMSkpO1xuICAgICAgICB2YXIgb2ZmID0gKHkgKiBkaXNwV2lkdGggKyB4KSAqIDQ7XG4gICAgICAgIGRpc3Bbb2ZmICsgMF0gPSAoLWR1ICogLjUgKyAuNSkgKiAyNTU7XG4gICAgICAgIGRpc3Bbb2ZmICsgMV0gPSAoLWR2ICogLjUgKyAuNSkgKiAyNTU7XG4gICAgICAgIGRpc3Bbb2ZmICsgM10gPSAyNTU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0d2dsLmNyZWF0ZVRleHR1cmUoZ2wsIHtcbiAgICAgIHNyYzogZGlzcCxcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBkcE1hcCA9IHsgd2lkdGg6IDEsIGhlaWdodDogMSB9O1xuICB2YXIgZGlzcFRleFxuXG4gIGNvbnN0IHRleHR1ckltZyA9IHR3Z2wuY3JlYXRlVGV4dHVyZShnbCwge1xuICAgIC8vIHNyYzogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wdWJsaWMvZHBtYXAuanBnJyxcbiAgICBzcmM6ICdwdWJsaWMvZHBtYXAuanBnJyxcbiAgICBjcm9zc09yaWdpbjogJycsXG4gIH0sIGZ1bmN0aW9uKGVyciwgdGV4dHVyZSwgc291cmNlKSB7XG4gICAgZHBNYXAgPSBzb3VyY2U7XG4gICAgZGlzcFRleCA9IHRleHR1cmVcbiAgfSk7XG5cblxuICAvLyBDcmVhdGVzIGEgLTEgdG8gKzEgcXVhZFxuICB2YXIgcXVhZEJ1ZmZlckluZm8gPSB0d2dsLnByaW1pdGl2ZXMuY3JlYXRlWFlRdWFkQnVmZmVySW5mbyhnbCk7XG5cbiAgLy8gQ3JlYXRlcyAyIFJHQkEgdGV4dHVyZSArIGRlcHRoIGZyYW1lYnVmZmVyc1xuICB2YXIgZmFkZUF0dGFjaG1lbnRzID0gW1xuICAgIHsgZm9ybWF0OiBnbC5SR0JBLFxuICAgICAgbWluOiBnbC5ORUFSRVNULFxuICAgICAgbWF4OiBnbC5ORUFSRVNULFxuICAgICAgd3JhcDogZ2wuQ0xBTVBfVE9fRURHRSxcbiAgICB9LFxuICBdO1xuICB2YXIgZmFkZUZiaTEgPSB0d2dsLmNyZWF0ZUZyYW1lYnVmZmVySW5mbyhnbCwgZmFkZUF0dGFjaG1lbnRzKTtcbiAgdmFyIGZhZGVGYmkyID0gdHdnbC5jcmVhdGVGcmFtZWJ1ZmZlckluZm8oZ2wsIGZhZGVBdHRhY2htZW50cyk7XG5cbiAgZnVuY3Rpb24gZHJhd1RoaW5nKGdsLCB4LCB5LCByb3RhdGlvbiwgc2NhbGUpIHtcbiAgICB2YXIgbWF0cml4ID0gbTQub3J0aG8oMCwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0LCAwLCAtMSwgMSk7XG4gICAgbWF0cml4ID0gbTQudHJhbnNsYXRlKG1hdHJpeCwgW3gsIHksIDBdKTtcbiAgICAvLyBtYXRyaXggPSBtNC5yb3RhdGVaKG1hdHJpeCwgcm90YXRpb24pO1xuICAgIG1hdHJpeCA9IG00LnNjYWxlKG1hdHJpeCwgW3NjYWxlLCBzY2FsZSwgMV0pO1xuXG4gICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtSW5mby5wcm9ncmFtKTtcbiAgICB0d2dsLnNldEJ1ZmZlcnNBbmRBdHRyaWJ1dGVzKGdsLCBwcm9ncmFtSW5mbywgcXVhZEJ1ZmZlckluZm8pO1xuICAgIHR3Z2wuc2V0VW5pZm9ybXMocHJvZ3JhbUluZm8sIHtcbiAgICAgIHVfbWF0cml4OiBtYXRyaXgsXG4gICAgICB1X3RleHR1cmU6IGRpc3BUZXgsXG4gICAgICB1X211bHQ6IFsxLCAxLCAxLCAwLjJdLCAgLy8gc2V0IG11bHQgc28gd2UgY2FuIGFkanVzdCBibGVuZGluZ1xuICAgIH0pO1xuICAgIHR3Z2wuZHJhd0J1ZmZlckluZm8oZ2wsIGdsLlRSSUFOR0xFUywgcXVhZEJ1ZmZlckluZm8pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZChtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsYW1wKHYsIG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4obWF4LCB2KSk7XG4gIH1cblxuICBmdW5jdGlvbiBmbGlwKHYpIHtcbiAgICByZXR1cm4gTWF0aC5zaWduKHYpICogKDEgLSBNYXRoLmFicyh2KSk7XG4gIH1cblxuICB2YXIgZHJhd1JlY3QgPSBmYWxzZTtcbiAgdmFyIHJlY3RYO1xuICB2YXIgcmVjdFk7XG4gIHZhciBjdXJyZW50TWF0cml4O1xuXG4gIGZ1bmN0aW9uIHJlbmRlcih0aW1lKSB7XG4gICAgaWYgKHR3Z2wucmVzaXplQ2FudmFzVG9EaXNwbGF5U2l6ZShnbC5jYW52YXMpKSB7XG4gICAgICAvLyBzZXQgdGhlIGNsZWFyIGNvbG9yIHRvIDAuNSB3aGljaCBpcyAwIGRpc3BsYWNlbWVudFxuICAgICAgLy8gZm9yIG91ciBzaGFkZXJcbiAgICAgIGdsLmNsZWFyQ29sb3IoMC41LCAwLjUsIDAuNSwgMC41KTtcbiAgICAgIC8vIHJlc2l6ZSB0aGUgZnJhbWVidWZmZXIncyBhdHRhY2htZW50cyBzbyB0aGVpciB0aGVcbiAgICAgIC8vIHNhbWUgc2l6ZSBhcyB0aGUgY2FudmFzXG4gICAgICB0d2dsLnJlc2l6ZUZyYW1lYnVmZmVySW5mbyhnbCwgZmFkZUZiaTEsIGZhZGVBdHRhY2htZW50cyk7XG4gICAgICAvLyBjbGVhciB0aGUgY29sb3IgYnVmZmVyIHRvIDAuNVxuICAgICAgdHdnbC5iaW5kRnJhbWVidWZmZXJJbmZvKGdsLCBmYWRlRmJpMSk7XG4gICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgICAgIC8vIHJlc2l6ZSB0aGUgMm5kIGZyYW1lYnVmZmVyJ3MgYXR0YWNobWVudHMgc28gdGhlaXIgdGhlXG4gICAgICAvLyBzYW1lIHNpemUgYXMgdGhlIGNhbnZhc1xuICAgICAgdHdnbC5yZXNpemVGcmFtZWJ1ZmZlckluZm8oZ2wsIGZhZGVGYmkyLCBmYWRlQXR0YWNobWVudHMpO1xuICAgICAgLy8gY2xlYXIgdGhlIGNvbG9yIGJ1ZmZlciB0byAwLjVcbiAgICAgIHR3Z2wuYmluZEZyYW1lYnVmZmVySW5mbyhnbCwgZmFkZUZiaTIpO1xuICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG4gICAgfVxuXG4gICAgLy8gZmFkZSBieSBjb3B5aW5nIGZyb20gZmFkZUZiaTEgaW50byBmYWJlRmJpMiB1c2luZyBtaXhBbW91bnQuXG4gICAgLy8gZmFkZUZiaTIgd2lsbCBjb250YWluIG1peChmYWRlRmIxLCB1X2ZhZGVDb2xvciwgdV9taXhBbW91bnQpXG4gICAgdHdnbC5iaW5kRnJhbWVidWZmZXJJbmZvKGdsLCBmYWRlRmJpMik7XG5cbiAgICBnbC51c2VQcm9ncmFtKGZhZGVQcm9ncmFtSW5mby5wcm9ncmFtKTtcbiAgICB0d2dsLnNldEJ1ZmZlcnNBbmRBdHRyaWJ1dGVzKGdsLCBmYWRlUHJvZ3JhbUluZm8sIHF1YWRCdWZmZXJJbmZvKTtcbiAgICB0d2dsLnNldFVuaWZvcm1zKGZhZGVQcm9ncmFtSW5mbywge1xuICAgICAgdV9tYXRyaXg6IG00LmlkZW50aXR5KCksXG4gICAgICB1X3RleHR1cmU6IGZhZGVGYmkxLmF0dGFjaG1lbnRzWzBdLFxuICAgICAgdV9taXhBbW91bnQ6IG1peEFtb3VudCxcbiAgICB9KTtcbiAgICB0d2dsLmRyYXdCdWZmZXJJbmZvKGdsLCBnbC5UUklBTkdMRVMsIHF1YWRCdWZmZXJJbmZvKTtcblxuICAgIGlmIChkcmF3UmVjdCkge1xuICAgICAgZHJhd1JlY3QgPSBmYWxzZTtcbiAgICAgIC8vIG5vdyBkcmF3IG5ldyBzdHVmZiB0byBmYWRlRmIyLiBOb3RpY2Ugd2UgZG9uJ3QgY2xlYXIhXG4gICAgICB0d2dsLmJpbmRGcmFtZWJ1ZmZlckluZm8oZ2wsIGZhZGVGYmkyKTtcbiAgICAgIGdsLmVuYWJsZShnbC5CTEVORCk7XG4gICAgICBnbC5ibGVuZEZ1bmMoZ2wuT05FLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBKTtcblxuICAgICAgdmFyIHJvdGF0aW9uID0gdGltZSAqIDAuMDE7XG4gICAgICB2YXIgc2NhbGUgPSAzMDtcbiAgICAgIGRyYXdUaGluZyhnbCwgcmVjdFgsIHJlY3RZLCByb3RhdGlvbiwgc2NhbGUpO1xuXG4gICAgICBnbC5kaXNhYmxlKGdsLkJMRU5EKTtcbiAgICB9XG5cbiAgICAvLyBub3cgdXNlIGZhZGVGYmkyIGFzIGEgZGlzcGxhY2VtZW50IHdoaWxlIGRyYXdpbmcgdGV4IHRvIHRoZSBjYW52YXNcbiAgICB0d2dsLmJpbmRGcmFtZWJ1ZmZlckluZm8oZ2wsIG51bGwpO1xuXG4gICAgdmFyIG1hdCA9IG00Lm9ydGhvKDAsIGdsLmNhbnZhcy5jbGllbnRXaWR0aCwgZ2wuY2FudmFzLmNsaWVudEhlaWdodCwgMCwgLTEsIDEpO1xuICAgIG1hdCA9IG00LnRyYW5zbGF0ZShtYXQsIFtnbC5jYW52YXMuY2xpZW50V2lkdGggLyAyLCBnbC5jYW52YXMuY2xpZW50SGVpZ2h0IC8gMiwgMF0pO1xuICAgIG1hdCA9IG00LnNjYWxlKG1hdCwgW2ltZy53aWR0aCAqIDEuNSwgaW1nLmhlaWdodCAqIDEuNSwgMV0pO1xuXG4gICAgY3VycmVudE1hdHJpeCA9IG1hdDtcblxuICAgIGdsLnVzZVByb2dyYW0oZGlzcGxhY2VQcm9ncmFtSW5mby5wcm9ncmFtKTtcbiAgICB0d2dsLnNldEJ1ZmZlcnNBbmRBdHRyaWJ1dGVzKGdsLCBkaXNwbGFjZVByb2dyYW1JbmZvLCBxdWFkQnVmZmVySW5mbyk7XG4gICAgdHdnbC5zZXRVbmlmb3JtcyhkaXNwbGFjZVByb2dyYW1JbmZvLCB7XG4gICAgICB1X21hdHJpeDogbWF0LFxuICAgICAgdV90ZXh0dXJlOiB0ZXgsXG4gICAgICB1X2Rpc3BsYWNlbWVudFRleHR1cmU6IGZhZGVGYmkyLmF0dGFjaG1lbnRzWzBdLFxuICAgICAgdV9kaXNwbGFjZW1lbnRSYW5nZTogWzAuMDUsIDAuMDVdLFxuICAgIH0pO1xuICAgIHR3Z2wuZHJhd0J1ZmZlckluZm8oZ2wsIGdsLlRSSUFOR0xFUywgcXVhZEJ1ZmZlckluZm8pO1xuXG4gICAgLy8gc3dhcCB0aGUgdmFyaWFibGVzIHNvIHdlIHJlbmRlciB0byB0aGUgb3Bwb3NpdGUgdGV4dHVyZXMgbmV4dCB0aW1lXG4gICAgdmFyIHRlbXAgPSBmYWRlRmJpMTtcbiAgICBmYWRlRmJpMSA9IGZhZGVGYmkyO1xuICAgIGZhZGVGYmkyID0gdGVtcDtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICB9XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG4gIGdsLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihldmVudCwgdGFyZ2V0KSB7XG4gICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IGV2ZW50LnRhcmdldDtcbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgY29uc3QgcnggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IHJ5ID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgY29uc3QgeCA9IHJ4ICogdGFyZ2V0LndpZHRoICAvIHRhcmdldC5jbGllbnRXaWR0aDtcbiAgICBjb25zdCB5ID0gcnkgKiB0YXJnZXQuaGVpZ2h0IC8gdGFyZ2V0LmNsaWVudEhlaWdodDtcblxuICAgIC8vIHJldmVyc2UgcHJvamVjdCB0aGUgbW91c2Ugb250byB0aGUgaW1hZ2VcbiAgICB2YXIgcm1hdCA9IG00LmludmVyc2UoY3VycmVudE1hdHJpeCk7XG4gICAgdmFyIGNsaXBzcGFjZVBvaW50ID0gW3ggLyB0YXJnZXQud2lkdGggKiAyIC0gMSwgLSh5IC8gdGFyZ2V0LmhlaWdodCAqIDIgLSAxKSwgMF07XG4gICAgdmFyIHMgPSBtNC50cmFuc2Zvcm1Qb2ludChybWF0LCBjbGlwc3BhY2VQb2ludCk7XG5cbiAgICAvLyBzIGlzIG5vdyBhIHBvaW50IGluIHRoZSBzcGFjZSBvZiB0aGUgaW1hZ2UncyBxdWFkLiBUaGUgcXVhZCBnb2VzIC0xIHRvIDFcbiAgICAvLyBhbmQgd2UncmUgZ29pbmcgdG8gZHJhdyBpbnRvIGl0IHVzaW5nIHBpeGVscyBiZWNhdXNlIGRyYXdUaGluZyB0YWtlc1xuICAgIC8vIGEgcGl4ZWwgdmFsdWUgYW5kIG91ciBkaXNwbGFjZW1lbnQgbWFwIGlzIHRoZSBzYW1lIHNpemUgYXMgdGhlIGNhbnZhc1xuICAgIGRyYXdSZWN0ID0gdHJ1ZTtcbiAgICByZWN0WCA9ICggc1swXSAqIC41ICsgLjUpICogZ2wuY2FudmFzLndpZHRoO1xuICAgIHJlY3RZID0gKC1zWzFdICogLjUgKyAuNSkgKiBnbC5jYW52YXMuaGVpZ2h0O1xuICB9KTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBkcDJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL2Rpc3BsYWNlLTIuanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2pzL2Rpc3BsYWNlLTIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgZmluZCB9IGZyb20gJy4vdXRpbHMvZWxlbWVudHMnXG4vLyBpbXBvcnQgcGl4aSBmcm9tICcuL3BpeGlqcy0xJyAvLyBmaXJzdCBkZW1vIGFxdWEgbWFnbmlmeVxuLy8gaW1wb3J0IHBpeGkgZnJvbSAnLi9yZXNpemUnXG4vLyBpbXBvcnQgbGlxdWlmeSBmcm9tICcuL2xpcXVpZnktb25lJ1xuLy8gaW1wb3J0IGxpcXVpZnkgZnJvbSAnLi9saXF1aWZ5LXR3bydcbi8vIGltcG9ydCBzbW9rZXkgZnJvbSAnLi9zbW9rZSdcbi8vIGltcG9ydCB3YXRlckltYWdlIGZyb20gJy4vd2F0ZXItaW1hZ2UnXG4vLyBpbXBvcnQgc2ltcGxlRGlzcGxhY2VtZW50IGZyb20gJy4vc2ltcGxlLWRpc3BsYWNlbWVudCdcbi8vIGltcG9ydCBzbWVhciBmcm9tICcuL3NtZWFyJ1xuLy8gaW1wb3J0IHdvYmJsZSBmcm9tICcuL3dvYmJsZSdcbi8vIGltcG9ydCByZWdsIGZyb20gJy4vcmVnbCdcbi8vIGltcG9ydCB3YXRlciBmcm9tICcuL3RocmVlLXdhdGVyJ1xuLy8gaW1wb3J0IHdhdGVyRmx1aWQgZnJvbSAnLi4vLi4vcHVibGljL3dhdGVyLWZsdWlkL21haW4nXG4vL1xuaW1wb3J0IGRwMiBmcm9tICcuL2Rpc3BsYWNlLTInXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4uL3N0eWxlcy9zdHlsZXMuc2NzcydcblxuXG5jb25zdCBkb2NSZWFkeSA9ICgvKiBldmVudCAqLykgPT4ge1xuICAvLyBwaXhpKClcbiAgLy8gbGlxdWlmeSgpXG4gIC8vIHNtb2tleSgpXG4gIC8vIHNtb2tleVBpeGkoKVxuICAvLyB3YXRlckltYWdlKClcbiAgLy8gc2ltcGxlRGlzcGxhY2VtZW50KClcbiAgLy8gc21lYXIoKVxuICAvLyB3b2JibGUoKVxuICAvLyByZWdsKClcbiAgLy8gd2F0ZXIoKVxuICAvLyB3YXRlckZsdWlkKClcbiAgLy8gcmVnbCgpXG5cbiAgZHAyKGZpbmQoJy5jLWltZycpWzBdLCB7XG4gICAgaW1nOiAnaHR0cHM6Ly9mYXJtNi5zdGF0aWNmbGlja3IuY29tLzUwNzgvMTQwMzI5MzU1NTlfOGMxM2U5YjE4MV96X2QuanBnJ1xuICB9KVxuXG4gIGRwMihmaW5kKCcuYy1sb2dvJylbMF0sIHtcbiAgICAvLyBpbWc6ICdwdWJsaWMvdHVydGxlLTUxMi5qcGcnXG4gICAgaW1nOiAncHVibGljL2NhcmdvLWxvZ28ucG5nJ1xuICB9KVxufVxuXG5jb25zdCBpbml0ID0gKCkgPT4ge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZG9jUmVhZHkpXG59XG5cblxuaW5pdCgpXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvanMvaW5kZXguanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNvbnN0IGZpbmQgPSAocXVlcnlTZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50KSA9PlxuICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnlTZWxlY3RvcikpXG5cbmNvbnN0IGlzRWxlbWVudCA9IChlbCkgPT4ge1xuICB0cnkge1xuICAgIC8vIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tZSlcbiAgICAvLyByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKCEoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgIHJldHVybiBmaW5kKGVsKVswXS5sZW5ndGggPiAwXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgLy8gYW4gZXhjZXB0aW9uIGlzIHRocm93biBhbmQgd2UgZW5kIHVwIGhlcmUuIFRlc3Rpbmcgc29tZVxuICAgIC8vIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcbiAgICByZXR1cm4gKHR5cGVvZiBlbCA9PT0gJ29iamVjdCcpICYmXG4gICAgICAoZWwubm9kZVR5cGUgPT09IDEpICYmICh0eXBlb2YgZWwuc3R5bGUgPT09ICdvYmplY3QnKSAmJlxuICAgICAgKHR5cGVvZiBlbC5vd25lckRvY3VtZW50ID09PSAnb2JqZWN0JylcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgaGFzQ2xhc3MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PiB7XG4gIGlmICghaXNFbGVtZW50KGVsZW1lbnQpKSByZXR1cm4gZmFsc2VcblxuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBSZWdFeHAoYChefCApJHtjbGFzc05hbWV9KCB8JClgLCAnZ2knKS50ZXN0KGVsZW1lbnQuY2xhc3NOYW1lKVxufVxuXG5cbmV4cG9ydCBjb25zdCBhZGRDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcbiAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkpIHJldHVybiBmYWxzZVxuXG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgKz0gYCAke2NsYXNzTmFtZX1gXG4gIH1cbiAgcmV0dXJuIGVsZW1lbnRcbn1cblxuXG5leHBvcnQgY29uc3QgcmVtb3ZlQ2xhc3MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PiB7XG4gIGlmICghaXNFbGVtZW50KGVsZW1lbnQpKSByZXR1cm4gZmFsc2VcblxuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKVxuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKGAoXnxcXFxcYikke2NsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKX0oXFxcXGJ8JClgLCAnZ2knKSwgJyAnKVxuICB9XG4gIHJldHVybiBlbGVtZW50XG59XG5cbmV4cG9ydCBjb25zdCB0b2dnbGVDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+XG4gIGhhc0NsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkgPyByZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIDogYWRkQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKVxuXG5cbmV4cG9ydCBjb25zdCBleGlzdHMgPSAoc2VsZWN0b3IsIGVsZW1lbnQgPSBkb2N1bWVudCkgPT4gZWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSAhPT0gbnVsbFxuXG5leHBvcnQgY29uc3QgZmluZFBhcmVudEJ5Q2xhc3MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PiB7XG4gIGxldCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgaWYgKHBhcmVudCAhPT0gbnVsbCkge1xuICAgIGlmIChoYXNDbGFzcyhwYXJlbnQsIGNsYXNzTmFtZSkpIHtcbiAgICAgIHJldHVybiBwYXJlbnRcbiAgICB9XG5cbiAgICBwYXJlbnQgPSBmaW5kUGFyZW50QnlDbGFzcyhwYXJlbnQsIGNsYXNzTmFtZSlcbiAgfVxuICByZXR1cm4gcGFyZW50XG59XG5cbmV4cG9ydCBjb25zdCBmaW5kUG9zID0gKG9iaikgPT4ge1xuICBsZXQgY3VybGVmdCA9IDBcbiAgbGV0IGN1cnRvcCA9IDBcblxuICBpZiAob2JqLm9mZnNldFBhcmVudCkge1xuICAgIGRvIHtcbiAgICAgIGN1cmxlZnQgKz0gb2JqLm9mZnNldExlZnRcbiAgICAgIGN1cnRvcCArPSBvYmoub2Zmc2V0VG9wXG4gICAgfSB3aGlsZSAob2JqID0gb2JqLm9mZnNldFBhcmVudClcblxuICAgIHJldHVybiBbY3VydG9wLCBjdXJsZWZ0XVxuICB9XG4gIHJldHVybiBbY3VydG9wLCBjdXJsZWZ0XVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvdXRpbHMvZWxlbWVudHMuanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2pzL3V0aWxzL2VsZW1lbnRzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3R5bGVzL3N0eWxlcy5zY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9zdHlsZXMvc3R5bGVzLnNjc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==