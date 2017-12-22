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
      cloth.update(0.016)
    }

    brush.x = renderer.plugins.interaction.mouse.global.x
    brush.y = renderer.plugins.interaction.mouse.global.y
    // brush.x = mouse.x;
    // brush.y = mouse.y;


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
          Math.min(1.25, Math.max(0.4, dist / 40) ),
          {
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
    // let pointer = e.touches ? e.touches[0] : e;

    let lp = e.data.getLocalPosition(stage)
    mouse.px = mouse.x || lp.x
    mouse.py = mouse.y || lp.y
    // mouse.x = pointer.clientX
    // mouse.y = pointer.clientY

    // console.log(mouse)
    // console.log(e)
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

  // renderer.view.addEventListener('mousedown', pointerDown);
  // renderer.view.addEventListener('mouseenter', pointerDown);
  // renderer.view.addEventListener('touchstart', pointerDown);

  // document.body.addEventListener('mousemove',pointerMove);
  // document.body.addEventListener('touchmove', pointerMove);

  // document.body.addEventListener('mouseup', pointerUp);
  // document.body.addEventListener('touchend', pointerUp);
  // document.body.addEventListener('mouseleave', pointerUp);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGM1ZjJkZmM0NzVmZTUwOTA4MzQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NhcmdvLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdXRpbHMvZWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3V0aWxzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3N0eWxlcy5zY3NzPzllY2IiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDaEVlO0FBQ087O0FBRXRCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLDhCQUE4QjtBQUNsRCxZQUFZLGVBQWU7QUFDM0IsS0FBSztBQUNMO0FBQ0Esb0JBQW9CLGVBQWU7QUFDbkMsS0FBSzs7QUFFTDtBQUNBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvRkFBb0Ysb0JBQW9CO0FBQ3hHO0FBQ0EsNkVBQTZFLG9CQUFvQjs7QUFFakc7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DLHVCQUF1QixFQUFFOztBQUU1RDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxHQUFHOztBQUVIOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFlBQVk7QUFDM0M7QUFDQSxXQUFXO0FBQ1gsT0FBTyx1QkFBdUIsWUFBWTtBQUMxQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCOztBQUVBLHFCQUFxQixhQUFhO0FBQ2xDLHVCQUF1QixhQUFhO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUMxVmU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBOzs7Ozs7Ozs7QUNsREE7QUFDQTtBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDRCQUE0QixVQUFVO0FBQ3RDO0FBQUE7QUFBQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNILDZCQUE2QixVQUFVO0FBQ3ZDO0FBQ0E7QUFDQTtBQUFBO0FBQUE7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSCx1RUFBdUUsK0JBQStCO0FBQ3RHO0FBQ0E7QUFDQTtBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUFBO0FBQUE7OztBQUdBO0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSCw2QkFBNkIsVUFBVTtBQUN2QyxHQUFHO0FBQ0gsaUJBQWlCLFVBQVU7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsa0VBQWtFO0FBQ2xFLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQSxHQUFHLE9BQU87QUFDVjtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsNkJBQTZCLFVBQVU7QUFDdkMsR0FBRztBQUNILGlCQUFpQixVQUFVO0FBQzNCO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGtFQUFrRTtBQUNsRSxtQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0EsR0FBRyxPQUFPO0FBQ1Y7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FDOUVBLHlDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9wdWJsaWMvanMvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMGM1ZjJkZmM0NzVmZTUwOTA4MzQiLCJpbXBvcnQgeyBmaW5kIH0gZnJvbSAnLi91dGlscy9lbGVtZW50cydcbmltcG9ydCB7IGFkZExpc3RlbmVyIH0gZnJvbSAnLi91dGlscy9ldmVudHMnXG5cbmNvbnN0IENhcmdvID0gKCkgPT4ge1xuXG4gIGNvbnN0IGltZyA9IGZpbmQoJy5qcy1jYXJnby1sb2dvJylbMF1cbiAgLy8gY29uc29sZS5sb2coaW1nKVxuICAvL1xuICAvL1xuICAvLyB2YXIgcmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcihpbWcuY2xpZW50V2lkdGgsIGltZy5jbGllbnRIZWlnaHQsIHtcbiAgLy8gICB0cmFuc3BhcmVudDogdHJ1ZVxuICAvLyB9KVxuICAvL1xuICAvLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xuICAvL1xuICAvLyB2YXIgc3RhZ2UgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbiAgLy9cbiAgLy8gdmFyIGNhcmdvTG9nbyA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnLi9wdWJsaWMvY2FyZ29fbG9nby5wbmcnKTtcbiAgLy8gY2FyZ29Mb2dvLmFuY2hvci54ID0gMFxuICAvLyBjYXJnb0xvZ28uYW5jaG9yLnkgPSAwXG4gIC8vIHN0YWdlLmFkZENoaWxkKGNhcmdvTG9nbylcblxuXG5cbiAgLy8vIFRVVE9SSUFMIVxuXG4gIGxldCBtZXNoO1xuICBsZXQgY2xvdGg7XG4gIGxldCBzcGFjaW5nWCA9IDU7XG4gIGxldCBzcGFjaW5nWSA9IDU7XG5cbiAgbGV0IG9wdHMgPSB7XG4gICAgaW1hZ2U6ICdodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3MuY2Rwbi5pby8zOTI1NS9mYWNlLnBuZycsXG4gICAgcG9pbnRzWDogNTAsXG4gICAgcG9pbnRzWTogNTAsXG5cbiAgICBwb2ludENvdW50OiA1MCxcblxuICAgIGJydXNoU2l6ZTogMzAsXG5cbiAgICByYW5kb21JbWFnZSgpe1xuICAgICAgdGhpcy5pbWFnZSA9ICdodHRwczovL3Vuc3BsYXNoLml0LzQwMC80MDA/aW1hZ2U9JyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDExMDApO1xuICAgICAgaWYgKCBjbG90aCApIHsgY2xvdGgucmFuZG9taXplKGxvYWRUZXh0dXJlKTsgfVxuICAgICAgZWxzZSB7IGxvYWRUZXh0dXJlKCk7IH1cbiAgICB9LFxuICAgIHJlc2V0KCl7XG4gICAgICBpZiAoIGNsb3RoICkgeyBjbG90aC5yZXNldCgpOyB9XG4gICAgfSxcblxuICAgIHJhbmRvbWl6ZVBvaW50cygpe1xuICAgICAgaWYgKCBjbG90aCApIHsgY2xvdGgucmFuZG9taXplKCk7IH1cbiAgICB9XG4gIH07XG5cbiAgLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi9cblxuICBsZXQgZ3VpID0gbmV3IGRhdC5HVUkoKTtcbiAgZ3VpLmNsb3NlZCA9IHdpbmRvdy5pbm5lcldpZHRoIDwgNjAwO1xuXG4gIGxldCBpbWFnZSA9IGd1aS5hZGQob3B0cywgJ2ltYWdlJywge1xuICAgIEZhY2U6ICdodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3MuY2Rwbi5pby8zOTI1NS9mYWNlLnBuZycsXG4gICAgTG9nbzogJ2h0dHA6Ly9icm9rZW5zcXVhcmUuY29tL0NvZGUvYXNzZXRzL2xvZ28uc3ZnJyxcbiAgICBzaHNoYXc6ICdodHRwOi8vYnJva2Vuc3F1YXJlLmNvbS9Db2RlL2Fzc2V0cy9oZWFkLnN2ZycsXG4gICAgTGlvbjogJ2h0dHBzOi8vdW5zcGxhc2guaXQvNDAwLzQwMD9pbWFnZT0xMDc0JyxcbiAgICBXYXRlcjogJ2h0dHBzOi8vdW5zcGxhc2guaXQvNDAwLzQwMD9pbWFnZT0xMDUzJyxcbiAgICBZZWxsb3dDdXJ0YWluOiAnaHR0cHM6Ly91bnNwbGFzaC5pdC80MDAvNDAwP2ltYWdlPTg1NScsXG4gICAgVHVubmVsOiAnaHR0cHM6Ly91bnNwbGFzaC5pdC80MDAvNDAwP2ltYWdlPTEzNydcbiAgfSk7XG4gIGltYWdlLm9uQ2hhbmdlKGxvYWRUZXh0dXJlKTtcblxuXG4gIGxldCBwb2ludENvdW50ID0gZ3VpLmFkZChvcHRzLCAncG9pbnRDb3VudCcsIDIwLDgwKS5zdGVwKDEpO1xuICBwb2ludENvdW50Lm9uRmluaXNoQ2hhbmdlKCh2YWwpPT57XG4gICAgb3B0cy5wb2ludHNYID0gb3B0cy5wb2ludHNZID0gdmFsO1xuICAgIGxvYWRUZXh0dXJlKCk7XG4gIH0pO1xuXG5cbiAgLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi9cbiAgbGV0IG1vdXNlID0ge1xuICAgIGRvd246IGZhbHNlLFxuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgICBweDogMCxcbiAgICBweTogMVxuICB9XG5cbiAgbGV0IGJydXNoID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgZnVuY3Rpb24gdXBkYXRlQnJ1c2goKXtcbiAgICBicnVzaC5jbGVhcigpO1xuICAgIGJydXNoLmJsZW5kTW9kZSA9IFBJWEkuQkxFTkRfTU9ERVMuQUREO1xuICAgIGJydXNoLmxpbmVTdHlsZSgxLCAweDg4ODg4OCwgMC40KTtcbiAgICBicnVzaC5kcmF3Q2lyY2xlKDAsIDAsIG9wdHMuYnJ1c2hTaXplKTsgLy8gZHJhd0NpcmNsZSh4LCB5LCByYWRpdXMpXG4gICAgYnJ1c2gueCA9IG1vdXNlLng7XG4gICAgYnJ1c2gueSA9IG1vdXNlLnk7XG4gICAgYnJ1c2gudXBkYXRlTG9jYWxCb3VuZHMoKTtcbiAgfVxuXG4gIHVwZGF0ZUJydXNoKCk7XG5cbiAgbGV0IGluZmx1ZW5jZSA9IGd1aS5hZGQob3B0cywgJ2JydXNoU2l6ZScsIDAsIDEwMCkuc3RlcCgxKTtcbiAgaW5mbHVlbmNlLm9uQ2hhbmdlKHVwZGF0ZUJydXNoKTtcblxuICBsZXQgcmFuZG9tID0gZ3VpLmFkZChvcHRzLCAncmFuZG9tSW1hZ2UnKTtcbiAgbGV0IHJhbmRvbWl6ZSA9IGd1aS5hZGQob3B0cywgJ3JhbmRvbWl6ZVBvaW50cycpO1xuICBsZXQgcmVzZXQgPSBndWkuYWRkKG9wdHMsICdyZXNldCcpO1xuXG4gIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5cbiAgbGV0IHN0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG4gIHN0YWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgc3RhZ2UuYWRkQ2hpbGQoYnJ1c2gpO1xuXG4gIC8vIGxldCByZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHsgdHJhbnNwYXJlbnQ6IHRydWUgfSk7XG4gIC8vIGNvbnNvbGUubG9nKGltZy5jbGllbnRXaWR0aCwgaW1nLmNsaWVudEhlaWdodClcbiAgdmFyIHJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIoaW1nLmNsaWVudFdpZHRoLCBpbWcuY2xpZW50SGVpZ2h0LCB7IHRyYW5zcGFyZW50OiB0cnVlIH0pXG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcbiAgcmVuZGVyZXIucmVuZGVyKHN0YWdlKTtcblxuXG4gIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5cbiAgZnVuY3Rpb24gbG9hZFRleHR1cmUoKSB7XG4gICAgY29uc29sZS5sb2coJ2xvYWRpbmcgdGV4dHVyZScsIG9wdHMuaW1hZ2UpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gJ2xvYWRpbmcnO1xuXG4gICAgLy8gbGV0IHRleHR1cmUgPSBuZXcgUElYSS5UZXh0dXJlLmZyb21JbWFnZShvcHRzLmltYWdlKTtcbiAgICBsZXQgdGV4dHVyZSA9IG5ldyBQSVhJLlRleHR1cmUuZnJvbUltYWdlKGltZy5zcmMpO1xuICAgIGlmICggIXRleHR1cmUucmVxdWlyZXNVcGRhdGUgKSB7XG4gICAgICB0ZXh0dXJlLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIHRleHR1cmUub24oJ2Vycm9yJywgZnVuY3Rpb24oKXsgY29uc29sZS5lcnJvcignQUdIIScpOyB9KTtcblxuICAgIHRleHR1cmUub24oJ3VwZGF0ZScsZnVuY3Rpb24oKXtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gJyc7XG5cbiAgICAgIGNvbnNvbGUubG9nKCd0ZXh0dXJlIGxvYWRlZCcpO1xuXG4gICAgICBpZiAoIG1lc2ggKSB7XG4gICAgICAgIHN0YWdlLnJlbW92ZUNoaWxkKG1lc2gpO1xuICAgICAgfVxuXG4gICAgICBtZXNoID0gbmV3IFBJWEkubWVzaC5QbGFuZSggdGhpcywgb3B0cy5wb2ludHNYLCBvcHRzLnBvaW50c1kpO1xuICAgICAgbWVzaC53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICBtZXNoLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgICBtZXNoLnggPSByZW5kZXJlci53aWR0aCAvIDIgLSBtZXNoLndpZHRoIC8gMjtcbiAgICAgIG1lc2gueSA9IHJlbmRlcmVyLmhlaWdodCAvIDIgLSBtZXNoLmhlaWdodCAvIDI7XG5cbiAgICAgIHNwYWNpbmdYID0gbWVzaC53aWR0aCAvIChvcHRzLnBvaW50c1gtMSk7XG4gICAgICBzcGFjaW5nWSA9IG1lc2guaGVpZ2h0IC8gKG9wdHMucG9pbnRzWS0xKTtcblxuICAgICAgY2xvdGggPSBuZXcgQ2xvdGgob3B0cy5wb2ludHNYLTEsIG9wdHMucG9pbnRzWS0xLCAhb3B0cy5waW5Db3JuZXJzKTtcblxuICAgICAgc3RhZ2UuYWRkQ2hpbGRBdChtZXNoLDApO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZFRleHR1cmUob3B0cy5pbWFnZSk7XG5cbiAgLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi9cblxuICA7KGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICBpZiAoIGNsb3RoICkge1xuICAgICAgY2xvdGgudXBkYXRlKDAuMDE2KVxuICAgIH1cblxuICAgIGJydXNoLnggPSByZW5kZXJlci5wbHVnaW5zLmludGVyYWN0aW9uLm1vdXNlLmdsb2JhbC54XG4gICAgYnJ1c2gueSA9IHJlbmRlcmVyLnBsdWdpbnMuaW50ZXJhY3Rpb24ubW91c2UuZ2xvYmFsLnlcbiAgICAvLyBicnVzaC54ID0gbW91c2UueDtcbiAgICAvLyBicnVzaC55ID0gbW91c2UueTtcblxuXG4gICAgcmVuZGVyZXIucmVuZGVyKHN0YWdlKTtcbiAgfSkoMClcblxuICAvKi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qL1xuXG5cbiAgY29uc3QgdHdvUGkgPSBNYXRoLlBJICogMjtcbiAgY29uc3QgZWFzZSA9IEVsYXN0aWMuZWFzZU91dC5jb25maWcoMS4yLCAwLjQpO1xuXG4gIGNsYXNzIFBvaW50IHtcbiAgICBjb25zdHJ1Y3RvciAoeCwgeSkge1xuICAgICAgdGhpcy54ID0gdGhpcy5vcmlnWCA9IHhcbiAgICAgIHRoaXMueSA9IHRoaXMub3JpZ1kgPSB5XG5cbiAgICAgIHRoaXMucmFuZG9taXplKHRoaXMucmVzZXQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgYW5pbWF0ZVRvKG54LCBueSwgZm9yY2UsIGNhbGxiYWNrKXtcblxuICAgICAgaWYgKCAhdGhpcy5yZXNldHRpbmcgfHwgZm9yY2UgKSB7XG4gICAgICAgIGxldCBkeCA9IG54IC0gdGhpcy54XG4gICAgICAgIGxldCBkeSA9IG55IC0gdGhpcy55XG4gICAgICAgIGxldCBkaXN0ID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KVxuICAgICAgICB0aGlzLnJlc2V0dGluZyA9IHRydWU7XG5cbiAgICAgICAgVHdlZW5NYXgudG8odGhpcyxcbiAgICAgICAgICBNYXRoLm1pbigxLjI1LCBNYXRoLm1heCgwLjQsIGRpc3QgLyA0MCkgKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4OiBueCxcbiAgICAgICAgICAgIHk6IG55LFxuICAgICAgICAgICAgZWFzZTogZWFzZSxcbiAgICAgICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZXNldHRpbmcgPSBmYWxzZVxuICAgICAgICAgICAgICBpZiAoIGNhbGxiYWNrICkgeyBjYWxsYmFjaygpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoIGNhbGxiYWNrICkgeyBjYWxsYmFjaygpOyB9XG4gICAgfVxuXG4gICAgcmFuZG9taXplKGNhbGxiYWNrKSB7XG4gICAgICBsZXQgbnggPSB0aGlzLnggKyAoKE1hdGgucmFuZG9tKCkgKiA2MCkgLSAzMCk7XG4gICAgICBsZXQgbnkgPSB0aGlzLnkgKyAoKE1hdGgucmFuZG9tKCkgKiA2MCkgLSAzMCk7XG5cbiAgICAgIHRoaXMuYW5pbWF0ZVRvKG54LCBueSwgbnVsbCwgY2FsbGJhY2sgPyBjYWxsYmFjayA6IG51bGwgKTtcbiAgICB9XG5cbiAgICByZXNldCgpe1xuICAgICAgdGhpcy5hbmltYXRlVG8odGhpcy5vcmlnWCwgdGhpcy5vcmlnWSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlIChkZWx0YSkge1xuXG4gICAgICBsZXQgZHg7XG4gICAgICBsZXQgZHk7XG5cbiAgICAgIGlmICghdGhpcy5yZXNldHRpbmcgJiYgbW91c2UuZG93bikge1xuICAgICAgICAvLyBkeCA9IHRoaXMueCAtIG1vdXNlLnggKyBtZXNoLnhcbiAgICAgICAgLy8gZHkgPSB0aGlzLnkgLSBtb3VzZS55ICsgbWVzaC55XG4gICAgICAgIGR4ID0gTWF0aC5hYnMobW91c2UueCAtIHRoaXMueClcbiAgICAgICAgZHkgPSBNYXRoLmFicyhtb3VzZS55IC0gdGhpcy55KVxuICAgICAgICAvLyBjb25zb2xlLmxvZygnLT4nLGR4IClcblxuICAgICAgICBsZXQgZGlzdCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2Rpc3QnLCBkaXN0KVxuXG4gICAgICAgIGlmICggZGlzdCA8IG9wdHMuYnJ1c2hTaXplKSB7XG4gICAgICAgICAgbGV0IGEgPSB0aGlzLnhcbiAgICAgICAgICB0aGlzLnggPSB0aGlzLnggKyAoKCBtb3VzZS54IC0gbW91c2UucHgpICogTWF0aC5hYnMoIE1hdGguY29zKCB0d29QaSAqIGR4IC8gZGlzdCkpKVxuICAgICAgICAgIHRoaXMueSA9IHRoaXMueSArICgoIG1vdXNlLnkgLSBtb3VzZS5weSkgKiBNYXRoLmFicyggTWF0aC5jb3MoIHR3b1BpICogZHkgLyBkaXN0KSkpXG4gICAgICAgICAgY29uc29sZS5sb2coZGlzdCwgdGhpcy54LCBhKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfVxuXG4gIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5cbiAgbGV0IGNvdW50ID0gMDtcblxuICBjbGFzcyBDbG90aCB7XG4gICAgY29uc3RydWN0b3IgKGNsb3RoWCwgY2xvdGhZLCBmcmVlKSB7XG4gICAgICB0aGlzLnBvaW50cyA9IFtdXG5cbiAgICAgIGxldCBzdGFydFggPSAwOyAvL3JlbmRlcmVyLnZpZXcud2lkdGggLyAyIC0gY2xvdGhYICogc3BhY2luZ1ggLyAyO1xuICAgICAgbGV0IHN0YXJ0WSA9IDAvL3JlbmRlcmVyLnZpZXcuaGVpZ2h0ICogMC4xO1xuXG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8PSBjbG90aFk7IHkrKykge1xuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8PSBjbG90aFg7IHgrKykge1xuICAgICAgICAgIGxldCBwb2ludCA9IG5ldyBQb2ludChzdGFydFggKyB4ICogc3BhY2luZ1gsIHN0YXJ0WSArIHkgKiBzcGFjaW5nWSlcbiAgICAgICAgICB0aGlzLnBvaW50cy5wdXNoKHBvaW50KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmFuZG9taXplKGNhbGxiYWNrKXtcbiAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHBvaW50LGkpID0+IHtcbiAgICAgICAgcG9pbnQucmFuZG9taXplKCBpID09PSAwID8gY2FsbGJhY2sgOiBudWxsICk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIHJlc2V0KCl7XG4gICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCkgPT4ge1xuICAgICAgICBwb2ludC5yZXNldCgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHVwZGF0ZSAoZGVsdGEpIHtcbiAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHBvaW50LGkpID0+IHtcbiAgICAgICAgcG9pbnQudXBkYXRlKGRlbHRhICogZGVsdGEpXG5cbiAgICAgICAgaWYgKCBtZXNoICkge1xuICAgICAgICAgIGkgKj0gMjtcbiAgICAgICAgICBtZXNoLnZlcnRpY2VzW2ldID0gcG9pbnQueDtcbiAgICAgICAgICBtZXNoLnZlcnRpY2VzW2krMV0gPSBwb2ludC55O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBvaW50ZXJNb3ZlKGUpIHtcbiAgICAvLyBsZXQgcG9pbnRlciA9IGUudG91Y2hlcyA/IGUudG91Y2hlc1swXSA6IGU7XG5cbiAgICBsZXQgbHAgPSBlLmRhdGEuZ2V0TG9jYWxQb3NpdGlvbihzdGFnZSlcbiAgICBtb3VzZS5weCA9IG1vdXNlLnggfHwgbHAueFxuICAgIG1vdXNlLnB5ID0gbW91c2UueSB8fCBscC55XG4gICAgLy8gbW91c2UueCA9IHBvaW50ZXIuY2xpZW50WFxuICAgIC8vIG1vdXNlLnkgPSBwb2ludGVyLmNsaWVudFlcblxuICAgIC8vIGNvbnNvbGUubG9nKG1vdXNlKVxuICAgIC8vIGNvbnNvbGUubG9nKGUpXG4gICAgbW91c2UueCA9IGxwLnhcbiAgICBtb3VzZS55ID0gbHAueVxuICB9XG5cbiAgZnVuY3Rpb24gcG9pbnRlckRvd24oZSl7XG4gICAgbW91c2UuZG93biA9IHRydWVcbiAgICBtb3VzZS5idXR0b24gPSAxXG4gICAgcG9pbnRlck1vdmUoZSk7XG4gIH1cblxuICBmdW5jdGlvbiBwb2ludGVyVXAoZSl7XG4gICAgbW91c2UuZG93biA9IGZhbHNlO1xuICAgIG1vdXNlLnB4ID0gbnVsbDtcbiAgICBtb3VzZS5weSA9IG51bGw7XG4gIH1cblxuICBzdGFnZS5vbignbW91c2Vkb3duJywgcG9pbnRlckRvd24pXG4gIHN0YWdlLm9uKCdtb3VzZW1vdmUnLCBwb2ludGVyTW92ZSlcbiAgc3RhZ2Uub24oJ21vdXNldXAnLCBwb2ludGVyVXApXG5cbiAgYWRkTGlzdGVuZXIoJy5qcy1yZXNldC1tZXNoJywgJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChjbG90aCkge1xuICAgICAgY2xvdGgucmVzZXQoKVxuICAgIH1cbiAgfSlcblxuICAvLyByZW5kZXJlci52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHBvaW50ZXJEb3duKTtcbiAgLy8gcmVuZGVyZXIudmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgcG9pbnRlckRvd24pO1xuICAvLyByZW5kZXJlci52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBwb2ludGVyRG93bik7XG5cbiAgLy8gZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLHBvaW50ZXJNb3ZlKTtcbiAgLy8gZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwb2ludGVyTW92ZSk7XG5cbiAgLy8gZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcG9pbnRlclVwKTtcbiAgLy8gZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHBvaW50ZXJVcCk7XG4gIC8vIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHBvaW50ZXJVcCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmdvXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9jYXJnby5qc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvanMvY2FyZ28uanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgZmluZCB9IGZyb20gJy4vdXRpbHMvZWxlbWVudHMnXG4vLyBpbXBvcnQgcGl4aSBmcm9tICcuL3BpeGlqcy0xJyAvLyBmaXJzdCBkZW1vIGFxdWEgbWFnbmlmeVxuLy8gaW1wb3J0IHBpeGkgZnJvbSAnLi9yZXNpemUnXG4vLyBpbXBvcnQgbGlxdWlmeSBmcm9tICcuL2xpcXVpZnktb25lJ1xuLy8gaW1wb3J0IGxpcXVpZnkgZnJvbSAnLi9saXF1aWZ5LXR3bydcbi8vIGltcG9ydCBzbW9rZXkgZnJvbSAnLi9zbW9rZSdcbi8vIGltcG9ydCB3YXRlckltYWdlIGZyb20gJy4vd2F0ZXItaW1hZ2UnXG4vLyBpbXBvcnQgc2ltcGxlRGlzcGxhY2VtZW50IGZyb20gJy4vc2ltcGxlLWRpc3BsYWNlbWVudCdcbi8vIGltcG9ydCBzbWVhciBmcm9tICcuL3NtZWFyJ1xuLy8gaW1wb3J0IHdvYmJsZSBmcm9tICcuL3dvYmJsZSdcbi8vIGltcG9ydCByZWdsIGZyb20gJy4vcmVnbCdcbi8vIGltcG9ydCB3YXRlciBmcm9tICcuL3RocmVlLXdhdGVyJ1xuLy8gaW1wb3J0IHdhdGVyRmx1aWQgZnJvbSAnLi4vLi4vcHVibGljL3dhdGVyLWZsdWlkL21haW4nXG4vL1xuLy8gaW1wb3J0IGRwMiBmcm9tICcuL2Rpc3BsYWNlLTInXG5pbXBvcnQgQ2FyZ28gZnJvbSAnLi9jYXJnbydcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi4vc3R5bGVzL3N0eWxlcy5zY3NzJ1xuXG5cbmNvbnN0IGRvY1JlYWR5ID0gKC8qIGV2ZW50ICovKSA9PiB7XG4gICAgQ2FyZ28oKVxuXG4gIC8vIHBpeGkoKVxuICAvLyBsaXF1aWZ5KClcbiAgLy8gc21va2V5KClcbiAgLy8gc21va2V5UGl4aSgpXG4gIC8vIHdhdGVySW1hZ2UoKVxuICAvLyBzaW1wbGVEaXNwbGFjZW1lbnQoKVxuICAvLyBzbWVhcigpXG4gIC8vIHdvYmJsZSgpXG4gIC8vIHJlZ2woKVxuICAvLyB3YXRlcigpXG4gIC8vIHdhdGVyRmx1aWQoKVxuICAvLyByZWdsKClcblxuICAvLyBkcDIoZmluZCgnLmMtaW1nJylbMF0sIHtcbiAgLy8gICBpbWc6ICdodHRwczovL2Zhcm02LnN0YXRpY2ZsaWNrci5jb20vNTA3OC8xNDAzMjkzNTU1OV84YzEzZTliMTgxX3pfZC5qcGcnXG4gIC8vIH0pXG4gIC8vXG4gIC8vIGRwMihmaW5kKCcuYy1sb2dvJylbMF0sIHtcbiAgLy8gICAvLyBpbWc6ICdwdWJsaWMvdHVydGxlLTUxMi5qcGcnXG4gIC8vICAgaW1nOiAncHVibGljL2NhcmdvLWxvZ28ucG5nJ1xuICAvLyB9KVxufVxuXG5jb25zdCBpbml0ID0gKCkgPT4ge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZG9jUmVhZHkpXG59XG5cblxuaW5pdCgpXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvanMvaW5kZXguanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNvbnN0IGZpbmQgPSAocXVlcnlTZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50KSA9PlxuICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnlTZWxlY3RvcikpXG5cbmNvbnN0IGlzRWxlbWVudCA9IChlbCkgPT4ge1xuICB0cnkge1xuICAgIC8vIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tZSlcbiAgICAvLyByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKCEoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgIHJldHVybiBmaW5kKGVsKVswXS5sZW5ndGggPiAwXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgLy8gYW4gZXhjZXB0aW9uIGlzIHRocm93biBhbmQgd2UgZW5kIHVwIGhlcmUuIFRlc3Rpbmcgc29tZVxuICAgIC8vIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcbiAgICByZXR1cm4gKHR5cGVvZiBlbCA9PT0gJ29iamVjdCcpICYmXG4gICAgICAoZWwubm9kZVR5cGUgPT09IDEpICYmICh0eXBlb2YgZWwuc3R5bGUgPT09ICdvYmplY3QnKSAmJlxuICAgICAgKHR5cGVvZiBlbC5vd25lckRvY3VtZW50ID09PSAnb2JqZWN0JylcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgaGFzQ2xhc3MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PiB7XG4gIGlmICghaXNFbGVtZW50KGVsZW1lbnQpKSByZXR1cm4gZmFsc2VcblxuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBSZWdFeHAoYChefCApJHtjbGFzc05hbWV9KCB8JClgLCAnZ2knKS50ZXN0KGVsZW1lbnQuY2xhc3NOYW1lKVxufVxuXG5cbmV4cG9ydCBjb25zdCBhZGRDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcbiAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkpIHJldHVybiBmYWxzZVxuXG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgKz0gYCAke2NsYXNzTmFtZX1gXG4gIH1cbiAgcmV0dXJuIGVsZW1lbnRcbn1cblxuXG5leHBvcnQgY29uc3QgcmVtb3ZlQ2xhc3MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PiB7XG4gIGlmICghaXNFbGVtZW50KGVsZW1lbnQpKSByZXR1cm4gZmFsc2VcblxuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKVxuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKGAoXnxcXFxcYikke2NsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKX0oXFxcXGJ8JClgLCAnZ2knKSwgJyAnKVxuICB9XG4gIHJldHVybiBlbGVtZW50XG59XG5cbmV4cG9ydCBjb25zdCB0b2dnbGVDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+XG4gIGhhc0NsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkgPyByZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIDogYWRkQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKVxuXG5cbmV4cG9ydCBjb25zdCBleGlzdHMgPSAoc2VsZWN0b3IsIGVsZW1lbnQgPSBkb2N1bWVudCkgPT4gZWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSAhPT0gbnVsbFxuXG5leHBvcnQgY29uc3QgZmluZFBhcmVudEJ5Q2xhc3MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PiB7XG4gIGxldCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgaWYgKHBhcmVudCAhPT0gbnVsbCkge1xuICAgIGlmIChoYXNDbGFzcyhwYXJlbnQsIGNsYXNzTmFtZSkpIHtcbiAgICAgIHJldHVybiBwYXJlbnRcbiAgICB9XG5cbiAgICBwYXJlbnQgPSBmaW5kUGFyZW50QnlDbGFzcyhwYXJlbnQsIGNsYXNzTmFtZSlcbiAgfVxuICByZXR1cm4gcGFyZW50XG59XG5cbmV4cG9ydCBjb25zdCBmaW5kUG9zID0gKG9iaikgPT4ge1xuICBsZXQgY3VybGVmdCA9IDBcbiAgbGV0IGN1cnRvcCA9IDBcblxuICBpZiAob2JqLm9mZnNldFBhcmVudCkge1xuICAgIGRvIHtcbiAgICAgIGN1cmxlZnQgKz0gb2JqLm9mZnNldExlZnRcbiAgICAgIGN1cnRvcCArPSBvYmoub2Zmc2V0VG9wXG4gICAgfSB3aGlsZSAob2JqID0gb2JqLm9mZnNldFBhcmVudClcblxuICAgIHJldHVybiBbY3VydG9wLCBjdXJsZWZ0XVxuICB9XG4gIHJldHVybiBbY3VydG9wLCBjdXJsZWZ0XVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvdXRpbHMvZWxlbWVudHMuanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2pzL3V0aWxzL2VsZW1lbnRzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGRlYm91bmNlID0gKGZuLCBkZWxheSkgPT4ge1xuICBsZXQgdGltZXIgPSBudWxsXG4gIHJldHVybiAoKSA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKVxuICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgfSwgZGVsYXkpXG4gIH1cbn1cblxuY29uc3QgYXR0YWNoTGlzdGVuZXIgPSAoZWxlbWVudCwgZXZlbnROYW1lLCBoYW5kbGVyLCBkZWJvdW5jZURlbGF5ID0gMCkgPT4ge1xuICBpZiAoZGVib3VuY2VEZWxheSA+IDApIHtcbiAgICBoYW5kbGVyID0gZGVib3VuY2UoaGFuZGxlciwgZGVib3VuY2VEZWxheSlcbiAgfVxuXG4gIGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBmYWxzZSlcbiAgfSBlbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KSB7XG4gICAgZWxlbWVudC5hdHRhY2hFdmVudChgb24ke2V2ZW50TmFtZX1gLCBoYW5kbGVyKVxuICB9IGVsc2Uge1xuICAgIGVsZW1lbnRbYG9uJHtldmVudE5hbWV9YF0gPSBoYW5kbGVyXG4gIH1cbn1cbi8qKlxuICogYWRkcyBhbiBldmVudExpc3RlbmVyIHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gW05vZGVMaXN0fE9iamVjdHxTdHJpbmddICBlbCAgT2JqZWN0KHMpIHRvIGJpbmQgdGhlIGxpc3RlbmVyXG4gKiBAcGFyYW0gW1N0cmluZ10gIGV2ZW50TmFtZSBOYW1lIG9mIHRoZSBldmVudCBlLmcuIGNsaWNrXG4gKiBAcGFyYW0gW2Z1bmN0aW9uXSAgaGFuZGxlciBDYWxsYmFjayBmdW5jdGlvblxuICovXG5leHBvcnQgY29uc3QgYWRkTGlzdGVuZXIgPSAoZWwsIGV2ZW50TmFtZSwgaGFuZGxlciwgZGVib3VuY2VEZWxheSA9IDApID0+IHtcbiAgaWYgKHR5cGVvZiAoZWwpID09PSAnc3RyaW5nJykge1xuICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbClcbiAgICBpZiAoZWwubGVuZ3RoID09PSAxKSB7XG4gICAgICBlbCA9IGVsWzBdIC8vIGlmIG9ubHkgb25lIHNldCBpdCBwcm9wZXJseVxuICAgIH1cbiAgfVxuXG4gIGlmIChlbCA9PSBudWxsIHx8IHR5cGVvZiAoZWwpID09PSAndW5kZWZpbmVkJykgcmV0dXJuXG5cbiAgaWYgKGVsLmxlbmd0aCAhPT0gdW5kZWZpbmVkICYmIGVsLmxlbmd0aCA+IDEgJiYgZWwgIT09IHdpbmRvdykgeyAvLyBpdCdzIGEgTm9kZUxpc3RDb2xsZWN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgYXR0YWNoTGlzdGVuZXIoZWxbaV0sIGV2ZW50TmFtZSwgaGFuZGxlciwgZGVib3VuY2VEZWxheSlcbiAgICB9XG4gIH0gZWxzZSB7IC8vIGl0J3MgYSBzaW5nbGUgbm9kZVxuICAgIGF0dGFjaExpc3RlbmVyKGVsLCBldmVudE5hbWUsIGhhbmRsZXIsIGRlYm91bmNlRGVsYXkpXG4gIH1cbn1cblxuXG5jb25zdCBkZXRhY2hMaXN0ZW5lciA9IChlbGVtZW50LCBldmVudE5hbWUsIGhhbmRsZXIpID0+IHtcbiAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKVxuICB9IGVsc2UgaWYgKGVsZW1lbnQuZGV0YWNoRXZlbnQpIHtcbiAgICBlbGVtZW50LmRldGFjaEV2ZW50KGBvbiR7ZXZlbnROYW1lfWAsIGhhbmRsZXIpXG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudFtgb24ke2V2ZW50TmFtZX1gXSA9IG51bGxcbiAgfVxufVxuXG5cbmV4cG9ydCBjb25zdCByZW1vdmVMaXN0ZW5lciA9IChlbCwgZXZlbnROYW1lLCBoYW5kbGVyKSA9PiB7XG4gIGlmICh0eXBlb2YgKGVsKSA9PT0gJ3N0cmluZycpIHtcbiAgICBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWwpXG4gICAgaWYgKGVsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZWwgPSBlbFswXSAvLyBpZiBvbmx5IG9uZSBzZXQgaXQgcHJvcGVybHlcbiAgICB9XG4gIH1cblxuICBpZiAoZWwgPT0gbnVsbCB8fCB0eXBlb2YgKGVsKSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVyblxuXG4gIGlmIChlbC5sZW5ndGggIT09IHVuZGVmaW5lZCAmJiBlbC5sZW5ndGggPiAxICYmIGVsICE9PSB3aW5kb3cpIHsgLy8gaXQncyBhIE5vZGVMaXN0Q29sbGVjdGlvblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWwubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGRldGFjaExpc3RlbmVyKGVsW2ldLCBldmVudE5hbWUsIGhhbmRsZXIpXG4gICAgfVxuICB9IGVsc2UgeyAvLyBpdCdzIGEgc2luZ2xlIG5vZGVcbiAgICBkZXRhY2hMaXN0ZW5lcihlbCwgZXZlbnROYW1lLCBoYW5kbGVyKVxuICB9XG59XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL3V0aWxzL2V2ZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvanMvdXRpbHMvZXZlbnRzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3R5bGVzL3N0eWxlcy5zY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9zdHlsZXMvc3R5bGVzLnNjc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==