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

/***/ "./src/js/cargo.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_elements__ = __webpack_require__("./src/js/utils/elements.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_events__ = __webpack_require__("./src/js/utils/events.js");



const Cargo = () => {

  const img = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_elements__["a" /* find */])('.js-cargo-logo')[0]
  // console.log(img)
  //
  //
  // var renderer = PIXI.autoDetectRenderer(img.clientWidth, img.clientHeight, {
  //   transparent: true
  // })
  //
  // document.body.appendChild(renderer.view);
  //
  // var stage = new PIXI.Container();
  //
  // var cargoLogo = PIXI.Sprite.fromImage('./public/cargo_logo.png');
  // cargoLogo.anchor.x = 0
  // cargoLogo.anchor.y = 0
  // stage.addChild(cargoLogo)



  /// TUTORIAL!

  let mesh;
  let cloth;
  let spacingX = 5;
  let spacingY = 5;

  let opts = {
    image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/39255/face.png',
    pointsX: 50,
    pointsY: 50,

    pointCount: 50,

    brushSize: 30,

    randomImage(){
      this.image = 'https://unsplash.it/400/400?image=' + Math.floor(Math.random() * 1100);
      if ( cloth ) { cloth.randomize(loadTexture); }
      else { loadTexture(); }
    },
    reset(){
      if ( cloth ) { cloth.reset(); }
    },

    randomizePoints(){
      if ( cloth ) { cloth.randomize(); }
    }
  };

  /*////////////////////////////////////////*/

  let gui = new dat.GUI();
  gui.closed = window.innerWidth < 600;

  let image = gui.add(opts, 'image', {
    Face: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/39255/face.png',
    Logo: 'http://brokensquare.com/Code/assets/logo.svg',
    shshaw: 'http://brokensquare.com/Code/assets/head.svg',
    Lion: 'https://unsplash.it/400/400?image=1074',
    Water: 'https://unsplash.it/400/400?image=1053',
    YellowCurtain: 'https://unsplash.it/400/400?image=855',
    Tunnel: 'https://unsplash.it/400/400?image=137'
  });
  image.onChange(loadTexture);


  let pointCount = gui.add(opts, 'pointCount', 20,80).step(1);
  pointCount.onFinishChange((val)=>{
    opts.pointsX = opts.pointsY = val;
    loadTexture();
  });


  /*////////////////////////////////////////*/
  let mouse = {
    down: false,
    x: 0,
    y: 0,
    px: 0,
    py: 1
  }

  let brush = new PIXI.Graphics();
  function updateBrush(){
    brush.clear();
    brush.blendMode = PIXI.BLEND_MODES.ADD;
    brush.lineStyle(1, 0x888888, 0.4);
    brush.drawCircle(0, 0, opts.brushSize); // drawCircle(x, y, radius)
    brush.x = mouse.x;
    brush.y = mouse.y;
    brush.updateLocalBounds();
  }

  updateBrush();

  let influence = gui.add(opts, 'brushSize', 0, 100).step(1);
  influence.onChange(updateBrush);

  let random = gui.add(opts, 'randomImage');
  let randomize = gui.add(opts, 'randomizePoints');
  let reset = gui.add(opts, 'reset');

  /*////////////////////////////////////////*/

  let stage = new PIXI.Container();
  stage.interactive = true;
  stage.addChild(brush);

  // let renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: true });
  // console.log(img.clientWidth, img.clientHeight)
  var renderer = PIXI.autoDetectRenderer(img.clientWidth, img.clientHeight, { transparent: true })

  document.body.appendChild(renderer.view);
  renderer.render(stage);


  /*////////////////////////////////////////*/

  function loadTexture() {
    console.log('loading texture', opts.image);
    document.body.className = 'loading';

    // let texture = new PIXI.Texture.fromImage(opts.image);
    let texture = new PIXI.Texture.fromImage(img.src);
    if ( !texture.requiresUpdate ) {
      texture.update();
    }

    texture.on('error', function(){ console.error('AGH!'); });

    texture.on('update',function(){
      document.body.className = '';

      console.log('texture loaded');

      if ( mesh ) {
        stage.removeChild(mesh);
      }

      mesh = new PIXI.mesh.Plane( this, opts.pointsX, opts.pointsY);
      mesh.width = this.width;
      mesh.height = this.height;

      mesh.x = renderer.width / 2 - mesh.width / 2;
      mesh.y = renderer.height / 2 - mesh.height / 2;

      spacingX = mesh.width / (opts.pointsX-1);
      spacingY = mesh.height / (opts.pointsY-1);

      cloth = new Cloth(opts.pointsX-1, opts.pointsY-1, !opts.pinCorners);

      stage.addChildAt(mesh,0);
    });
  }

  loadTexture(opts.image);

  /*////////////////////////////////////////*/

  ;(function update() {
    requestAnimationFrame(update);
    if ( cloth ) {
      // cloth.update(0.016)
      cloth.update(0.001)
    }

    brush.x = renderer.plugins.interaction.mouse.global.x
    brush.y = renderer.plugins.interaction.mouse.global.y
    renderer.render(stage);
  })(0)

  /*////////////////////////////////////////*/

  const twoPi = Math.PI * 2;
  const ease = Elastic.easeOut.config(1.2, 0.4);

  class Point {
    constructor (x, y) {
      this.x = this.origX = x
      this.y = this.origY = y

      this.randomize(this.reset.bind(this));
    }

    animateTo(nx, ny, force, callback){
      if ( !this.resetting || force ) {
        let dx = nx - this.x
        let dy = ny - this.y
        let dist = Math.sqrt(dx * dx + dy * dy)
        this.resetting = true;

        TweenMax.to(this,
          // Math.min(1.25, Math.max(0.4, dist / 40) ), {
          Math.min(2, Math.max(0.4, dist / 10) ), {
            x: nx,
            y: ny,
            ease: ease,
            onComplete: () => {
              this.resetting = false
              if ( callback ) { callback(); }
            }
          })
      } else if ( callback ) { callback(); }
    }

    randomize(callback) {
      let nx = this.x + ((Math.random() * 60) - 30);
      let ny = this.y + ((Math.random() * 60) - 30);

      this.animateTo(nx, ny, null, callback ? callback : null );
    }

    reset(){
      this.animateTo(this.origX, this.origY, true);
    }

    update (delta) {
      let dx;
      let dy;

      if (!this.resetting && mouse.down) {
        // dx = this.x - mouse.x + mesh.x
        // dy = this.y - mouse.y + mesh.y
        dx = Math.abs(mouse.x - this.x)
        dy = Math.abs(mouse.y - this.y)
        // console.log('->',dx )

        let dist = Math.sqrt(dx * dx + dy * dy)
        // console.log('dist', dist)

        if ( dist < opts.brushSize) {
          let a = this.x
          this.x = this.x + (( mouse.x - mouse.px) * Math.abs( Math.cos( twoPi * dx / dist)))
          this.y = this.y + (( mouse.y - mouse.py) * Math.abs( Math.cos( twoPi * dy / dist)))
          console.log(dist, this.x, a)
        }
      }
      return this
    }
  }

  /*////////////////////////////////////////*/

  let count = 0;

  class Cloth {
    constructor (clothX, clothY, free) {
      this.points = []

      let startX = 0; //renderer.view.width / 2 - clothX * spacingX / 2;
      let startY = 0//renderer.view.height * 0.1;

      for (let y = 0; y <= clothY; y++) {
        for (let x = 0; x <= clothX; x++) {
          let point = new Point(startX + x * spacingX, startY + y * spacingY)
          this.points.push(point)
        }
      }
    }

    randomize(callback){
      this.points.forEach((point,i) => {
        point.randomize( i === 0 ? callback : null );
      })
    }

    reset(){
      this.points.forEach((point) => {
        point.reset()
      })
    }

    update (delta) {
      this.points.forEach((point,i) => {
        point.update(delta * delta)

        if ( mesh ) {
          i *= 2;
          mesh.vertices[i] = point.x;
          mesh.vertices[i+1] = point.y;
        }
      });
    }
  }

  function pointerMove(e) {
    let lp = e.data.getLocalPosition(stage)
    mouse.px = mouse.x || lp.x
    mouse.py = mouse.y || lp.y
    mouse.x = lp.x
    mouse.y = lp.y
  }

  function pointerDown(e){
    mouse.down = true
    mouse.button = 1
    pointerMove(e);
  }

  function pointerUp(e){
    mouse.down = false;
    mouse.px = null;
    mouse.py = null;
  }

  stage.on('mousedown', pointerDown)
  stage.on('mousemove', pointerMove)
  stage.on('mouseup', pointerUp)

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_events__["a" /* addListener */])('.js-reset-mesh', 'click', () => {
    if (cloth) {
      cloth.reset()
    }
  })
}

/* harmony default export */ __webpack_exports__["a"] = Cargo;


/***/ }),

/***/ "./src/js/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_elements__ = __webpack_require__("./src/js/utils/elements.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cargo__ = __webpack_require__("./src/js/cargo.js");
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
// import dp2 from './displace-2'




const docReady = (/* event */) => {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__cargo__["a" /* default */])()

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

  // dp2(find('.c-img')[0], {
  //   img: 'https://farm6.staticflickr.com/5078/14032935559_8c13e9b181_z_d.jpg'
  // })
  //
  // dp2(find('.c-logo')[0], {
  //   // img: 'public/turtle-512.jpg'
  //   img: 'public/cargo-logo.png'
  // })
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

/***/ "./src/js/utils/events.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const debounce = (fn, delay) => {
  let timer = null
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

const attachListener = (element, eventName, handler, debounceDelay = 0) => {
  if (debounceDelay > 0) {
    handler = debounce(handler, debounceDelay)
  }

  if (element.addEventListener) {
    element.addEventListener(eventName, handler, false)
  } else if (element.attachEvent) {
    element.attachEvent(`on${eventName}`, handler)
  } else {
    element[`on${eventName}`] = handler
  }
}
/**
 * adds an eventListener to an object.
 *
 * @param [NodeList|Object|String]  el  Object(s) to bind the listener
 * @param [String]  eventName Name of the event e.g. click
 * @param [function]  handler Callback function
 */
const addListener = (el, eventName, handler, debounceDelay = 0) => {
  if (typeof (el) === 'string') {
    el = document.querySelectorAll(el)
    if (el.length === 1) {
      el = el[0] // if only one set it properly
    }
  }

  if (el == null || typeof (el) === 'undefined') return

  if (el.length !== undefined && el.length > 1 && el !== window) { // it's a NodeListCollection
    for (let i = 0; i < el.length; i += 1) {
      attachListener(el[i], eventName, handler, debounceDelay)
    }
  } else { // it's a single node
    attachListener(el, eventName, handler, debounceDelay)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = addListener;



const detachListener = (element, eventName, handler) => {
  if (element.addEventListener) {
    element.removeEventListener(eventName, handler, false)
  } else if (element.detachEvent) {
    element.detachEvent(`on${eventName}`, handler)
  } else {
    element[`on${eventName}`] = null
  }
}


const removeListener = (el, eventName, handler) => {
  if (typeof (el) === 'string') {
    el = document.querySelectorAll(el)
    if (el.length === 1) {
      el = el[0] // if only one set it properly
    }
  }

  if (el == null || typeof (el) === 'undefined') return

  if (el.length !== undefined && el.length > 1 && el !== window) { // it's a NodeListCollection
    for (let i = 0; i < el.length; i += 1) {
      detachListener(el[i], eventName, handler)
    }
  } else { // it's a single node
    detachListener(el, eventName, handler)
  }
}
/* unused harmony export removeListener */




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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzRmNmNhNzUyMzMwOTM5NzMwMTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NhcmdvLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdXRpbHMvZWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3V0aWxzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3N0eWxlcy5zY3NzPzllY2IiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDaEVlO0FBQ087O0FBRXRCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLDhCQUE4QjtBQUNsRCxZQUFZLGVBQWU7QUFDM0IsS0FBSztBQUNMO0FBQ0Esb0JBQW9CLGVBQWU7QUFDbkMsS0FBSzs7QUFFTDtBQUNBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvRkFBb0Ysb0JBQW9CO0FBQ3hHO0FBQ0EsNkVBQTZFLG9CQUFvQjs7QUFFakc7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DLHVCQUF1QixFQUFFOztBQUU1RDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFlBQVk7QUFDM0M7QUFDQSxXQUFXO0FBQ1gsT0FBTyx1QkFBdUIsWUFBWTtBQUMxQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUI7QUFDckI7O0FBRUEscUJBQXFCLGFBQWE7QUFDbEMsdUJBQXVCLGFBQWE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUNqVWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBOzs7Ozs7Ozs7QUNsREE7QUFDQTtBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDRCQUE0QixVQUFVO0FBQ3RDO0FBQUE7QUFBQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNILDZCQUE2QixVQUFVO0FBQ3ZDO0FBQ0E7QUFDQTtBQUFBO0FBQUE7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSCx1RUFBdUUsK0JBQStCO0FBQ3RHO0FBQ0E7QUFDQTtBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUFBO0FBQUE7OztBQUdBO0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSCw2QkFBNkIsVUFBVTtBQUN2QyxHQUFHO0FBQ0gsaUJBQWlCLFVBQVU7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsa0VBQWtFO0FBQ2xFLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQSxHQUFHLE9BQU87QUFDVjtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsNkJBQTZCLFVBQVU7QUFDdkMsR0FBRztBQUNILGlCQUFpQixVQUFVO0FBQzNCO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGtFQUFrRTtBQUNsRSxtQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0EsR0FBRyxPQUFPO0FBQ1Y7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FDOUVBLHlDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9wdWJsaWMvanMvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYzRmNmNhNzUyMzMwOTM5NzMwMTEiLCJpbXBvcnQgeyBmaW5kIH0gZnJvbSAnLi91dGlscy9lbGVtZW50cydcbmltcG9ydCB7IGFkZExpc3RlbmVyIH0gZnJvbSAnLi91dGlscy9ldmVudHMnXG5cbmNvbnN0IENhcmdvID0gKCkgPT4ge1xuXG4gIGNvbnN0IGltZyA9IGZpbmQoJy5qcy1jYXJnby1sb2dvJylbMF1cbiAgLy8gY29uc29sZS5sb2coaW1nKVxuICAvL1xuICAvL1xuICAvLyB2YXIgcmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcihpbWcuY2xpZW50V2lkdGgsIGltZy5jbGllbnRIZWlnaHQsIHtcbiAgLy8gICB0cmFuc3BhcmVudDogdHJ1ZVxuICAvLyB9KVxuICAvL1xuICAvLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xuICAvL1xuICAvLyB2YXIgc3RhZ2UgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbiAgLy9cbiAgLy8gdmFyIGNhcmdvTG9nbyA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnLi9wdWJsaWMvY2FyZ29fbG9nby5wbmcnKTtcbiAgLy8gY2FyZ29Mb2dvLmFuY2hvci54ID0gMFxuICAvLyBjYXJnb0xvZ28uYW5jaG9yLnkgPSAwXG4gIC8vIHN0YWdlLmFkZENoaWxkKGNhcmdvTG9nbylcblxuXG5cbiAgLy8vIFRVVE9SSUFMIVxuXG4gIGxldCBtZXNoO1xuICBsZXQgY2xvdGg7XG4gIGxldCBzcGFjaW5nWCA9IDU7XG4gIGxldCBzcGFjaW5nWSA9IDU7XG5cbiAgbGV0IG9wdHMgPSB7XG4gICAgaW1hZ2U6ICdodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3MuY2Rwbi5pby8zOTI1NS9mYWNlLnBuZycsXG4gICAgcG9pbnRzWDogNTAsXG4gICAgcG9pbnRzWTogNTAsXG5cbiAgICBwb2ludENvdW50OiA1MCxcblxuICAgIGJydXNoU2l6ZTogMzAsXG5cbiAgICByYW5kb21JbWFnZSgpe1xuICAgICAgdGhpcy5pbWFnZSA9ICdodHRwczovL3Vuc3BsYXNoLml0LzQwMC80MDA/aW1hZ2U9JyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDExMDApO1xuICAgICAgaWYgKCBjbG90aCApIHsgY2xvdGgucmFuZG9taXplKGxvYWRUZXh0dXJlKTsgfVxuICAgICAgZWxzZSB7IGxvYWRUZXh0dXJlKCk7IH1cbiAgICB9LFxuICAgIHJlc2V0KCl7XG4gICAgICBpZiAoIGNsb3RoICkgeyBjbG90aC5yZXNldCgpOyB9XG4gICAgfSxcblxuICAgIHJhbmRvbWl6ZVBvaW50cygpe1xuICAgICAgaWYgKCBjbG90aCApIHsgY2xvdGgucmFuZG9taXplKCk7IH1cbiAgICB9XG4gIH07XG5cbiAgLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi9cblxuICBsZXQgZ3VpID0gbmV3IGRhdC5HVUkoKTtcbiAgZ3VpLmNsb3NlZCA9IHdpbmRvdy5pbm5lcldpZHRoIDwgNjAwO1xuXG4gIGxldCBpbWFnZSA9IGd1aS5hZGQob3B0cywgJ2ltYWdlJywge1xuICAgIEZhY2U6ICdodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3MuY2Rwbi5pby8zOTI1NS9mYWNlLnBuZycsXG4gICAgTG9nbzogJ2h0dHA6Ly9icm9rZW5zcXVhcmUuY29tL0NvZGUvYXNzZXRzL2xvZ28uc3ZnJyxcbiAgICBzaHNoYXc6ICdodHRwOi8vYnJva2Vuc3F1YXJlLmNvbS9Db2RlL2Fzc2V0cy9oZWFkLnN2ZycsXG4gICAgTGlvbjogJ2h0dHBzOi8vdW5zcGxhc2guaXQvNDAwLzQwMD9pbWFnZT0xMDc0JyxcbiAgICBXYXRlcjogJ2h0dHBzOi8vdW5zcGxhc2guaXQvNDAwLzQwMD9pbWFnZT0xMDUzJyxcbiAgICBZZWxsb3dDdXJ0YWluOiAnaHR0cHM6Ly91bnNwbGFzaC5pdC80MDAvNDAwP2ltYWdlPTg1NScsXG4gICAgVHVubmVsOiAnaHR0cHM6Ly91bnNwbGFzaC5pdC80MDAvNDAwP2ltYWdlPTEzNydcbiAgfSk7XG4gIGltYWdlLm9uQ2hhbmdlKGxvYWRUZXh0dXJlKTtcblxuXG4gIGxldCBwb2ludENvdW50ID0gZ3VpLmFkZChvcHRzLCAncG9pbnRDb3VudCcsIDIwLDgwKS5zdGVwKDEpO1xuICBwb2ludENvdW50Lm9uRmluaXNoQ2hhbmdlKCh2YWwpPT57XG4gICAgb3B0cy5wb2ludHNYID0gb3B0cy5wb2ludHNZID0gdmFsO1xuICAgIGxvYWRUZXh0dXJlKCk7XG4gIH0pO1xuXG5cbiAgLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi9cbiAgbGV0IG1vdXNlID0ge1xuICAgIGRvd246IGZhbHNlLFxuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgICBweDogMCxcbiAgICBweTogMVxuICB9XG5cbiAgbGV0IGJydXNoID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgZnVuY3Rpb24gdXBkYXRlQnJ1c2goKXtcbiAgICBicnVzaC5jbGVhcigpO1xuICAgIGJydXNoLmJsZW5kTW9kZSA9IFBJWEkuQkxFTkRfTU9ERVMuQUREO1xuICAgIGJydXNoLmxpbmVTdHlsZSgxLCAweDg4ODg4OCwgMC40KTtcbiAgICBicnVzaC5kcmF3Q2lyY2xlKDAsIDAsIG9wdHMuYnJ1c2hTaXplKTsgLy8gZHJhd0NpcmNsZSh4LCB5LCByYWRpdXMpXG4gICAgYnJ1c2gueCA9IG1vdXNlLng7XG4gICAgYnJ1c2gueSA9IG1vdXNlLnk7XG4gICAgYnJ1c2gudXBkYXRlTG9jYWxCb3VuZHMoKTtcbiAgfVxuXG4gIHVwZGF0ZUJydXNoKCk7XG5cbiAgbGV0IGluZmx1ZW5jZSA9IGd1aS5hZGQob3B0cywgJ2JydXNoU2l6ZScsIDAsIDEwMCkuc3RlcCgxKTtcbiAgaW5mbHVlbmNlLm9uQ2hhbmdlKHVwZGF0ZUJydXNoKTtcblxuICBsZXQgcmFuZG9tID0gZ3VpLmFkZChvcHRzLCAncmFuZG9tSW1hZ2UnKTtcbiAgbGV0IHJhbmRvbWl6ZSA9IGd1aS5hZGQob3B0cywgJ3JhbmRvbWl6ZVBvaW50cycpO1xuICBsZXQgcmVzZXQgPSBndWkuYWRkKG9wdHMsICdyZXNldCcpO1xuXG4gIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5cbiAgbGV0IHN0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG4gIHN0YWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgc3RhZ2UuYWRkQ2hpbGQoYnJ1c2gpO1xuXG4gIC8vIGxldCByZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHsgdHJhbnNwYXJlbnQ6IHRydWUgfSk7XG4gIC8vIGNvbnNvbGUubG9nKGltZy5jbGllbnRXaWR0aCwgaW1nLmNsaWVudEhlaWdodClcbiAgdmFyIHJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIoaW1nLmNsaWVudFdpZHRoLCBpbWcuY2xpZW50SGVpZ2h0LCB7IHRyYW5zcGFyZW50OiB0cnVlIH0pXG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcbiAgcmVuZGVyZXIucmVuZGVyKHN0YWdlKTtcblxuXG4gIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5cbiAgZnVuY3Rpb24gbG9hZFRleHR1cmUoKSB7XG4gICAgY29uc29sZS5sb2coJ2xvYWRpbmcgdGV4dHVyZScsIG9wdHMuaW1hZ2UpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gJ2xvYWRpbmcnO1xuXG4gICAgLy8gbGV0IHRleHR1cmUgPSBuZXcgUElYSS5UZXh0dXJlLmZyb21JbWFnZShvcHRzLmltYWdlKTtcbiAgICBsZXQgdGV4dHVyZSA9IG5ldyBQSVhJLlRleHR1cmUuZnJvbUltYWdlKGltZy5zcmMpO1xuICAgIGlmICggIXRleHR1cmUucmVxdWlyZXNVcGRhdGUgKSB7XG4gICAgICB0ZXh0dXJlLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIHRleHR1cmUub24oJ2Vycm9yJywgZnVuY3Rpb24oKXsgY29uc29sZS5lcnJvcignQUdIIScpOyB9KTtcblxuICAgIHRleHR1cmUub24oJ3VwZGF0ZScsZnVuY3Rpb24oKXtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gJyc7XG5cbiAgICAgIGNvbnNvbGUubG9nKCd0ZXh0dXJlIGxvYWRlZCcpO1xuXG4gICAgICBpZiAoIG1lc2ggKSB7XG4gICAgICAgIHN0YWdlLnJlbW92ZUNoaWxkKG1lc2gpO1xuICAgICAgfVxuXG4gICAgICBtZXNoID0gbmV3IFBJWEkubWVzaC5QbGFuZSggdGhpcywgb3B0cy5wb2ludHNYLCBvcHRzLnBvaW50c1kpO1xuICAgICAgbWVzaC53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICBtZXNoLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgICBtZXNoLnggPSByZW5kZXJlci53aWR0aCAvIDIgLSBtZXNoLndpZHRoIC8gMjtcbiAgICAgIG1lc2gueSA9IHJlbmRlcmVyLmhlaWdodCAvIDIgLSBtZXNoLmhlaWdodCAvIDI7XG5cbiAgICAgIHNwYWNpbmdYID0gbWVzaC53aWR0aCAvIChvcHRzLnBvaW50c1gtMSk7XG4gICAgICBzcGFjaW5nWSA9IG1lc2guaGVpZ2h0IC8gKG9wdHMucG9pbnRzWS0xKTtcblxuICAgICAgY2xvdGggPSBuZXcgQ2xvdGgob3B0cy5wb2ludHNYLTEsIG9wdHMucG9pbnRzWS0xLCAhb3B0cy5waW5Db3JuZXJzKTtcblxuICAgICAgc3RhZ2UuYWRkQ2hpbGRBdChtZXNoLDApO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZFRleHR1cmUob3B0cy5pbWFnZSk7XG5cbiAgLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi9cblxuICA7KGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICBpZiAoIGNsb3RoICkge1xuICAgICAgLy8gY2xvdGgudXBkYXRlKDAuMDE2KVxuICAgICAgY2xvdGgudXBkYXRlKDAuMDAxKVxuICAgIH1cblxuICAgIGJydXNoLnggPSByZW5kZXJlci5wbHVnaW5zLmludGVyYWN0aW9uLm1vdXNlLmdsb2JhbC54XG4gICAgYnJ1c2gueSA9IHJlbmRlcmVyLnBsdWdpbnMuaW50ZXJhY3Rpb24ubW91c2UuZ2xvYmFsLnlcbiAgICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpO1xuICB9KSgwKVxuXG4gIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5cbiAgY29uc3QgdHdvUGkgPSBNYXRoLlBJICogMjtcbiAgY29uc3QgZWFzZSA9IEVsYXN0aWMuZWFzZU91dC5jb25maWcoMS4yLCAwLjQpO1xuXG4gIGNsYXNzIFBvaW50IHtcbiAgICBjb25zdHJ1Y3RvciAoeCwgeSkge1xuICAgICAgdGhpcy54ID0gdGhpcy5vcmlnWCA9IHhcbiAgICAgIHRoaXMueSA9IHRoaXMub3JpZ1kgPSB5XG5cbiAgICAgIHRoaXMucmFuZG9taXplKHRoaXMucmVzZXQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgYW5pbWF0ZVRvKG54LCBueSwgZm9yY2UsIGNhbGxiYWNrKXtcbiAgICAgIGlmICggIXRoaXMucmVzZXR0aW5nIHx8IGZvcmNlICkge1xuICAgICAgICBsZXQgZHggPSBueCAtIHRoaXMueFxuICAgICAgICBsZXQgZHkgPSBueSAtIHRoaXMueVxuICAgICAgICBsZXQgZGlzdCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSlcbiAgICAgICAgdGhpcy5yZXNldHRpbmcgPSB0cnVlO1xuXG4gICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMsXG4gICAgICAgICAgLy8gTWF0aC5taW4oMS4yNSwgTWF0aC5tYXgoMC40LCBkaXN0IC8gNDApICksIHtcbiAgICAgICAgICBNYXRoLm1pbigyLCBNYXRoLm1heCgwLjQsIGRpc3QgLyAxMCkgKSwge1xuICAgICAgICAgICAgeDogbngsXG4gICAgICAgICAgICB5OiBueSxcbiAgICAgICAgICAgIGVhc2U6IGVhc2UsXG4gICAgICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucmVzZXR0aW5nID0gZmFsc2VcbiAgICAgICAgICAgICAgaWYgKCBjYWxsYmFjayApIHsgY2FsbGJhY2soKTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKCBjYWxsYmFjayApIHsgY2FsbGJhY2soKTsgfVxuICAgIH1cblxuICAgIHJhbmRvbWl6ZShjYWxsYmFjaykge1xuICAgICAgbGV0IG54ID0gdGhpcy54ICsgKChNYXRoLnJhbmRvbSgpICogNjApIC0gMzApO1xuICAgICAgbGV0IG55ID0gdGhpcy55ICsgKChNYXRoLnJhbmRvbSgpICogNjApIC0gMzApO1xuXG4gICAgICB0aGlzLmFuaW1hdGVUbyhueCwgbnksIG51bGwsIGNhbGxiYWNrID8gY2FsbGJhY2sgOiBudWxsICk7XG4gICAgfVxuXG4gICAgcmVzZXQoKXtcbiAgICAgIHRoaXMuYW5pbWF0ZVRvKHRoaXMub3JpZ1gsIHRoaXMub3JpZ1ksIHRydWUpO1xuICAgIH1cblxuICAgIHVwZGF0ZSAoZGVsdGEpIHtcbiAgICAgIGxldCBkeDtcbiAgICAgIGxldCBkeTtcblxuICAgICAgaWYgKCF0aGlzLnJlc2V0dGluZyAmJiBtb3VzZS5kb3duKSB7XG4gICAgICAgIC8vIGR4ID0gdGhpcy54IC0gbW91c2UueCArIG1lc2gueFxuICAgICAgICAvLyBkeSA9IHRoaXMueSAtIG1vdXNlLnkgKyBtZXNoLnlcbiAgICAgICAgZHggPSBNYXRoLmFicyhtb3VzZS54IC0gdGhpcy54KVxuICAgICAgICBkeSA9IE1hdGguYWJzKG1vdXNlLnkgLSB0aGlzLnkpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCctPicsZHggKVxuXG4gICAgICAgIGxldCBkaXN0ID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KVxuICAgICAgICAvLyBjb25zb2xlLmxvZygnZGlzdCcsIGRpc3QpXG5cbiAgICAgICAgaWYgKCBkaXN0IDwgb3B0cy5icnVzaFNpemUpIHtcbiAgICAgICAgICBsZXQgYSA9IHRoaXMueFxuICAgICAgICAgIHRoaXMueCA9IHRoaXMueCArICgoIG1vdXNlLnggLSBtb3VzZS5weCkgKiBNYXRoLmFicyggTWF0aC5jb3MoIHR3b1BpICogZHggLyBkaXN0KSkpXG4gICAgICAgICAgdGhpcy55ID0gdGhpcy55ICsgKCggbW91c2UueSAtIG1vdXNlLnB5KSAqIE1hdGguYWJzKCBNYXRoLmNvcyggdHdvUGkgKiBkeSAvIGRpc3QpKSlcbiAgICAgICAgICBjb25zb2xlLmxvZyhkaXN0LCB0aGlzLngsIGEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICB9XG5cbiAgLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi9cblxuICBsZXQgY291bnQgPSAwO1xuXG4gIGNsYXNzIENsb3RoIHtcbiAgICBjb25zdHJ1Y3RvciAoY2xvdGhYLCBjbG90aFksIGZyZWUpIHtcbiAgICAgIHRoaXMucG9pbnRzID0gW11cblxuICAgICAgbGV0IHN0YXJ0WCA9IDA7IC8vcmVuZGVyZXIudmlldy53aWR0aCAvIDIgLSBjbG90aFggKiBzcGFjaW5nWCAvIDI7XG4gICAgICBsZXQgc3RhcnRZID0gMC8vcmVuZGVyZXIudmlldy5oZWlnaHQgKiAwLjE7XG5cbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDw9IGNsb3RoWTsgeSsrKSB7XG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDw9IGNsb3RoWDsgeCsrKSB7XG4gICAgICAgICAgbGV0IHBvaW50ID0gbmV3IFBvaW50KHN0YXJ0WCArIHggKiBzcGFjaW5nWCwgc3RhcnRZICsgeSAqIHNwYWNpbmdZKVxuICAgICAgICAgIHRoaXMucG9pbnRzLnB1c2gocG9pbnQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByYW5kb21pemUoY2FsbGJhY2spe1xuICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocG9pbnQsaSkgPT4ge1xuICAgICAgICBwb2ludC5yYW5kb21pemUoIGkgPT09IDAgPyBjYWxsYmFjayA6IG51bGwgKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmVzZXQoKXtcbiAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHBvaW50KSA9PiB7XG4gICAgICAgIHBvaW50LnJlc2V0KClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdXBkYXRlIChkZWx0YSkge1xuICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocG9pbnQsaSkgPT4ge1xuICAgICAgICBwb2ludC51cGRhdGUoZGVsdGEgKiBkZWx0YSlcblxuICAgICAgICBpZiAoIG1lc2ggKSB7XG4gICAgICAgICAgaSAqPSAyO1xuICAgICAgICAgIG1lc2gudmVydGljZXNbaV0gPSBwb2ludC54O1xuICAgICAgICAgIG1lc2gudmVydGljZXNbaSsxXSA9IHBvaW50Lnk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBvaW50ZXJNb3ZlKGUpIHtcbiAgICBsZXQgbHAgPSBlLmRhdGEuZ2V0TG9jYWxQb3NpdGlvbihzdGFnZSlcbiAgICBtb3VzZS5weCA9IG1vdXNlLnggfHwgbHAueFxuICAgIG1vdXNlLnB5ID0gbW91c2UueSB8fCBscC55XG4gICAgbW91c2UueCA9IGxwLnhcbiAgICBtb3VzZS55ID0gbHAueVxuICB9XG5cbiAgZnVuY3Rpb24gcG9pbnRlckRvd24oZSl7XG4gICAgbW91c2UuZG93biA9IHRydWVcbiAgICBtb3VzZS5idXR0b24gPSAxXG4gICAgcG9pbnRlck1vdmUoZSk7XG4gIH1cblxuICBmdW5jdGlvbiBwb2ludGVyVXAoZSl7XG4gICAgbW91c2UuZG93biA9IGZhbHNlO1xuICAgIG1vdXNlLnB4ID0gbnVsbDtcbiAgICBtb3VzZS5weSA9IG51bGw7XG4gIH1cblxuICBzdGFnZS5vbignbW91c2Vkb3duJywgcG9pbnRlckRvd24pXG4gIHN0YWdlLm9uKCdtb3VzZW1vdmUnLCBwb2ludGVyTW92ZSlcbiAgc3RhZ2Uub24oJ21vdXNldXAnLCBwb2ludGVyVXApXG5cbiAgYWRkTGlzdGVuZXIoJy5qcy1yZXNldC1tZXNoJywgJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChjbG90aCkge1xuICAgICAgY2xvdGgucmVzZXQoKVxuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZ29cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL2NhcmdvLmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9qcy9jYXJnby5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBmaW5kIH0gZnJvbSAnLi91dGlscy9lbGVtZW50cydcbi8vIGltcG9ydCBwaXhpIGZyb20gJy4vcGl4aWpzLTEnIC8vIGZpcnN0IGRlbW8gYXF1YSBtYWduaWZ5XG4vLyBpbXBvcnQgcGl4aSBmcm9tICcuL3Jlc2l6ZSdcbi8vIGltcG9ydCBsaXF1aWZ5IGZyb20gJy4vbGlxdWlmeS1vbmUnXG4vLyBpbXBvcnQgbGlxdWlmeSBmcm9tICcuL2xpcXVpZnktdHdvJ1xuLy8gaW1wb3J0IHNtb2tleSBmcm9tICcuL3Ntb2tlJ1xuLy8gaW1wb3J0IHdhdGVySW1hZ2UgZnJvbSAnLi93YXRlci1pbWFnZSdcbi8vIGltcG9ydCBzaW1wbGVEaXNwbGFjZW1lbnQgZnJvbSAnLi9zaW1wbGUtZGlzcGxhY2VtZW50J1xuLy8gaW1wb3J0IHNtZWFyIGZyb20gJy4vc21lYXInXG4vLyBpbXBvcnQgd29iYmxlIGZyb20gJy4vd29iYmxlJ1xuLy8gaW1wb3J0IHJlZ2wgZnJvbSAnLi9yZWdsJ1xuLy8gaW1wb3J0IHdhdGVyIGZyb20gJy4vdGhyZWUtd2F0ZXInXG4vLyBpbXBvcnQgd2F0ZXJGbHVpZCBmcm9tICcuLi8uLi9wdWJsaWMvd2F0ZXItZmx1aWQvbWFpbidcbi8vXG4vLyBpbXBvcnQgZHAyIGZyb20gJy4vZGlzcGxhY2UtMidcbmltcG9ydCBDYXJnbyBmcm9tICcuL2NhcmdvJ1xuaW1wb3J0IHN0eWxlcyBmcm9tICcuLi9zdHlsZXMvc3R5bGVzLnNjc3MnXG5cblxuY29uc3QgZG9jUmVhZHkgPSAoLyogZXZlbnQgKi8pID0+IHtcbiAgICBDYXJnbygpXG5cbiAgLy8gcGl4aSgpXG4gIC8vIGxpcXVpZnkoKVxuICAvLyBzbW9rZXkoKVxuICAvLyBzbW9rZXlQaXhpKClcbiAgLy8gd2F0ZXJJbWFnZSgpXG4gIC8vIHNpbXBsZURpc3BsYWNlbWVudCgpXG4gIC8vIHNtZWFyKClcbiAgLy8gd29iYmxlKClcbiAgLy8gcmVnbCgpXG4gIC8vIHdhdGVyKClcbiAgLy8gd2F0ZXJGbHVpZCgpXG4gIC8vIHJlZ2woKVxuXG4gIC8vIGRwMihmaW5kKCcuYy1pbWcnKVswXSwge1xuICAvLyAgIGltZzogJ2h0dHBzOi8vZmFybTYuc3RhdGljZmxpY2tyLmNvbS81MDc4LzE0MDMyOTM1NTU5XzhjMTNlOWIxODFfel9kLmpwZydcbiAgLy8gfSlcbiAgLy9cbiAgLy8gZHAyKGZpbmQoJy5jLWxvZ28nKVswXSwge1xuICAvLyAgIC8vIGltZzogJ3B1YmxpYy90dXJ0bGUtNTEyLmpwZydcbiAgLy8gICBpbWc6ICdwdWJsaWMvY2FyZ28tbG9nby5wbmcnXG4gIC8vIH0pXG59XG5cbmNvbnN0IGluaXQgPSAoKSA9PiB7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBkb2NSZWFkeSlcbn1cblxuXG5pbml0KClcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9qcy9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY29uc3QgZmluZCA9IChxdWVyeVNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQpID0+XG4gIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChxdWVyeVNlbGVjdG9yKSlcblxuY29uc3QgaXNFbGVtZW50ID0gKGVsKSA9PiB7XG4gIHRyeSB7XG4gICAgLy8gVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb21lKVxuICAgIC8vIHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICBpZiAoIShlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgcmV0dXJuIGZpbmQoZWwpWzBdLmxlbmd0aCA+IDBcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAvLyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuICAgIHJldHVybiAodHlwZW9mIGVsID09PSAnb2JqZWN0JykgJiZcbiAgICAgIChlbC5ub2RlVHlwZSA9PT0gMSkgJiYgKHR5cGVvZiBlbC5zdHlsZSA9PT0gJ29iamVjdCcpICYmXG4gICAgICAodHlwZW9mIGVsLm93bmVyRG9jdW1lbnQgPT09ICdvYmplY3QnKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBoYXNDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcbiAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkpIHJldHVybiBmYWxzZVxuXG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpXG4gIH1cblxuICByZXR1cm4gbmV3IFJlZ0V4cChgKF58ICkke2NsYXNzTmFtZX0oIHwkKWAsICdnaScpLnRlc3QoZWxlbWVudC5jbGFzc05hbWUpXG59XG5cblxuZXhwb3J0IGNvbnN0IGFkZENsYXNzID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT4ge1xuICBpZiAoIWlzRWxlbWVudChlbGVtZW50KSkgcmV0dXJuIGZhbHNlXG5cbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSlcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSArPSBgICR7Y2xhc3NOYW1lfWBcbiAgfVxuICByZXR1cm4gZWxlbWVudFxufVxuXG5cbmV4cG9ydCBjb25zdCByZW1vdmVDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcbiAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkpIHJldHVybiBmYWxzZVxuXG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoYChefFxcXFxiKSR7Y2xhc3NOYW1lLnNwbGl0KCcgJykuam9pbignfCcpfShcXFxcYnwkKWAsICdnaScpLCAnICcpXG4gIH1cbiAgcmV0dXJuIGVsZW1lbnRcbn1cblxuZXhwb3J0IGNvbnN0IHRvZ2dsZUNsYXNzID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT5cbiAgaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSA/IHJlbW92ZUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkgOiBhZGRDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpXG5cblxuZXhwb3J0IGNvbnN0IGV4aXN0cyA9IChzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50KSA9PiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpICE9PSBudWxsXG5cbmV4cG9ydCBjb25zdCBmaW5kUGFyZW50QnlDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcbiAgbGV0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBpZiAocGFyZW50ICE9PSBudWxsKSB7XG4gICAgaWYgKGhhc0NsYXNzKHBhcmVudCwgY2xhc3NOYW1lKSkge1xuICAgICAgcmV0dXJuIHBhcmVudFxuICAgIH1cblxuICAgIHBhcmVudCA9IGZpbmRQYXJlbnRCeUNsYXNzKHBhcmVudCwgY2xhc3NOYW1lKVxuICB9XG4gIHJldHVybiBwYXJlbnRcbn1cblxuZXhwb3J0IGNvbnN0IGZpbmRQb3MgPSAob2JqKSA9PiB7XG4gIGxldCBjdXJsZWZ0ID0gMFxuICBsZXQgY3VydG9wID0gMFxuXG4gIGlmIChvYmoub2Zmc2V0UGFyZW50KSB7XG4gICAgZG8ge1xuICAgICAgY3VybGVmdCArPSBvYmoub2Zmc2V0TGVmdFxuICAgICAgY3VydG9wICs9IG9iai5vZmZzZXRUb3BcbiAgICB9IHdoaWxlIChvYmogPSBvYmoub2Zmc2V0UGFyZW50KVxuXG4gICAgcmV0dXJuIFtjdXJ0b3AsIGN1cmxlZnRdXG4gIH1cbiAgcmV0dXJuIFtjdXJ0b3AsIGN1cmxlZnRdXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy91dGlscy9lbGVtZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvanMvdXRpbHMvZWxlbWVudHMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgZGVib3VuY2UgPSAoZm4sIGRlbGF5KSA9PiB7XG4gIGxldCB0aW1lciA9IG51bGxcbiAgcmV0dXJuICgpID0+IHtcbiAgICBjbGVhclRpbWVvdXQodGltZXIpXG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICB9LCBkZWxheSlcbiAgfVxufVxuXG5jb25zdCBhdHRhY2hMaXN0ZW5lciA9IChlbGVtZW50LCBldmVudE5hbWUsIGhhbmRsZXIsIGRlYm91bmNlRGVsYXkgPSAwKSA9PiB7XG4gIGlmIChkZWJvdW5jZURlbGF5ID4gMCkge1xuICAgIGhhbmRsZXIgPSBkZWJvdW5jZShoYW5kbGVyLCBkZWJvdW5jZURlbGF5KVxuICB9XG5cbiAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKVxuICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0YWNoRXZlbnQpIHtcbiAgICBlbGVtZW50LmF0dGFjaEV2ZW50KGBvbiR7ZXZlbnROYW1lfWAsIGhhbmRsZXIpXG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudFtgb24ke2V2ZW50TmFtZX1gXSA9IGhhbmRsZXJcbiAgfVxufVxuLyoqXG4gKiBhZGRzIGFuIGV2ZW50TGlzdGVuZXIgdG8gYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSBbTm9kZUxpc3R8T2JqZWN0fFN0cmluZ10gIGVsICBPYmplY3QocykgdG8gYmluZCB0aGUgbGlzdGVuZXJcbiAqIEBwYXJhbSBbU3RyaW5nXSAgZXZlbnROYW1lIE5hbWUgb2YgdGhlIGV2ZW50IGUuZy4gY2xpY2tcbiAqIEBwYXJhbSBbZnVuY3Rpb25dICBoYW5kbGVyIENhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRMaXN0ZW5lciA9IChlbCwgZXZlbnROYW1lLCBoYW5kbGVyLCBkZWJvdW5jZURlbGF5ID0gMCkgPT4ge1xuICBpZiAodHlwZW9mIChlbCkgPT09ICdzdHJpbmcnKSB7XG4gICAgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsKVxuICAgIGlmIChlbC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGVsID0gZWxbMF0gLy8gaWYgb25seSBvbmUgc2V0IGl0IHByb3Blcmx5XG4gICAgfVxuICB9XG5cbiAgaWYgKGVsID09IG51bGwgfHwgdHlwZW9mIChlbCkgPT09ICd1bmRlZmluZWQnKSByZXR1cm5cblxuICBpZiAoZWwubGVuZ3RoICE9PSB1bmRlZmluZWQgJiYgZWwubGVuZ3RoID4gMSAmJiBlbCAhPT0gd2luZG93KSB7IC8vIGl0J3MgYSBOb2RlTGlzdENvbGxlY3Rpb25cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBhdHRhY2hMaXN0ZW5lcihlbFtpXSwgZXZlbnROYW1lLCBoYW5kbGVyLCBkZWJvdW5jZURlbGF5KVxuICAgIH1cbiAgfSBlbHNlIHsgLy8gaXQncyBhIHNpbmdsZSBub2RlXG4gICAgYXR0YWNoTGlzdGVuZXIoZWwsIGV2ZW50TmFtZSwgaGFuZGxlciwgZGVib3VuY2VEZWxheSlcbiAgfVxufVxuXG5cbmNvbnN0IGRldGFjaExpc3RlbmVyID0gKGVsZW1lbnQsIGV2ZW50TmFtZSwgaGFuZGxlcikgPT4ge1xuICBpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpXG4gIH0gZWxzZSBpZiAoZWxlbWVudC5kZXRhY2hFdmVudCkge1xuICAgIGVsZW1lbnQuZGV0YWNoRXZlbnQoYG9uJHtldmVudE5hbWV9YCwgaGFuZGxlcilcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50W2BvbiR7ZXZlbnROYW1lfWBdID0gbnVsbFxuICB9XG59XG5cblxuZXhwb3J0IGNvbnN0IHJlbW92ZUxpc3RlbmVyID0gKGVsLCBldmVudE5hbWUsIGhhbmRsZXIpID0+IHtcbiAgaWYgKHR5cGVvZiAoZWwpID09PSAnc3RyaW5nJykge1xuICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbClcbiAgICBpZiAoZWwubGVuZ3RoID09PSAxKSB7XG4gICAgICBlbCA9IGVsWzBdIC8vIGlmIG9ubHkgb25lIHNldCBpdCBwcm9wZXJseVxuICAgIH1cbiAgfVxuXG4gIGlmIChlbCA9PSBudWxsIHx8IHR5cGVvZiAoZWwpID09PSAndW5kZWZpbmVkJykgcmV0dXJuXG5cbiAgaWYgKGVsLmxlbmd0aCAhPT0gdW5kZWZpbmVkICYmIGVsLmxlbmd0aCA+IDEgJiYgZWwgIT09IHdpbmRvdykgeyAvLyBpdCdzIGEgTm9kZUxpc3RDb2xsZWN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgZGV0YWNoTGlzdGVuZXIoZWxbaV0sIGV2ZW50TmFtZSwgaGFuZGxlcilcbiAgICB9XG4gIH0gZWxzZSB7IC8vIGl0J3MgYSBzaW5nbGUgbm9kZVxuICAgIGRldGFjaExpc3RlbmVyKGVsLCBldmVudE5hbWUsIGhhbmRsZXIpXG4gIH1cbn1cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvdXRpbHMvZXZlbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9qcy91dGlscy9ldmVudHMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZXMvc3R5bGVzLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL3N0eWxlcy9zdHlsZXMuc2Nzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9