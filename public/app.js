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

/***/ "./src/js/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pixijs__ = __webpack_require__("./src/js/pixijs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_styles_scss__ = __webpack_require__("./src/styles/styles.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_styles_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__styles_styles_scss__);



const docReady = (/* event */) => {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__pixijs__["a" /* default */])()
}

const init = () => {
  document.addEventListener('DOMContentLoaded', docReady)
}


init()


/***/ }),

/***/ "./src/js/pixijs.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const pixi = () => {
  // aliases
  const PIXI = window.PIXI
  const Container = PIXI.Container
  const Sprite = PIXI.Sprite

  // globals
  let app
  let renderer

  const getMousePosition = () => app.renderer.plugins.interaction.mouse.global

  const init = () => {
    app = new PIXI.Application(window.innerWidth, window.innerHeight, {
      transparent: true,
    })
    renderer = app.renderer
    document.body.appendChild(app.view)

    const scene = new Container()

    const imgSrc = 'public/13.jpg'
    const bg = new Sprite.fromImage(imgSrc)
    // bg.anchor.set(0.5)
    // bg.x = renderer.width / 2
    // bg.y = renderer.height / 2

    const viewWidth = (renderer.width / renderer.resolution);
    const back = new PIXI.Container();
    back.width = viewWidth;
    back.scale.y = back.scale.x;


    back.scale.x = 1920 / viewWidth;
    back.scale.y = back.scale.x;
    back.addChild(bg)

    // replicate image with mask & displacement effect
    const effect = new Container()
    effect.x = 0
    effect.y = 0
    // effect.interactive = true

    // double background for effect
    const bgEffect = PIXI.Sprite.fromImage(imgSrc)
    bgEffect.anchor.set(0.5)
    bgEffect.x = renderer.width / 2
    bgEffect.y = renderer.height / 2
    effect.addChild(bgEffect)

    // displacement map
    const displacementSprite = new Sprite.fromImage('public/dmaps/2048x2048/clouds.jpg')
    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite)
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    effect.filters = [displacementFilter]
    displacementFilter.scale.x = 10
    displacementFilter.scale.y = 10
    displacementFilter.autoFit = true
    effect.addChild(displacementSprite)

    // mask
    const mask = new Sprite.fromImage('public/mask.jpg')
    mask.scale.x = 2
    mask.scale.y = 2
    mask.anchor.set(0.5)
    mask.x = renderer.width / 2
    mask.y = renderer.height / 2
    effect.addChild(mask)
    effect.mask = mask

    // scene.addChild(bg, effect)
    scene.addChild(back)
    app.stage.addChild(scene)

    const ticker = new PIXI.ticker.Ticker()

    let mousePosition
    ticker.autoStart = true

    ticker.add((delta) => {
      mousePosition = getMousePosition()

      mask.x = mousePosition.x
      mask.y = mousePosition.y

      displacementSprite.x += 3 * delta
      displacementSprite.y += 2
      renderer.render(app.stage)
    })

    renderer.render(app.stage)

    // window.onresize = (event) => {
    //   var w = window.innerWidth;
    //   var h = window.innerHeight;
    //
    //   scene.x += 10
    //
    //   console.log(renderer.view, scene)
    //   //this part resizes the canvas but keeps ratio the same
    //   renderer.view.style.width = w + "px";
    //   renderer.view.style.height = h + "px";
    //
    //   //this part adjusts the ratio:
    //   renderer.resize(w,h);
    //   renderer.render(app.stage)
    // }
  }

  init()
}

/* harmony default export */ __webpack_exports__["a"] = pixi;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2Q1MjE0NDZiMWE4NDFkMjFjYjQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9waXhpanMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy9zdHlsZXMuc2Nzcz85ZWNiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaEVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7Ozs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDaEhBLHlDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9wdWJsaWMvanMvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgN2Q1MjE0NDZiMWE4NDFkMjFjYjQiLCJpbXBvcnQgcGl4aSBmcm9tICcuL3BpeGlqcydcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi4vc3R5bGVzL3N0eWxlcy5zY3NzJ1xuXG5jb25zdCBkb2NSZWFkeSA9ICgvKiBldmVudCAqLykgPT4ge1xuICBwaXhpKClcbn1cblxuY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGRvY1JlYWR5KVxufVxuXG5cbmluaXQoKVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2pzL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IHBpeGkgPSAoKSA9PiB7XG4gIC8vIGFsaWFzZXNcbiAgY29uc3QgUElYSSA9IHdpbmRvdy5QSVhJXG4gIGNvbnN0IENvbnRhaW5lciA9IFBJWEkuQ29udGFpbmVyXG4gIGNvbnN0IFNwcml0ZSA9IFBJWEkuU3ByaXRlXG5cbiAgLy8gZ2xvYmFsc1xuICBsZXQgYXBwXG4gIGxldCByZW5kZXJlclxuXG4gIGNvbnN0IGdldE1vdXNlUG9zaXRpb24gPSAoKSA9PiBhcHAucmVuZGVyZXIucGx1Z2lucy5pbnRlcmFjdGlvbi5tb3VzZS5nbG9iYWxcblxuICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIGFwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHtcbiAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgIH0pXG4gICAgcmVuZGVyZXIgPSBhcHAucmVuZGVyZXJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGFwcC52aWV3KVxuXG4gICAgY29uc3Qgc2NlbmUgPSBuZXcgQ29udGFpbmVyKClcblxuICAgIGNvbnN0IGltZ1NyYyA9ICdwdWJsaWMvMTMuanBnJ1xuICAgIGNvbnN0IGJnID0gbmV3IFNwcml0ZS5mcm9tSW1hZ2UoaW1nU3JjKVxuICAgIC8vIGJnLmFuY2hvci5zZXQoMC41KVxuICAgIC8vIGJnLnggPSByZW5kZXJlci53aWR0aCAvIDJcbiAgICAvLyBiZy55ID0gcmVuZGVyZXIuaGVpZ2h0IC8gMlxuXG4gICAgY29uc3Qgdmlld1dpZHRoID0gKHJlbmRlcmVyLndpZHRoIC8gcmVuZGVyZXIucmVzb2x1dGlvbik7XG4gICAgY29uc3QgYmFjayA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICAgIGJhY2sud2lkdGggPSB2aWV3V2lkdGg7XG4gICAgYmFjay5zY2FsZS55ID0gYmFjay5zY2FsZS54O1xuXG5cbiAgICBiYWNrLnNjYWxlLnggPSAxOTIwIC8gdmlld1dpZHRoO1xuICAgIGJhY2suc2NhbGUueSA9IGJhY2suc2NhbGUueDtcbiAgICBiYWNrLmFkZENoaWxkKGJnKVxuXG4gICAgLy8gcmVwbGljYXRlIGltYWdlIHdpdGggbWFzayAmIGRpc3BsYWNlbWVudCBlZmZlY3RcbiAgICBjb25zdCBlZmZlY3QgPSBuZXcgQ29udGFpbmVyKClcbiAgICBlZmZlY3QueCA9IDBcbiAgICBlZmZlY3QueSA9IDBcbiAgICAvLyBlZmZlY3QuaW50ZXJhY3RpdmUgPSB0cnVlXG5cbiAgICAvLyBkb3VibGUgYmFja2dyb3VuZCBmb3IgZWZmZWN0XG4gICAgY29uc3QgYmdFZmZlY3QgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoaW1nU3JjKVxuICAgIGJnRWZmZWN0LmFuY2hvci5zZXQoMC41KVxuICAgIGJnRWZmZWN0LnggPSByZW5kZXJlci53aWR0aCAvIDJcbiAgICBiZ0VmZmVjdC55ID0gcmVuZGVyZXIuaGVpZ2h0IC8gMlxuICAgIGVmZmVjdC5hZGRDaGlsZChiZ0VmZmVjdClcblxuICAgIC8vIGRpc3BsYWNlbWVudCBtYXBcbiAgICBjb25zdCBkaXNwbGFjZW1lbnRTcHJpdGUgPSBuZXcgU3ByaXRlLmZyb21JbWFnZSgncHVibGljL2RtYXBzLzIwNDh4MjA0OC9jbG91ZHMuanBnJylcbiAgICBjb25zdCBkaXNwbGFjZW1lbnRGaWx0ZXIgPSBuZXcgUElYSS5maWx0ZXJzLkRpc3BsYWNlbWVudEZpbHRlcihkaXNwbGFjZW1lbnRTcHJpdGUpXG4gICAgZGlzcGxhY2VtZW50U3ByaXRlLnRleHR1cmUuYmFzZVRleHR1cmUud3JhcE1vZGUgPSBQSVhJLldSQVBfTU9ERVMuUkVQRUFUXG4gICAgZWZmZWN0LmZpbHRlcnMgPSBbZGlzcGxhY2VtZW50RmlsdGVyXVxuICAgIGRpc3BsYWNlbWVudEZpbHRlci5zY2FsZS54ID0gMTBcbiAgICBkaXNwbGFjZW1lbnRGaWx0ZXIuc2NhbGUueSA9IDEwXG4gICAgZGlzcGxhY2VtZW50RmlsdGVyLmF1dG9GaXQgPSB0cnVlXG4gICAgZWZmZWN0LmFkZENoaWxkKGRpc3BsYWNlbWVudFNwcml0ZSlcblxuICAgIC8vIG1hc2tcbiAgICBjb25zdCBtYXNrID0gbmV3IFNwcml0ZS5mcm9tSW1hZ2UoJ3B1YmxpYy9tYXNrLmpwZycpXG4gICAgbWFzay5zY2FsZS54ID0gMlxuICAgIG1hc2suc2NhbGUueSA9IDJcbiAgICBtYXNrLmFuY2hvci5zZXQoMC41KVxuICAgIG1hc2sueCA9IHJlbmRlcmVyLndpZHRoIC8gMlxuICAgIG1hc2sueSA9IHJlbmRlcmVyLmhlaWdodCAvIDJcbiAgICBlZmZlY3QuYWRkQ2hpbGQobWFzaylcbiAgICBlZmZlY3QubWFzayA9IG1hc2tcblxuICAgIC8vIHNjZW5lLmFkZENoaWxkKGJnLCBlZmZlY3QpXG4gICAgc2NlbmUuYWRkQ2hpbGQoYmFjaylcbiAgICBhcHAuc3RhZ2UuYWRkQ2hpbGQoc2NlbmUpXG5cbiAgICBjb25zdCB0aWNrZXIgPSBuZXcgUElYSS50aWNrZXIuVGlja2VyKClcblxuICAgIGxldCBtb3VzZVBvc2l0aW9uXG4gICAgdGlja2VyLmF1dG9TdGFydCA9IHRydWVcblxuICAgIHRpY2tlci5hZGQoKGRlbHRhKSA9PiB7XG4gICAgICBtb3VzZVBvc2l0aW9uID0gZ2V0TW91c2VQb3NpdGlvbigpXG5cbiAgICAgIG1hc2sueCA9IG1vdXNlUG9zaXRpb24ueFxuICAgICAgbWFzay55ID0gbW91c2VQb3NpdGlvbi55XG5cbiAgICAgIGRpc3BsYWNlbWVudFNwcml0ZS54ICs9IDMgKiBkZWx0YVxuICAgICAgZGlzcGxhY2VtZW50U3ByaXRlLnkgKz0gMlxuICAgICAgcmVuZGVyZXIucmVuZGVyKGFwcC5zdGFnZSlcbiAgICB9KVxuXG4gICAgcmVuZGVyZXIucmVuZGVyKGFwcC5zdGFnZSlcblxuICAgIC8vIHdpbmRvdy5vbnJlc2l6ZSA9IChldmVudCkgPT4ge1xuICAgIC8vICAgdmFyIHcgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAvLyAgIHZhciBoID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIC8vXG4gICAgLy8gICBzY2VuZS54ICs9IDEwXG4gICAgLy9cbiAgICAvLyAgIGNvbnNvbGUubG9nKHJlbmRlcmVyLnZpZXcsIHNjZW5lKVxuICAgIC8vICAgLy90aGlzIHBhcnQgcmVzaXplcyB0aGUgY2FudmFzIGJ1dCBrZWVwcyByYXRpbyB0aGUgc2FtZVxuICAgIC8vICAgcmVuZGVyZXIudmlldy5zdHlsZS53aWR0aCA9IHcgKyBcInB4XCI7XG4gICAgLy8gICByZW5kZXJlci52aWV3LnN0eWxlLmhlaWdodCA9IGggKyBcInB4XCI7XG4gICAgLy9cbiAgICAvLyAgIC8vdGhpcyBwYXJ0IGFkanVzdHMgdGhlIHJhdGlvOlxuICAgIC8vICAgcmVuZGVyZXIucmVzaXplKHcsaCk7XG4gICAgLy8gICByZW5kZXJlci5yZW5kZXIoYXBwLnN0YWdlKVxuICAgIC8vIH1cbiAgfVxuXG4gIGluaXQoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBwaXhpXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9waXhpanMuanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2pzL3BpeGlqcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlcy9zdHlsZXMuc2Nzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvc3R5bGVzL3N0eWxlcy5zY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=