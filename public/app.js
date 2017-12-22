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

  // renderer.view.addEventListener('mousedown', pointerDown);
  // renderer.view.addEventListener('mouseenter', pointerDown);
  // renderer.view.addEventListener('touchstart', pointerDown);

  // document.body.addEventListener('mousemove',pointerMove);
  // document.body.addEventListener('touchmove', pointerMove);

  // document.body.addEventListener('mouseup', pointerUp);
  // document.body.addEventListener('touchend', pointerUp);
  // document.body.addEventListener('mouseleave', pointerUp);





































  // const render = () => {
  //   requestAnimationFrame(render)
  //   renderer.render(stage)
  // }
  //
  // render()
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

/***/ "./src/styles/styles.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/js/index.js");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjAyYjg4MGZmYTRhYzlmNjVjYWEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NhcmdvLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdXRpbHMvZWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy9zdHlsZXMuc2Nzcz85ZWNiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDaEVlOztBQUVmOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLDhCQUE4QjtBQUNsRCxZQUFZLGVBQWU7QUFDM0IsS0FBSztBQUNMO0FBQ0Esb0JBQW9CLGVBQWU7QUFDbkMsS0FBSzs7QUFFTDtBQUNBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7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OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSCw2QkFBNkIsVUFBVTtBQUN2QztBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsdUVBQXVFLCtCQUErQjtBQUN0RztBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFBQTtBQUFBOzs7QUFHQTtBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUN0RkEseUMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL3B1YmxpYy9qcy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBmMDJiODgwZmZhNGFjOWY2NWNhYSIsImltcG9ydCB7IGZpbmQgfSBmcm9tICcuL3V0aWxzL2VsZW1lbnRzJ1xuXG5jb25zdCBDYXJnbyA9ICgpID0+IHtcblxuICBjb25zdCBpbWcgPSBmaW5kKCcuanMtY2FyZ28tbG9nbycpWzBdXG4gIC8vIGNvbnNvbGUubG9nKGltZylcbiAgLy9cbiAgLy9cbiAgLy8gdmFyIHJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIoaW1nLmNsaWVudFdpZHRoLCBpbWcuY2xpZW50SGVpZ2h0LCB7XG4gIC8vICAgdHJhbnNwYXJlbnQ6IHRydWVcbiAgLy8gfSlcbiAgLy9cbiAgLy8gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcbiAgLy9cbiAgLy8gdmFyIHN0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG4gIC8vXG4gIC8vIHZhciBjYXJnb0xvZ28gPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJy4vcHVibGljL2NhcmdvX2xvZ28ucG5nJyk7XG4gIC8vIGNhcmdvTG9nby5hbmNob3IueCA9IDBcbiAgLy8gY2FyZ29Mb2dvLmFuY2hvci55ID0gMFxuICAvLyBzdGFnZS5hZGRDaGlsZChjYXJnb0xvZ28pXG5cblxuXG4gIC8vLyBUVVRPUklBTCFcblxuICBsZXQgbWVzaDtcbiAgbGV0IGNsb3RoO1xuICBsZXQgc3BhY2luZ1ggPSA1O1xuICBsZXQgc3BhY2luZ1kgPSA1O1xuXG4gIGxldCBvcHRzID0ge1xuICAgIGltYWdlOiAnaHR0cHM6Ly9zMy11cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9zLmNkcG4uaW8vMzkyNTUvZmFjZS5wbmcnLFxuICAgIHBvaW50c1g6IDUwLFxuICAgIHBvaW50c1k6IDUwLFxuXG4gICAgcG9pbnRDb3VudDogNTAsXG5cbiAgICBicnVzaFNpemU6IDMwLFxuXG4gICAgcmFuZG9tSW1hZ2UoKXtcbiAgICAgIHRoaXMuaW1hZ2UgPSAnaHR0cHM6Ly91bnNwbGFzaC5pdC80MDAvNDAwP2ltYWdlPScgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMTAwKTtcbiAgICAgIGlmICggY2xvdGggKSB7IGNsb3RoLnJhbmRvbWl6ZShsb2FkVGV4dHVyZSk7IH1cbiAgICAgIGVsc2UgeyBsb2FkVGV4dHVyZSgpOyB9XG4gICAgfSxcbiAgICByZXNldCgpe1xuICAgICAgaWYgKCBjbG90aCApIHsgY2xvdGgucmVzZXQoKTsgfVxuICAgIH0sXG5cbiAgICByYW5kb21pemVQb2ludHMoKXtcbiAgICAgIGlmICggY2xvdGggKSB7IGNsb3RoLnJhbmRvbWl6ZSgpOyB9XG4gICAgfVxuICB9O1xuXG4gIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5cbiAgbGV0IGd1aSA9IG5ldyBkYXQuR1VJKCk7XG4gIGd1aS5jbG9zZWQgPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDYwMDtcblxuICBsZXQgaW1hZ2UgPSBndWkuYWRkKG9wdHMsICdpbWFnZScsIHtcbiAgICBGYWNlOiAnaHR0cHM6Ly9zMy11cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9zLmNkcG4uaW8vMzkyNTUvZmFjZS5wbmcnLFxuICAgIExvZ286ICdodHRwOi8vYnJva2Vuc3F1YXJlLmNvbS9Db2RlL2Fzc2V0cy9sb2dvLnN2ZycsXG4gICAgc2hzaGF3OiAnaHR0cDovL2Jyb2tlbnNxdWFyZS5jb20vQ29kZS9hc3NldHMvaGVhZC5zdmcnLFxuICAgIExpb246ICdodHRwczovL3Vuc3BsYXNoLml0LzQwMC80MDA/aW1hZ2U9MTA3NCcsXG4gICAgV2F0ZXI6ICdodHRwczovL3Vuc3BsYXNoLml0LzQwMC80MDA/aW1hZ2U9MTA1MycsXG4gICAgWWVsbG93Q3VydGFpbjogJ2h0dHBzOi8vdW5zcGxhc2guaXQvNDAwLzQwMD9pbWFnZT04NTUnLFxuICAgIFR1bm5lbDogJ2h0dHBzOi8vdW5zcGxhc2guaXQvNDAwLzQwMD9pbWFnZT0xMzcnXG4gIH0pO1xuICBpbWFnZS5vbkNoYW5nZShsb2FkVGV4dHVyZSk7XG5cblxuICBsZXQgcG9pbnRDb3VudCA9IGd1aS5hZGQob3B0cywgJ3BvaW50Q291bnQnLCAyMCw4MCkuc3RlcCgxKTtcbiAgcG9pbnRDb3VudC5vbkZpbmlzaENoYW5nZSgodmFsKT0+e1xuICAgIG9wdHMucG9pbnRzWCA9IG9wdHMucG9pbnRzWSA9IHZhbDtcbiAgICBsb2FkVGV4dHVyZSgpO1xuICB9KTtcblxuXG4gIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG4gIGxldCBtb3VzZSA9IHtcbiAgICBkb3duOiBmYWxzZSxcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgcHg6IDAsXG4gICAgcHk6IDFcbiAgfVxuXG4gIGxldCBicnVzaCA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gIGZ1bmN0aW9uIHVwZGF0ZUJydXNoKCl7XG4gICAgYnJ1c2guY2xlYXIoKTtcbiAgICBicnVzaC5ibGVuZE1vZGUgPSBQSVhJLkJMRU5EX01PREVTLkFERDtcbiAgICBicnVzaC5saW5lU3R5bGUoMSwgMHg4ODg4ODgsIDAuNCk7XG4gICAgYnJ1c2guZHJhd0NpcmNsZSgwLCAwLCBvcHRzLmJydXNoU2l6ZSk7IC8vIGRyYXdDaXJjbGUoeCwgeSwgcmFkaXVzKVxuICAgIGJydXNoLnggPSBtb3VzZS54O1xuICAgIGJydXNoLnkgPSBtb3VzZS55O1xuICAgIGJydXNoLnVwZGF0ZUxvY2FsQm91bmRzKCk7XG4gIH1cblxuICB1cGRhdGVCcnVzaCgpO1xuXG4gIGxldCBpbmZsdWVuY2UgPSBndWkuYWRkKG9wdHMsICdicnVzaFNpemUnLCAwLCAxMDApLnN0ZXAoMSk7XG4gIGluZmx1ZW5jZS5vbkNoYW5nZSh1cGRhdGVCcnVzaCk7XG5cbiAgbGV0IHJhbmRvbSA9IGd1aS5hZGQob3B0cywgJ3JhbmRvbUltYWdlJyk7XG4gIGxldCByYW5kb21pemUgPSBndWkuYWRkKG9wdHMsICdyYW5kb21pemVQb2ludHMnKTtcbiAgbGV0IHJlc2V0ID0gZ3VpLmFkZChvcHRzLCAncmVzZXQnKTtcblxuICAvKi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qL1xuXG4gIGxldCBzdGFnZSA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICBzdGFnZS5pbnRlcmFjdGl2ZSA9IHRydWU7XG4gIHN0YWdlLmFkZENoaWxkKGJydXNoKTtcblxuICAvLyBsZXQgcmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0LCB7IHRyYW5zcGFyZW50OiB0cnVlIH0pO1xuICAvLyBjb25zb2xlLmxvZyhpbWcuY2xpZW50V2lkdGgsIGltZy5jbGllbnRIZWlnaHQpXG4gIHZhciByZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKGltZy5jbGllbnRXaWR0aCwgaW1nLmNsaWVudEhlaWdodCwgeyB0cmFuc3BhcmVudDogdHJ1ZSB9KVxuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIudmlldyk7XG4gIHJlbmRlcmVyLnJlbmRlcihzdGFnZSk7XG5cblxuICAvKi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qL1xuXG4gIGZ1bmN0aW9uIGxvYWRUZXh0dXJlKCkge1xuICAgIGNvbnNvbGUubG9nKCdsb2FkaW5nIHRleHR1cmUnLCBvcHRzLmltYWdlKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9ICdsb2FkaW5nJztcblxuICAgIC8vIGxldCB0ZXh0dXJlID0gbmV3IFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2Uob3B0cy5pbWFnZSk7XG4gICAgbGV0IHRleHR1cmUgPSBuZXcgUElYSS5UZXh0dXJlLmZyb21JbWFnZShpbWcuc3JjKTtcbiAgICBpZiAoICF0ZXh0dXJlLnJlcXVpcmVzVXBkYXRlICkge1xuICAgICAgdGV4dHVyZS51cGRhdGUoKTtcbiAgICB9XG5cbiAgICB0ZXh0dXJlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKCl7IGNvbnNvbGUuZXJyb3IoJ0FHSCEnKTsgfSk7XG5cbiAgICB0ZXh0dXJlLm9uKCd1cGRhdGUnLGZ1bmN0aW9uKCl7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9ICcnO1xuXG4gICAgICBjb25zb2xlLmxvZygndGV4dHVyZSBsb2FkZWQnKTtcblxuICAgICAgaWYgKCBtZXNoICkge1xuICAgICAgICBzdGFnZS5yZW1vdmVDaGlsZChtZXNoKTtcbiAgICAgIH1cblxuICAgICAgbWVzaCA9IG5ldyBQSVhJLm1lc2guUGxhbmUoIHRoaXMsIG9wdHMucG9pbnRzWCwgb3B0cy5wb2ludHNZKTtcbiAgICAgIG1lc2gud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgbWVzaC5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgbWVzaC54ID0gcmVuZGVyZXIud2lkdGggLyAyIC0gbWVzaC53aWR0aCAvIDI7XG4gICAgICBtZXNoLnkgPSByZW5kZXJlci5oZWlnaHQgLyAyIC0gbWVzaC5oZWlnaHQgLyAyO1xuXG4gICAgICBzcGFjaW5nWCA9IG1lc2gud2lkdGggLyAob3B0cy5wb2ludHNYLTEpO1xuICAgICAgc3BhY2luZ1kgPSBtZXNoLmhlaWdodCAvIChvcHRzLnBvaW50c1ktMSk7XG5cbiAgICAgIGNsb3RoID0gbmV3IENsb3RoKG9wdHMucG9pbnRzWC0xLCBvcHRzLnBvaW50c1ktMSwgIW9wdHMucGluQ29ybmVycyk7XG5cbiAgICAgIHN0YWdlLmFkZENoaWxkQXQobWVzaCwwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWRUZXh0dXJlKG9wdHMuaW1hZ2UpO1xuXG4gIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5cbiAgOyhmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgaWYgKCBjbG90aCApIHtcbiAgICAgIGNsb3RoLnVwZGF0ZSgwLjAxNilcbiAgICB9XG5cbiAgICBicnVzaC54ID0gcmVuZGVyZXIucGx1Z2lucy5pbnRlcmFjdGlvbi5tb3VzZS5nbG9iYWwueFxuICAgIGJydXNoLnkgPSByZW5kZXJlci5wbHVnaW5zLmludGVyYWN0aW9uLm1vdXNlLmdsb2JhbC55XG4gICAgLy8gYnJ1c2gueCA9IG1vdXNlLng7XG4gICAgLy8gYnJ1c2gueSA9IG1vdXNlLnk7XG5cblxuICAgIHJlbmRlcmVyLnJlbmRlcihzdGFnZSk7XG4gIH0pKDApXG5cbiAgLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vKi9cblxuXG4gIGNvbnN0IHR3b1BpID0gTWF0aC5QSSAqIDI7XG4gIGNvbnN0IGVhc2UgPSBFbGFzdGljLmVhc2VPdXQuY29uZmlnKDEuMiwgMC40KTtcblxuICBjbGFzcyBQb2ludCB7XG4gICAgY29uc3RydWN0b3IgKHgsIHkpIHtcbiAgICAgIHRoaXMueCA9IHRoaXMub3JpZ1ggPSB4XG4gICAgICB0aGlzLnkgPSB0aGlzLm9yaWdZID0geVxuXG4gICAgICB0aGlzLnJhbmRvbWl6ZSh0aGlzLnJlc2V0LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGFuaW1hdGVUbyhueCwgbnksIGZvcmNlLCBjYWxsYmFjayl7XG5cbiAgICAgIGlmICggIXRoaXMucmVzZXR0aW5nIHx8IGZvcmNlICkge1xuICAgICAgICBsZXQgZHggPSBueCAtIHRoaXMueFxuICAgICAgICBsZXQgZHkgPSBueSAtIHRoaXMueVxuICAgICAgICBsZXQgZGlzdCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSlcbiAgICAgICAgdGhpcy5yZXNldHRpbmcgPSB0cnVlO1xuXG4gICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMsXG4gICAgICAgICAgTWF0aC5taW4oMS4yNSwgTWF0aC5tYXgoMC40LCBkaXN0IC8gNDApICksXG4gICAgICAgICAge1xuICAgICAgICAgICAgeDogbngsXG4gICAgICAgICAgICB5OiBueSxcbiAgICAgICAgICAgIGVhc2U6IGVhc2UsXG4gICAgICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucmVzZXR0aW5nID0gZmFsc2VcbiAgICAgICAgICAgICAgaWYgKCBjYWxsYmFjayApIHsgY2FsbGJhY2soKTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKCBjYWxsYmFjayApIHsgY2FsbGJhY2soKTsgfVxuICAgIH1cblxuICAgIHJhbmRvbWl6ZShjYWxsYmFjaykge1xuICAgICAgbGV0IG54ID0gdGhpcy54ICsgKChNYXRoLnJhbmRvbSgpICogNjApIC0gMzApO1xuICAgICAgbGV0IG55ID0gdGhpcy55ICsgKChNYXRoLnJhbmRvbSgpICogNjApIC0gMzApO1xuXG4gICAgICB0aGlzLmFuaW1hdGVUbyhueCwgbnksIG51bGwsIGNhbGxiYWNrID8gY2FsbGJhY2sgOiBudWxsICk7XG4gICAgfVxuXG4gICAgcmVzZXQoKXtcbiAgICAgIHRoaXMuYW5pbWF0ZVRvKHRoaXMub3JpZ1gsIHRoaXMub3JpZ1ksIHRydWUpO1xuICAgIH1cblxuICAgIHVwZGF0ZSAoZGVsdGEpIHtcblxuICAgICAgbGV0IGR4O1xuICAgICAgbGV0IGR5O1xuXG4gICAgICBpZiAoIXRoaXMucmVzZXR0aW5nICYmIG1vdXNlLmRvd24pIHtcbiAgICAgICAgLy8gZHggPSB0aGlzLnggLSBtb3VzZS54ICsgbWVzaC54XG4gICAgICAgIC8vIGR5ID0gdGhpcy55IC0gbW91c2UueSArIG1lc2gueVxuICAgICAgICBkeCA9IE1hdGguYWJzKG1vdXNlLnggLSB0aGlzLngpXG4gICAgICAgIGR5ID0gTWF0aC5hYnMobW91c2UueSAtIHRoaXMueSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coJy0+JyxkeCApXG5cbiAgICAgICAgbGV0IGRpc3QgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkaXN0JywgZGlzdClcblxuICAgICAgICBpZiAoIGRpc3QgPCBvcHRzLmJydXNoU2l6ZSkge1xuICAgICAgICAgIGxldCBhID0gdGhpcy54XG4gICAgICAgICAgdGhpcy54ID0gdGhpcy54ICsgKCggbW91c2UueCAtIG1vdXNlLnB4KSAqIE1hdGguYWJzKCBNYXRoLmNvcyggdHdvUGkgKiBkeCAvIGRpc3QpKSlcbiAgICAgICAgICB0aGlzLnkgPSB0aGlzLnkgKyAoKCBtb3VzZS55IC0gbW91c2UucHkpICogTWF0aC5hYnMoIE1hdGguY29zKCB0d29QaSAqIGR5IC8gZGlzdCkpKVxuICAgICAgICAgIGNvbnNvbGUubG9nKGRpc3QsIHRoaXMueCwgYSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH1cblxuICAvKi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qL1xuXG4gIGxldCBjb3VudCA9IDA7XG5cbiAgY2xhc3MgQ2xvdGgge1xuICAgIGNvbnN0cnVjdG9yIChjbG90aFgsIGNsb3RoWSwgZnJlZSkge1xuICAgICAgdGhpcy5wb2ludHMgPSBbXVxuXG4gICAgICBsZXQgc3RhcnRYID0gMDsgLy9yZW5kZXJlci52aWV3LndpZHRoIC8gMiAtIGNsb3RoWCAqIHNwYWNpbmdYIC8gMjtcbiAgICAgIGxldCBzdGFydFkgPSAwLy9yZW5kZXJlci52aWV3LmhlaWdodCAqIDAuMTtcblxuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPD0gY2xvdGhZOyB5KyspIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPD0gY2xvdGhYOyB4KyspIHtcbiAgICAgICAgICBsZXQgcG9pbnQgPSBuZXcgUG9pbnQoc3RhcnRYICsgeCAqIHNwYWNpbmdYLCBzdGFydFkgKyB5ICogc3BhY2luZ1kpXG4gICAgICAgICAgdGhpcy5wb2ludHMucHVzaChwb2ludClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJhbmRvbWl6ZShjYWxsYmFjayl7XG4gICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCxpKSA9PiB7XG4gICAgICAgIHBvaW50LnJhbmRvbWl6ZSggaSA9PT0gMCA/IGNhbGxiYWNrIDogbnVsbCApO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXNldCgpe1xuICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocG9pbnQpID0+IHtcbiAgICAgICAgcG9pbnQucmVzZXQoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB1cGRhdGUgKGRlbHRhKSB7XG4gICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCxpKSA9PiB7XG4gICAgICAgIHBvaW50LnVwZGF0ZShkZWx0YSAqIGRlbHRhKVxuXG4gICAgICAgIGlmICggbWVzaCApIHtcbiAgICAgICAgICBpICo9IDI7XG4gICAgICAgICAgbWVzaC52ZXJ0aWNlc1tpXSA9IHBvaW50Lng7XG4gICAgICAgICAgbWVzaC52ZXJ0aWNlc1tpKzFdID0gcG9pbnQueTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwb2ludGVyTW92ZShlKSB7XG4gICAgLy8gbGV0IHBvaW50ZXIgPSBlLnRvdWNoZXMgPyBlLnRvdWNoZXNbMF0gOiBlO1xuXG4gICAgbGV0IGxwID0gZS5kYXRhLmdldExvY2FsUG9zaXRpb24oc3RhZ2UpXG4gICAgbW91c2UucHggPSBtb3VzZS54IHx8IGxwLnhcbiAgICBtb3VzZS5weSA9IG1vdXNlLnkgfHwgbHAueVxuICAgIC8vIG1vdXNlLnggPSBwb2ludGVyLmNsaWVudFhcbiAgICAvLyBtb3VzZS55ID0gcG9pbnRlci5jbGllbnRZXG5cbiAgICAvLyBjb25zb2xlLmxvZyhtb3VzZSlcbiAgICAvLyBjb25zb2xlLmxvZyhlKVxuICAgIG1vdXNlLnggPSBscC54XG4gICAgbW91c2UueSA9IGxwLnlcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvaW50ZXJEb3duKGUpe1xuICAgIG1vdXNlLmRvd24gPSB0cnVlXG4gICAgbW91c2UuYnV0dG9uID0gMVxuICAgIHBvaW50ZXJNb3ZlKGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcG9pbnRlclVwKGUpe1xuICAgIG1vdXNlLmRvd24gPSBmYWxzZTtcbiAgICBtb3VzZS5weCA9IG51bGw7XG4gICAgbW91c2UucHkgPSBudWxsO1xuICB9XG5cbiAgc3RhZ2Uub24oJ21vdXNlZG93bicsIHBvaW50ZXJEb3duKVxuICBzdGFnZS5vbignbW91c2Vtb3ZlJywgcG9pbnRlck1vdmUpXG4gIHN0YWdlLm9uKCdtb3VzZXVwJywgcG9pbnRlclVwKVxuXG4gIC8vIHJlbmRlcmVyLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgcG9pbnRlckRvd24pO1xuICAvLyByZW5kZXJlci52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBwb2ludGVyRG93bik7XG4gIC8vIHJlbmRlcmVyLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHBvaW50ZXJEb3duKTtcblxuICAvLyBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScscG9pbnRlck1vdmUpO1xuICAvLyBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHBvaW50ZXJNb3ZlKTtcblxuICAvLyBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBwb2ludGVyVXApO1xuICAvLyBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgcG9pbnRlclVwKTtcbiAgLy8gZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgcG9pbnRlclVwKTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAvLyBjb25zdCByZW5kZXIgPSAoKSA9PiB7XG4gIC8vICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcilcbiAgLy8gICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpXG4gIC8vIH1cbiAgLy9cbiAgLy8gcmVuZGVyKClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZ29cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL2NhcmdvLmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9qcy9jYXJnby5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBmaW5kIH0gZnJvbSAnLi91dGlscy9lbGVtZW50cydcbi8vIGltcG9ydCBwaXhpIGZyb20gJy4vcGl4aWpzLTEnIC8vIGZpcnN0IGRlbW8gYXF1YSBtYWduaWZ5XG4vLyBpbXBvcnQgcGl4aSBmcm9tICcuL3Jlc2l6ZSdcbi8vIGltcG9ydCBsaXF1aWZ5IGZyb20gJy4vbGlxdWlmeS1vbmUnXG4vLyBpbXBvcnQgbGlxdWlmeSBmcm9tICcuL2xpcXVpZnktdHdvJ1xuLy8gaW1wb3J0IHNtb2tleSBmcm9tICcuL3Ntb2tlJ1xuLy8gaW1wb3J0IHdhdGVySW1hZ2UgZnJvbSAnLi93YXRlci1pbWFnZSdcbi8vIGltcG9ydCBzaW1wbGVEaXNwbGFjZW1lbnQgZnJvbSAnLi9zaW1wbGUtZGlzcGxhY2VtZW50J1xuLy8gaW1wb3J0IHNtZWFyIGZyb20gJy4vc21lYXInXG4vLyBpbXBvcnQgd29iYmxlIGZyb20gJy4vd29iYmxlJ1xuLy8gaW1wb3J0IHJlZ2wgZnJvbSAnLi9yZWdsJ1xuLy8gaW1wb3J0IHdhdGVyIGZyb20gJy4vdGhyZWUtd2F0ZXInXG4vLyBpbXBvcnQgd2F0ZXJGbHVpZCBmcm9tICcuLi8uLi9wdWJsaWMvd2F0ZXItZmx1aWQvbWFpbidcbi8vXG4vLyBpbXBvcnQgZHAyIGZyb20gJy4vZGlzcGxhY2UtMidcbmltcG9ydCBDYXJnbyBmcm9tICcuL2NhcmdvJ1xuaW1wb3J0IHN0eWxlcyBmcm9tICcuLi9zdHlsZXMvc3R5bGVzLnNjc3MnXG5cblxuY29uc3QgZG9jUmVhZHkgPSAoLyogZXZlbnQgKi8pID0+IHtcbiAgICBDYXJnbygpXG5cbiAgLy8gcGl4aSgpXG4gIC8vIGxpcXVpZnkoKVxuICAvLyBzbW9rZXkoKVxuICAvLyBzbW9rZXlQaXhpKClcbiAgLy8gd2F0ZXJJbWFnZSgpXG4gIC8vIHNpbXBsZURpc3BsYWNlbWVudCgpXG4gIC8vIHNtZWFyKClcbiAgLy8gd29iYmxlKClcbiAgLy8gcmVnbCgpXG4gIC8vIHdhdGVyKClcbiAgLy8gd2F0ZXJGbHVpZCgpXG4gIC8vIHJlZ2woKVxuXG4gIC8vIGRwMihmaW5kKCcuYy1pbWcnKVswXSwge1xuICAvLyAgIGltZzogJ2h0dHBzOi8vZmFybTYuc3RhdGljZmxpY2tyLmNvbS81MDc4LzE0MDMyOTM1NTU5XzhjMTNlOWIxODFfel9kLmpwZydcbiAgLy8gfSlcbiAgLy9cbiAgLy8gZHAyKGZpbmQoJy5jLWxvZ28nKVswXSwge1xuICAvLyAgIC8vIGltZzogJ3B1YmxpYy90dXJ0bGUtNTEyLmpwZydcbiAgLy8gICBpbWc6ICdwdWJsaWMvY2FyZ28tbG9nby5wbmcnXG4gIC8vIH0pXG59XG5cbmNvbnN0IGluaXQgPSAoKSA9PiB7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBkb2NSZWFkeSlcbn1cblxuXG5pbml0KClcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9qcy9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY29uc3QgZmluZCA9IChxdWVyeVNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQpID0+XG4gIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChxdWVyeVNlbGVjdG9yKSlcblxuY29uc3QgaXNFbGVtZW50ID0gKGVsKSA9PiB7XG4gIHRyeSB7XG4gICAgLy8gVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb21lKVxuICAgIC8vIHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICBpZiAoIShlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgcmV0dXJuIGZpbmQoZWwpWzBdLmxlbmd0aCA+IDBcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAvLyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuICAgIHJldHVybiAodHlwZW9mIGVsID09PSAnb2JqZWN0JykgJiZcbiAgICAgIChlbC5ub2RlVHlwZSA9PT0gMSkgJiYgKHR5cGVvZiBlbC5zdHlsZSA9PT0gJ29iamVjdCcpICYmXG4gICAgICAodHlwZW9mIGVsLm93bmVyRG9jdW1lbnQgPT09ICdvYmplY3QnKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBoYXNDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcbiAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkpIHJldHVybiBmYWxzZVxuXG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpXG4gIH1cblxuICByZXR1cm4gbmV3IFJlZ0V4cChgKF58ICkke2NsYXNzTmFtZX0oIHwkKWAsICdnaScpLnRlc3QoZWxlbWVudC5jbGFzc05hbWUpXG59XG5cblxuZXhwb3J0IGNvbnN0IGFkZENsYXNzID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT4ge1xuICBpZiAoIWlzRWxlbWVudChlbGVtZW50KSkgcmV0dXJuIGZhbHNlXG5cbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSlcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSArPSBgICR7Y2xhc3NOYW1lfWBcbiAgfVxuICByZXR1cm4gZWxlbWVudFxufVxuXG5cbmV4cG9ydCBjb25zdCByZW1vdmVDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcbiAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkpIHJldHVybiBmYWxzZVxuXG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoYChefFxcXFxiKSR7Y2xhc3NOYW1lLnNwbGl0KCcgJykuam9pbignfCcpfShcXFxcYnwkKWAsICdnaScpLCAnICcpXG4gIH1cbiAgcmV0dXJuIGVsZW1lbnRcbn1cblxuZXhwb3J0IGNvbnN0IHRvZ2dsZUNsYXNzID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT5cbiAgaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSA/IHJlbW92ZUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkgOiBhZGRDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpXG5cblxuZXhwb3J0IGNvbnN0IGV4aXN0cyA9IChzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50KSA9PiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpICE9PSBudWxsXG5cbmV4cG9ydCBjb25zdCBmaW5kUGFyZW50QnlDbGFzcyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcbiAgbGV0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBpZiAocGFyZW50ICE9PSBudWxsKSB7XG4gICAgaWYgKGhhc0NsYXNzKHBhcmVudCwgY2xhc3NOYW1lKSkge1xuICAgICAgcmV0dXJuIHBhcmVudFxuICAgIH1cblxuICAgIHBhcmVudCA9IGZpbmRQYXJlbnRCeUNsYXNzKHBhcmVudCwgY2xhc3NOYW1lKVxuICB9XG4gIHJldHVybiBwYXJlbnRcbn1cblxuZXhwb3J0IGNvbnN0IGZpbmRQb3MgPSAob2JqKSA9PiB7XG4gIGxldCBjdXJsZWZ0ID0gMFxuICBsZXQgY3VydG9wID0gMFxuXG4gIGlmIChvYmoub2Zmc2V0UGFyZW50KSB7XG4gICAgZG8ge1xuICAgICAgY3VybGVmdCArPSBvYmoub2Zmc2V0TGVmdFxuICAgICAgY3VydG9wICs9IG9iai5vZmZzZXRUb3BcbiAgICB9IHdoaWxlIChvYmogPSBvYmoub2Zmc2V0UGFyZW50KVxuXG4gICAgcmV0dXJuIFtjdXJ0b3AsIGN1cmxlZnRdXG4gIH1cbiAgcmV0dXJuIFtjdXJ0b3AsIGN1cmxlZnRdXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy91dGlscy9lbGVtZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvanMvdXRpbHMvZWxlbWVudHMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZXMvc3R5bGVzLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL3N0eWxlcy9zdHlsZXMuc2Nzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9