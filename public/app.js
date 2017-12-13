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

/***/ "./public/water-fluid/water-fluid.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const waterFluid = () => {

    var gl;

   // shader programs
    var poolProg;
    var skyProg;
    var waterProg;


    // matrices
    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();
    var nmlMatrix = mat4.create();

    // animating
    var lastTime = 0;
    var xRot = 0;
    var yRot = 0;
    var zRot = 0;

    var time = 0;
    var mouseLeftDown = false;
    var mouseRightDown = false;
    var lastMouseX = null;
    var lastMouseY = null;

    var pool = {};    //a cube without top plane
    var sky = {};    //a cube
    var water = {};   //a plane

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Initializing WebGL failed.");
        }
    }


    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    function initShaders() {
     //-----------------------pool------------------------------
        poolProg = gl.createProgram();
        gl.attachShader(poolProg, getShader(gl, "pool-vs") );
        gl.attachShader( poolProg, getShader(gl, "pool-fs") );
        gl.linkProgram(poolProg);

        if (!gl.getProgramParameter(poolProg, gl.LINK_STATUS)) {
            alert("Could not initialize pool shader.");
        }
        gl.useProgram(poolProg);

        poolProg.vertexPositionAttribute = gl.getAttribLocation(poolProg, "aVertexPosition");
        poolProg.textureCoordAttribute = gl.getAttribLocation(poolProg, "aTextureCoord");
        poolProg.vertexNormalAttribute = gl.getAttribLocation(poolProg, "aVertexNormal");

        poolProg.pMatrixUniform = gl.getUniformLocation(poolProg, "uPMatrix");
        poolProg.mvMatrixUniform = gl.getUniformLocation(poolProg, "uMVMatrix");
        poolProg.samplerUniform = gl.getUniformLocation(poolProg, "uSamplerTile");


     //-----------------------sky------------------------------
        skyProg = gl.createProgram();
        gl.attachShader(skyProg, getShader(gl, "sky-vs") );
        gl.attachShader( skyProg, getShader(gl, "sky-fs") );
        gl.linkProgram(skyProg);

        if (!gl.getProgramParameter(skyProg, gl.LINK_STATUS)) {
            alert("Could not initialize sky shader.");
        }
        gl.useProgram(skyProg);

        skyProg.vertexPositionAttribute = gl.getAttribLocation(skyProg, "aVertexPosition");

        skyProg.pMatrixUniform = gl.getUniformLocation(skyProg, "uPMatrix");
        skyProg.mvMatrixUniform = gl.getUniformLocation(skyProg, "uMVMatrix");
        skyProg.samplerUniform = gl.getUniformLocation(skyProg, "uSamplerSky");

        //-----------------------water---------------------------------

        waterProg = gl.createProgram();
        gl.attachShader(waterProg, getShader(gl, "water-vs") );
        gl.attachShader(waterProg, getShader(gl, "water-fs") );
        gl.linkProgram(waterProg);

        if (!gl.getProgramParameter(waterProg, gl.LINK_STATUS)) {
            alert("Could not initialize water shader.");
        }
        gl.useProgram(waterProg);

        waterProg.vertexPositionAttribute = gl.getAttribLocation(waterProg, "aVertexPosition");
        waterProg.vertexNormalAttribute = gl.getAttribLocation(waterProg, "aVertexNormal");
        //waterProg.textureCoordAttribute = gl.getAttribLocation(waterProg, "aTextureCoord");

        waterProg.pMatrixUniform = gl.getUniformLocation(waterProg, "uPMatrix");
        waterProg.mvMatrixUniform = gl.getUniformLocation(waterProg, "uMVMatrix");
        waterProg.samplerUniform = gl.getUniformLocation(waterProg, "uSamplerSky");
        waterProg.eyePositionUniform = gl.getUniformLocation(waterProg,"uEyePosition");
         waterProg.NmlMatrixUniform = gl.getUniformLocation(waterProg, "uNmlMatrix");
    }


    function handleLoadedTexture(texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function initTexture(texture, url) {
        console.log("loading texture: " + url);
        texture.image = new Image();
        texture.image.onload = function () {
            handleLoadedTexture(texture)
        }

        texture.image.src = url;
    }

    function loadTextureSkyBox() {
        var ct = 0;
        var img = new Array(6);
        var urls = [
       // "skybox/posx.jpg", "skybox/negx.jpg",
        //   "skybox/posy.jpg", "skybox/negy.jpg",
        //   "skybox/posz.jpg", "skybox/negz.jpg"
       // "skybox/Sky2.jpg","skybox/Sky3.jpg",
      // "skybox/Sky4.jpg","skybox/Sky5.jpg",
      //  "skybox/Sky0.jpg","skybox/Sky1.jpg"
        "skybox/skyright.jpg","skybox/skyleft.jpg",
       "skybox/skyup.jpg","skybox/skydown.jpg",
        "skybox/skyback.jpg","skybox/skyfront.jpg"
        ];
        for (var i = 0; i < 6; i++) {
            img[i] = new Image();
            img[i].onload = function() {
                ct++;
                if (ct == 6) {   //upon finish loading all 6 images
                    sky.Texture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sky.Texture);
                    var targets = [
                       gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                       gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                       gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z ];
                    for (var j = 0; j < 6; j++) {
                      //  console.log("bingding skybox texture: " + targets[j]);
                      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                        gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    }
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

                }
            }
            console.log("loading skybox texture: " + urls[i]);
            img[i].src = urls[i];
        }
    }

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }


    function setMatrixUniforms(prog) {
        gl.uniformMatrix4fv(prog.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(prog.mvMatrixUniform, false, mvMatrix);
    }


    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    function initBuffers() {

        //-------pool-------------------------------
        pool.VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pool.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePool.vertices), gl.STATIC_DRAW);

        pool.TBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pool.TBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePool.texcoords), gl.STATIC_DRAW);

        pool.NBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pool.NBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePool.normals), gl.STATIC_DRAW);

        pool.IBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pool.IBO);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubePool.indices), gl.STATIC_DRAW);
        pool.IBO.numItems = 30; //36;

        //--------sky-----------------------------
        sky.VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sky.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeSky.vertices), gl.STATIC_DRAW);

        sky.TBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sky.TBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeSky.texcoords), gl.STATIC_DRAW);

        sky.IBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sky.IBO);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeSky.indices), gl.STATIC_DRAW);
        sky.IBO.numItems = 36;

        //----------water--------------------------
        water.VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, water.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeWater.vertices), gl.STATIC_DRAW);

        water.NBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, water.NBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeWater.normals), gl.STATIC_DRAW);

        water.TBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, water.TBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeWater.texcoords), gl.STATIC_DRAW);

        water.IBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, water.IBO);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(planeWater.indices), gl.STATIC_DRAW);
        water.IBO.numItems = planeWater.numIndices;
    }




    function handleMouseDown(event) {
        if( event.button == 2 ) {
            mouseLeftDown = false;
            mouseRightDown = true;
        }
        else {
            mouseLeftDown = true;
            mouseRightDown = false;
        }
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }

    function handleMouseUp(event) {
        mouseLeftDown = false;
        mouseRightDown = false;
    }

    function handleMouseMove(event) {
        if (!(mouseLeftDown || mouseRightDown)) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouseX;
        var deltaY = newY - lastMouseY;

        if( mouseLeftDown ){  // left mouse button  ---> interaction


        }
        else{   //right mouse button   ---> rotation
            xRot +=  deltaY;
            yRot += deltaX;
        }


        lastMouseX = newX;
        lastMouseY = newY;
    }

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, [0.0, 0.0, -5.0]);

        mat4.rotate(mvMatrix, degToRad(xRot), [1, 0, 0]);
        mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
        mat4.rotate(mvMatrix, degToRad(zRot), [0, 0, 1]);

        mat4.inverse(mvMatrix,nmlMatrix);
        mat4.transpose(nmlMatrix,nmlMatrix);

        drawPool();
        drawSkyBox();
        drawWater();
    }

function drawPool(){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(poolProg);

        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);   //define front face
        gl.cullFace(gl.FRONT);   //cull front facing faces

        gl.bindBuffer(gl.ARRAY_BUFFER, pool.VBO);
        gl.vertexAttribPointer(poolProg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(poolProg.vertexPositionAttribute);

         gl.bindBuffer(gl.ARRAY_BUFFER, pool.NBO);
        gl.vertexAttribPointer(poolProg.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(poolProg.vertexNormalAttribute);

        gl.bindBuffer(gl.ARRAY_BUFFER, pool.TBO);
        gl.vertexAttribPointer(poolProg.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(poolProg.textureCoordAttribute);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pool.Texture);
        gl.uniform1i(poolProg.samplerUniform, 0);

        setMatrixUniforms(poolProg);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pool.IBO);
        gl.drawElements(gl.TRIANGLES, pool.IBO.numItems, gl.UNSIGNED_SHORT, 0);

        gl.disable(gl.CULL_FACE);
        gl.disableVertexAttribArray(poolProg.vertexPositionAttribute);
        gl.disableVertexAttribArray(poolProg.textureCoordAttribute);
        gl.disableVertexAttribArray(poolProg.vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function drawSkyBox() {

    if (sky.Texture){
       // console.log("drawing sky box", sky.IBO.numItems);

     //gl.enable(gl.DEPTH_TEST);
        gl.useProgram(skyProg);


        gl.bindBuffer(gl.ARRAY_BUFFER, sky.VBO);
        gl.vertexAttribPointer(skyProg.vertexPositionAttribute , 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(skyProg.vertexPositionAttribute );

        setMatrixUniforms(skyProg);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sky.IBO);
        gl.drawElements(gl.TRIANGLES, sky.IBO.numItems, gl.UNSIGNED_SHORT, 0);

        gl.disableVertexAttribArray(skyProg.vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}

function drawWater(){
   // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.enable(gl.DEPTH_TEST);
     gl.useProgram(waterProg);

   //  console.log("drawing water");

      gl.bindBuffer(gl.ARRAY_BUFFER, water.VBO);
        gl.vertexAttribPointer(waterProg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(waterProg.vertexPositionAttribute);

        gl.bindBuffer(gl.ARRAY_BUFFER, water.NBO);
        gl.vertexAttribPointer(waterProg.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(waterProg.vertexNormalAttribute);

    /*    gl.bindBuffer(gl.ARRAY_BUFFER, water.TBO);
        gl.vertexAttribPointer(waterProg.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(waterProg.textureCoordAttribute);*/


        setMatrixUniforms(waterProg);

        gl.uniformMatrix4fv(waterProg.NmlMatrixUniform, false, nmlMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, water.IBO);
        gl.drawElements(gl.TRIANGLES, water.IBO.numItems, gl.UNSIGNED_SHORT, 0);

        gl.uniform3fv(waterProg.eyePositionUniform, new Float32Array([0.0, 0.0, 0.0]) );

    /*    gl.disableVertexAttribArray(waterProg.vertexPositionAttribute);
        //gl.disableVertexAttribArray(waterProg.textureCoordAttribute);
        gl.disableVertexAttribArray(waterProg.vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);*/

}



    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

          //  xRot += (90 * elapsed) / 1000.0;
           // yRot += (90 * elapsed) / 1000.0;
           //zRot += (90 * elapsed) / 1000.0;
        }
        lastTime = timeNow;
    }


    function tick() {
        requestAnimFrame(tick);
        drawScene();
        drawSkyBox()
        animate();
    }


    function webGLStart() {
        var canvas = document.getElementById("the-canvas");
        initGL(canvas);

        canvas.onmousedown = handleMouseDown;
        canvas.oncontextmenu = function(ev) {return false;};
        document.onmouseup = handleMouseUp;
        document.onmousemove = handleMouseMove;

        initShaders();
        initBuffers();

       // initTexture();
       pool.Texture = gl.createTexture();
       initTexture(pool.Texture, "tile/tile.png");
       //initTexture(pool.Texture, "tile/tile2.jpg");

       loadTextureSkyBox();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        tick();
    }


  webGLStart()
}
/* harmony default export */ __webpack_exports__["a"] = waterFluid;


/***/ }),

/***/ "./src/js/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__public_water_fluid_water_fluid__ = __webpack_require__("./public/water-fluid/water-fluid.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_styles_scss__ = __webpack_require__("./src/styles/styles.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_styles_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__styles_styles_scss__);
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
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__public_water_fluid_water_fluid__["a" /* default */])()

}

const init = () => {
  document.addEventListener('DOMContentLoaded', docReady)
}


init()


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZmVmNWQ1YWQwNzgxMzg5YjQ2ZDAiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3dhdGVyLWZsdWlkL3dhdGVyLWZsdWlkLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3N0eWxlcy5zY3NzPzllY2IiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUMvREE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQixpQkFBaUI7QUFDakIsbUJBQW1COztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwrQkFBK0I7O0FBRS9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsNEJBQTRCOzs7QUFHNUI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCO0FBQzdCLDhCQUE4Qjs7QUFFOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9FQUFvRTs7O0FBR3BFOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7O0FBRXJEOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZDQUE2QztBQUM3QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbmZBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7Ozs7Ozs7O0FDbkNBLHlDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9wdWJsaWMvanMvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZmVmNWQ1YWQwNzgxMzg5YjQ2ZDAiLCJcbmNvbnN0IHdhdGVyRmx1aWQgPSAoKSA9PiB7XG5cbiAgICB2YXIgZ2w7XG5cbiAgIC8vIHNoYWRlciBwcm9ncmFtc1xuICAgIHZhciBwb29sUHJvZztcbiAgICB2YXIgc2t5UHJvZztcbiAgICB2YXIgd2F0ZXJQcm9nO1xuXG5cbiAgICAvLyBtYXRyaWNlc1xuICAgIHZhciBtdk1hdHJpeCA9IG1hdDQuY3JlYXRlKCk7XG4gICAgdmFyIG12TWF0cml4U3RhY2sgPSBbXTtcbiAgICB2YXIgcE1hdHJpeCA9IG1hdDQuY3JlYXRlKCk7XG4gICAgdmFyIG5tbE1hdHJpeCA9IG1hdDQuY3JlYXRlKCk7XG5cbiAgICAvLyBhbmltYXRpbmdcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB4Um90ID0gMDtcbiAgICB2YXIgeVJvdCA9IDA7XG4gICAgdmFyIHpSb3QgPSAwO1xuXG4gICAgdmFyIHRpbWUgPSAwO1xuICAgIHZhciBtb3VzZUxlZnREb3duID0gZmFsc2U7XG4gICAgdmFyIG1vdXNlUmlnaHREb3duID0gZmFsc2U7XG4gICAgdmFyIGxhc3RNb3VzZVggPSBudWxsO1xuICAgIHZhciBsYXN0TW91c2VZID0gbnVsbDtcblxuICAgIHZhciBwb29sID0ge307ICAgIC8vYSBjdWJlIHdpdGhvdXQgdG9wIHBsYW5lXG4gICAgdmFyIHNreSA9IHt9OyAgICAvL2EgY3ViZVxuICAgIHZhciB3YXRlciA9IHt9OyAgIC8vYSBwbGFuZVxuXG4gICAgZnVuY3Rpb24gaW5pdEdMKGNhbnZhcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dChcImV4cGVyaW1lbnRhbC13ZWJnbFwiKTtcbiAgICAgICAgICAgIGdsLnZpZXdwb3J0V2lkdGggPSBjYW52YXMud2lkdGg7XG4gICAgICAgICAgICBnbC52aWV3cG9ydEhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWdsKSB7XG4gICAgICAgICAgICBhbGVydChcIkluaXRpYWxpemluZyBXZWJHTCBmYWlsZWQuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBnZXRTaGFkZXIoZ2wsIGlkKSB7XG4gICAgICAgIHZhciBzaGFkZXJTY3JpcHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGlmICghc2hhZGVyU2NyaXB0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdHIgPSBcIlwiO1xuICAgICAgICB2YXIgayA9IHNoYWRlclNjcmlwdC5maXJzdENoaWxkO1xuICAgICAgICB3aGlsZSAoaykge1xuICAgICAgICAgICAgaWYgKGsubm9kZVR5cGUgPT0gMykge1xuICAgICAgICAgICAgICAgIHN0ciArPSBrLnRleHRDb250ZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgayA9IGsubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2hhZGVyO1xuICAgICAgICBpZiAoc2hhZGVyU2NyaXB0LnR5cGUgPT0gXCJ4LXNoYWRlci94LWZyYWdtZW50XCIpIHtcbiAgICAgICAgICAgIHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xuICAgICAgICB9IGVsc2UgaWYgKHNoYWRlclNjcmlwdC50eXBlID09IFwieC1zaGFkZXIveC12ZXJ0ZXhcIikge1xuICAgICAgICAgICAgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzdHIpO1xuICAgICAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG5cbiAgICAgICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICAgICAgICAgIGFsZXJ0KGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaGFkZXI7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBpbml0U2hhZGVycygpIHtcbiAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXBvb2wtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgcG9vbFByb2cgPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwb29sUHJvZywgZ2V0U2hhZGVyKGdsLCBcInBvb2wtdnNcIikgKTtcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKCBwb29sUHJvZywgZ2V0U2hhZGVyKGdsLCBcInBvb2wtZnNcIikgKTtcbiAgICAgICAgZ2wubGlua1Byb2dyYW0ocG9vbFByb2cpO1xuXG4gICAgICAgIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwb29sUHJvZywgZ2wuTElOS19TVEFUVVMpKSB7XG4gICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCBpbml0aWFsaXplIHBvb2wgc2hhZGVyLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBnbC51c2VQcm9ncmFtKHBvb2xQcm9nKTtcblxuICAgICAgICBwb29sUHJvZy52ZXJ0ZXhQb3NpdGlvbkF0dHJpYnV0ZSA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHBvb2xQcm9nLCBcImFWZXJ0ZXhQb3NpdGlvblwiKTtcbiAgICAgICAgcG9vbFByb2cudGV4dHVyZUNvb3JkQXR0cmlidXRlID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocG9vbFByb2csIFwiYVRleHR1cmVDb29yZFwiKTtcbiAgICAgICAgcG9vbFByb2cudmVydGV4Tm9ybWFsQXR0cmlidXRlID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocG9vbFByb2csIFwiYVZlcnRleE5vcm1hbFwiKTtcblxuICAgICAgICBwb29sUHJvZy5wTWF0cml4VW5pZm9ybSA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwb29sUHJvZywgXCJ1UE1hdHJpeFwiKTtcbiAgICAgICAgcG9vbFByb2cubXZNYXRyaXhVbmlmb3JtID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHBvb2xQcm9nLCBcInVNVk1hdHJpeFwiKTtcbiAgICAgICAgcG9vbFByb2cuc2FtcGxlclVuaWZvcm0gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocG9vbFByb2csIFwidVNhbXBsZXJUaWxlXCIpO1xuXG5cbiAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXNreS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBza3lQcm9nID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIoc2t5UHJvZywgZ2V0U2hhZGVyKGdsLCBcInNreS12c1wiKSApO1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIoIHNreVByb2csIGdldFNoYWRlcihnbCwgXCJza3ktZnNcIikgKTtcbiAgICAgICAgZ2wubGlua1Byb2dyYW0oc2t5UHJvZyk7XG5cbiAgICAgICAgaWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNreVByb2csIGdsLkxJTktfU1RBVFVTKSkge1xuICAgICAgICAgICAgYWxlcnQoXCJDb3VsZCBub3QgaW5pdGlhbGl6ZSBza3kgc2hhZGVyLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBnbC51c2VQcm9ncmFtKHNreVByb2cpO1xuXG4gICAgICAgIHNreVByb2cudmVydGV4UG9zaXRpb25BdHRyaWJ1dGUgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihza3lQcm9nLCBcImFWZXJ0ZXhQb3NpdGlvblwiKTtcblxuICAgICAgICBza3lQcm9nLnBNYXRyaXhVbmlmb3JtID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNreVByb2csIFwidVBNYXRyaXhcIik7XG4gICAgICAgIHNreVByb2cubXZNYXRyaXhVbmlmb3JtID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNreVByb2csIFwidU1WTWF0cml4XCIpO1xuICAgICAgICBza3lQcm9nLnNhbXBsZXJVbmlmb3JtID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNreVByb2csIFwidVNhbXBsZXJTa3lcIik7XG5cbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXdhdGVyLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgd2F0ZXJQcm9nID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIod2F0ZXJQcm9nLCBnZXRTaGFkZXIoZ2wsIFwid2F0ZXItdnNcIikgKTtcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHdhdGVyUHJvZywgZ2V0U2hhZGVyKGdsLCBcIndhdGVyLWZzXCIpICk7XG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHdhdGVyUHJvZyk7XG5cbiAgICAgICAgaWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHdhdGVyUHJvZywgZ2wuTElOS19TVEFUVVMpKSB7XG4gICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCBpbml0aWFsaXplIHdhdGVyIHNoYWRlci5cIik7XG4gICAgICAgIH1cbiAgICAgICAgZ2wudXNlUHJvZ3JhbSh3YXRlclByb2cpO1xuXG4gICAgICAgIHdhdGVyUHJvZy52ZXJ0ZXhQb3NpdGlvbkF0dHJpYnV0ZSA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHdhdGVyUHJvZywgXCJhVmVydGV4UG9zaXRpb25cIik7XG4gICAgICAgIHdhdGVyUHJvZy52ZXJ0ZXhOb3JtYWxBdHRyaWJ1dGUgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbih3YXRlclByb2csIFwiYVZlcnRleE5vcm1hbFwiKTtcbiAgICAgICAgLy93YXRlclByb2cudGV4dHVyZUNvb3JkQXR0cmlidXRlID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24od2F0ZXJQcm9nLCBcImFUZXh0dXJlQ29vcmRcIik7XG5cbiAgICAgICAgd2F0ZXJQcm9nLnBNYXRyaXhVbmlmb3JtID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHdhdGVyUHJvZywgXCJ1UE1hdHJpeFwiKTtcbiAgICAgICAgd2F0ZXJQcm9nLm12TWF0cml4VW5pZm9ybSA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbih3YXRlclByb2csIFwidU1WTWF0cml4XCIpO1xuICAgICAgICB3YXRlclByb2cuc2FtcGxlclVuaWZvcm0gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24od2F0ZXJQcm9nLCBcInVTYW1wbGVyU2t5XCIpO1xuICAgICAgICB3YXRlclByb2cuZXllUG9zaXRpb25Vbmlmb3JtID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHdhdGVyUHJvZyxcInVFeWVQb3NpdGlvblwiKTtcbiAgICAgICAgIHdhdGVyUHJvZy5ObWxNYXRyaXhVbmlmb3JtID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHdhdGVyUHJvZywgXCJ1Tm1sTWF0cml4XCIpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gaGFuZGxlTG9hZGVkVGV4dHVyZSh0ZXh0dXJlKSB7XG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xuICAgICAgICBnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0cnVlKTtcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCB0ZXh0dXJlLmltYWdlKTtcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLk5FQVJFU1QpO1xuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTkVBUkVTVCk7XG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRUZXh0dXJlKHRleHR1cmUsIHVybCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgdGV4dHVyZTogXCIgKyB1cmwpO1xuICAgICAgICB0ZXh0dXJlLmltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHRleHR1cmUuaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaGFuZGxlTG9hZGVkVGV4dHVyZSh0ZXh0dXJlKVxuICAgICAgICB9XG5cbiAgICAgICAgdGV4dHVyZS5pbWFnZS5zcmMgPSB1cmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZFRleHR1cmVTa3lCb3goKSB7XG4gICAgICAgIHZhciBjdCA9IDA7XG4gICAgICAgIHZhciBpbWcgPSBuZXcgQXJyYXkoNik7XG4gICAgICAgIHZhciB1cmxzID0gW1xuICAgICAgIC8vIFwic2t5Ym94L3Bvc3guanBnXCIsIFwic2t5Ym94L25lZ3guanBnXCIsXG4gICAgICAgIC8vICAgXCJza3lib3gvcG9zeS5qcGdcIiwgXCJza3lib3gvbmVneS5qcGdcIixcbiAgICAgICAgLy8gICBcInNreWJveC9wb3N6LmpwZ1wiLCBcInNreWJveC9uZWd6LmpwZ1wiXG4gICAgICAgLy8gXCJza3lib3gvU2t5Mi5qcGdcIixcInNreWJveC9Ta3kzLmpwZ1wiLFxuICAgICAgLy8gXCJza3lib3gvU2t5NC5qcGdcIixcInNreWJveC9Ta3k1LmpwZ1wiLFxuICAgICAgLy8gIFwic2t5Ym94L1NreTAuanBnXCIsXCJza3lib3gvU2t5MS5qcGdcIlxuICAgICAgICBcInNreWJveC9za3lyaWdodC5qcGdcIixcInNreWJveC9za3lsZWZ0LmpwZ1wiLFxuICAgICAgIFwic2t5Ym94L3NreXVwLmpwZ1wiLFwic2t5Ym94L3NreWRvd24uanBnXCIsXG4gICAgICAgIFwic2t5Ym94L3NreWJhY2suanBnXCIsXCJza3lib3gvc2t5ZnJvbnQuanBnXCJcbiAgICAgICAgXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgICAgIGltZ1tpXSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgaW1nW2ldLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGN0Kys7XG4gICAgICAgICAgICAgICAgaWYgKGN0ID09IDYpIHsgICAvL3Vwb24gZmluaXNoIGxvYWRpbmcgYWxsIDYgaW1hZ2VzXG4gICAgICAgICAgICAgICAgICAgIHNreS5UZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBza3kuVGV4dHVyZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXRzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICBnbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1gsIGdsLlRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWCxcbiAgICAgICAgICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZLCBnbC5URVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1ksXG4gICAgICAgICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWiwgZ2wuVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aIF07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgNjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiYmluZ2Rpbmcgc2t5Ym94IHRleHR1cmU6IFwiICsgdGFyZ2V0c1tqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRCh0YXJnZXRzW2pdLCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBpbWdbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV9DVUJFX01BUCk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgc2t5Ym94IHRleHR1cmU6IFwiICsgdXJsc1tpXSk7XG4gICAgICAgICAgICBpbWdbaV0uc3JjID0gdXJsc1tpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG12UHVzaE1hdHJpeCgpIHtcbiAgICAgICAgdmFyIGNvcHkgPSBtYXQ0LmNyZWF0ZSgpO1xuICAgICAgICBtYXQ0LnNldChtdk1hdHJpeCwgY29weSk7XG4gICAgICAgIG12TWF0cml4U3RhY2sucHVzaChjb3B5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtdlBvcE1hdHJpeCgpIHtcbiAgICAgICAgaWYgKG12TWF0cml4U3RhY2subGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRocm93IFwiSW52YWxpZCBwb3BNYXRyaXghXCI7XG4gICAgICAgIH1cbiAgICAgICAgbXZNYXRyaXggPSBtdk1hdHJpeFN0YWNrLnBvcCgpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gc2V0TWF0cml4VW5pZm9ybXMocHJvZykge1xuICAgICAgICBnbC51bmlmb3JtTWF0cml4NGZ2KHByb2cucE1hdHJpeFVuaWZvcm0sIGZhbHNlLCBwTWF0cml4KTtcbiAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDRmdihwcm9nLm12TWF0cml4VW5pZm9ybSwgZmFsc2UsIG12TWF0cml4KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGRlZ1RvUmFkKGRlZ3JlZXMpIHtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRCdWZmZXJzKCkge1xuXG4gICAgICAgIC8vLS0tLS0tLXBvb2wtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIHBvb2wuVkJPID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb29sLlZCTyk7XG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGN1YmVQb29sLnZlcnRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgICAgIHBvb2wuVEJPID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb29sLlRCTyk7XG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGN1YmVQb29sLnRleGNvb3JkcyksIGdsLlNUQVRJQ19EUkFXKTtcblxuICAgICAgICBwb29sLk5CTyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9vbC5OQk8pO1xuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShjdWJlUG9vbC5ub3JtYWxzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgICAgIHBvb2wuSUJPID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHBvb2wuSUJPKTtcblxuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgVWludDE2QXJyYXkoY3ViZVBvb2wuaW5kaWNlcyksIGdsLlNUQVRJQ19EUkFXKTtcbiAgICAgICAgcG9vbC5JQk8ubnVtSXRlbXMgPSAzMDsgLy8zNjtcblxuICAgICAgICAvLy0tLS0tLS0tc2t5LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgc2t5LlZCTyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgc2t5LlZCTyk7XG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGN1YmVTa3kudmVydGljZXMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAgICAgc2t5LlRCTyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgc2t5LlRCTyk7XG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGN1YmVTa3kudGV4Y29vcmRzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgICAgIHNreS5JQk8gPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgc2t5LklCTyk7XG5cbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IFVpbnQxNkFycmF5KGN1YmVTa3kuaW5kaWNlcyksIGdsLlNUQVRJQ19EUkFXKTtcbiAgICAgICAgc2t5LklCTy5udW1JdGVtcyA9IDM2O1xuXG4gICAgICAgIC8vLS0tLS0tLS0tLXdhdGVyLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgd2F0ZXIuVkJPID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB3YXRlci5WQk8pO1xuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShwbGFuZVdhdGVyLnZlcnRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgICAgIHdhdGVyLk5CTyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgd2F0ZXIuTkJPKTtcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkocGxhbmVXYXRlci5ub3JtYWxzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgICAgIHdhdGVyLlRCTyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgd2F0ZXIuVEJPKTtcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkocGxhbmVXYXRlci50ZXhjb29yZHMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAgICAgd2F0ZXIuSUJPID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHdhdGVyLklCTyk7XG5cbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IFVpbnQxNkFycmF5KHBsYW5lV2F0ZXIuaW5kaWNlcyksIGdsLlNUQVRJQ19EUkFXKTtcbiAgICAgICAgd2F0ZXIuSUJPLm51bUl0ZW1zID0gcGxhbmVXYXRlci5udW1JbmRpY2VzO1xuICAgIH1cblxuXG5cblxuICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlRG93bihldmVudCkge1xuICAgICAgICBpZiggZXZlbnQuYnV0dG9uID09IDIgKSB7XG4gICAgICAgICAgICBtb3VzZUxlZnREb3duID0gZmFsc2U7XG4gICAgICAgICAgICBtb3VzZVJpZ2h0RG93biA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtb3VzZUxlZnREb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIG1vdXNlUmlnaHREb3duID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdE1vdXNlWCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgIGxhc3RNb3VzZVkgPSBldmVudC5jbGllbnRZO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlVXAoZXZlbnQpIHtcbiAgICAgICAgbW91c2VMZWZ0RG93biA9IGZhbHNlO1xuICAgICAgICBtb3VzZVJpZ2h0RG93biA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlTW92ZShldmVudCkge1xuICAgICAgICBpZiAoIShtb3VzZUxlZnREb3duIHx8IG1vdXNlUmlnaHREb3duKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZXdYID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgdmFyIG5ld1kgPSBldmVudC5jbGllbnRZO1xuXG4gICAgICAgIHZhciBkZWx0YVggPSBuZXdYIC0gbGFzdE1vdXNlWDtcbiAgICAgICAgdmFyIGRlbHRhWSA9IG5ld1kgLSBsYXN0TW91c2VZO1xuXG4gICAgICAgIGlmKCBtb3VzZUxlZnREb3duICl7ICAvLyBsZWZ0IG1vdXNlIGJ1dHRvbiAgLS0tPiBpbnRlcmFjdGlvblxuXG5cbiAgICAgICAgfVxuICAgICAgICBlbHNleyAgIC8vcmlnaHQgbW91c2UgYnV0dG9uICAgLS0tPiByb3RhdGlvblxuICAgICAgICAgICAgeFJvdCArPSAgZGVsdGFZO1xuICAgICAgICAgICAgeVJvdCArPSBkZWx0YVg7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGxhc3RNb3VzZVggPSBuZXdYO1xuICAgICAgICBsYXN0TW91c2VZID0gbmV3WTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkcmF3U2NlbmUoKSB7XG4gICAgICAgIGdsLnZpZXdwb3J0KDAsIDAsIGdsLnZpZXdwb3J0V2lkdGgsIGdsLnZpZXdwb3J0SGVpZ2h0KTtcblxuICAgICAgICBtYXQ0LnBlcnNwZWN0aXZlKDQ1LCBnbC52aWV3cG9ydFdpZHRoIC8gZ2wudmlld3BvcnRIZWlnaHQsIDAuMSwgMTAwLjAsIHBNYXRyaXgpO1xuICAgICAgICBtYXQ0LmlkZW50aXR5KG12TWF0cml4KTtcbiAgICAgICAgbWF0NC50cmFuc2xhdGUobXZNYXRyaXgsIFswLjAsIDAuMCwgLTUuMF0pO1xuXG4gICAgICAgIG1hdDQucm90YXRlKG12TWF0cml4LCBkZWdUb1JhZCh4Um90KSwgWzEsIDAsIDBdKTtcbiAgICAgICAgbWF0NC5yb3RhdGUobXZNYXRyaXgsIGRlZ1RvUmFkKHlSb3QpLCBbMCwgMSwgMF0pO1xuICAgICAgICBtYXQ0LnJvdGF0ZShtdk1hdHJpeCwgZGVnVG9SYWQoelJvdCksIFswLCAwLCAxXSk7XG5cbiAgICAgICAgbWF0NC5pbnZlcnNlKG12TWF0cml4LG5tbE1hdHJpeCk7XG4gICAgICAgIG1hdDQudHJhbnNwb3NlKG5tbE1hdHJpeCxubWxNYXRyaXgpO1xuXG4gICAgICAgIGRyYXdQb29sKCk7XG4gICAgICAgIGRyYXdTa3lCb3goKTtcbiAgICAgICAgZHJhd1dhdGVyKCk7XG4gICAgfVxuXG5mdW5jdGlvbiBkcmF3UG9vbCgpe1xuICAgICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG4gICAgICAgIGdsLnVzZVByb2dyYW0ocG9vbFByb2cpO1xuXG4gICAgICAgIGdsLmVuYWJsZShnbC5DVUxMX0ZBQ0UpO1xuICAgICAgICBnbC5mcm9udEZhY2UoZ2wuQ0NXKTsgICAvL2RlZmluZSBmcm9udCBmYWNlXG4gICAgICAgIGdsLmN1bGxGYWNlKGdsLkZST05UKTsgICAvL2N1bGwgZnJvbnQgZmFjaW5nIGZhY2VzXG5cbiAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvb2wuVkJPKTtcbiAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihwb29sUHJvZy52ZXJ0ZXhQb3NpdGlvbkF0dHJpYnV0ZSwgMywgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9vbFByb2cudmVydGV4UG9zaXRpb25BdHRyaWJ1dGUpO1xuXG4gICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9vbC5OQk8pO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvb2xQcm9nLnZlcnRleE5vcm1hbEF0dHJpYnV0ZSwgMywgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9vbFByb2cudmVydGV4Tm9ybWFsQXR0cmlidXRlKTtcblxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9vbC5UQk8pO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvb2xQcm9nLnRleHR1cmVDb29yZEF0dHJpYnV0ZSwgMiwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9vbFByb2cudGV4dHVyZUNvb3JkQXR0cmlidXRlKTtcblxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgcG9vbC5UZXh0dXJlKTtcbiAgICAgICAgZ2wudW5pZm9ybTFpKHBvb2xQcm9nLnNhbXBsZXJVbmlmb3JtLCAwKTtcblxuICAgICAgICBzZXRNYXRyaXhVbmlmb3Jtcyhwb29sUHJvZyk7XG5cbiAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgcG9vbC5JQk8pO1xuICAgICAgICBnbC5kcmF3RWxlbWVudHMoZ2wuVFJJQU5HTEVTLCBwb29sLklCTy5udW1JdGVtcywgZ2wuVU5TSUdORURfU0hPUlQsIDApO1xuXG4gICAgICAgIGdsLmRpc2FibGUoZ2wuQ1VMTF9GQUNFKTtcbiAgICAgICAgZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvb2xQcm9nLnZlcnRleFBvc2l0aW9uQXR0cmlidXRlKTtcbiAgICAgICAgZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvb2xQcm9nLnRleHR1cmVDb29yZEF0dHJpYnV0ZSk7XG4gICAgICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShwb29sUHJvZy52ZXJ0ZXhOb3JtYWxBdHRyaWJ1dGUpO1xuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xufVxuXG5mdW5jdGlvbiBkcmF3U2t5Qm94KCkge1xuXG4gICAgaWYgKHNreS5UZXh0dXJlKXtcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcImRyYXdpbmcgc2t5IGJveFwiLCBza3kuSUJPLm51bUl0ZW1zKTtcblxuICAgICAvL2dsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcbiAgICAgICAgZ2wudXNlUHJvZ3JhbShza3lQcm9nKTtcblxuXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBza3kuVkJPKTtcbiAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihza3lQcm9nLnZlcnRleFBvc2l0aW9uQXR0cmlidXRlICwgMywgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoc2t5UHJvZy52ZXJ0ZXhQb3NpdGlvbkF0dHJpYnV0ZSApO1xuXG4gICAgICAgIHNldE1hdHJpeFVuaWZvcm1zKHNreVByb2cpO1xuXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHNreS5JQk8pO1xuICAgICAgICBnbC5kcmF3RWxlbWVudHMoZ2wuVFJJQU5HTEVTLCBza3kuSUJPLm51bUl0ZW1zLCBnbC5VTlNJR05FRF9TSE9SVCwgMCk7XG5cbiAgICAgICAgZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KHNreVByb2cudmVydGV4UG9zaXRpb25BdHRyaWJ1dGUpO1xuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhd1dhdGVyKCl7XG4gICAvLyBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG4gICAgLy8gZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgICBnbC51c2VQcm9ncmFtKHdhdGVyUHJvZyk7XG5cbiAgIC8vICBjb25zb2xlLmxvZyhcImRyYXdpbmcgd2F0ZXJcIik7XG5cbiAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB3YXRlci5WQk8pO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHdhdGVyUHJvZy52ZXJ0ZXhQb3NpdGlvbkF0dHJpYnV0ZSwgMywgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkod2F0ZXJQcm9nLnZlcnRleFBvc2l0aW9uQXR0cmlidXRlKTtcblxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgd2F0ZXIuTkJPKTtcbiAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih3YXRlclByb2cudmVydGV4Tm9ybWFsQXR0cmlidXRlLCAzLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh3YXRlclByb2cudmVydGV4Tm9ybWFsQXR0cmlidXRlKTtcblxuICAgIC8qICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB3YXRlci5UQk8pO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHdhdGVyUHJvZy50ZXh0dXJlQ29vcmRBdHRyaWJ1dGUsIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHdhdGVyUHJvZy50ZXh0dXJlQ29vcmRBdHRyaWJ1dGUpOyovXG5cblxuICAgICAgICBzZXRNYXRyaXhVbmlmb3Jtcyh3YXRlclByb2cpO1xuXG4gICAgICAgIGdsLnVuaWZvcm1NYXRyaXg0ZnYod2F0ZXJQcm9nLk5tbE1hdHJpeFVuaWZvcm0sIGZhbHNlLCBubWxNYXRyaXgpO1xuXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHdhdGVyLklCTyk7XG4gICAgICAgIGdsLmRyYXdFbGVtZW50cyhnbC5UUklBTkdMRVMsIHdhdGVyLklCTy5udW1JdGVtcywgZ2wuVU5TSUdORURfU0hPUlQsIDApO1xuXG4gICAgICAgIGdsLnVuaWZvcm0zZnYod2F0ZXJQcm9nLmV5ZVBvc2l0aW9uVW5pZm9ybSwgbmV3IEZsb2F0MzJBcnJheShbMC4wLCAwLjAsIDAuMF0pICk7XG5cbiAgICAvKiAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkod2F0ZXJQcm9nLnZlcnRleFBvc2l0aW9uQXR0cmlidXRlKTtcbiAgICAgICAgLy9nbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkod2F0ZXJQcm9nLnRleHR1cmVDb29yZEF0dHJpYnV0ZSk7XG4gICAgICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSh3YXRlclByb2cudmVydGV4Tm9ybWFsQXR0cmlidXRlKTtcbiAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTsqL1xuXG59XG5cblxuXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICAgICAgdmFyIHRpbWVOb3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgaWYgKGxhc3RUaW1lICE9IDApIHtcbiAgICAgICAgICAgIHZhciBlbGFwc2VkID0gdGltZU5vdyAtIGxhc3RUaW1lO1xuXG4gICAgICAgICAgLy8gIHhSb3QgKz0gKDkwICogZWxhcHNlZCkgLyAxMDAwLjA7XG4gICAgICAgICAgIC8vIHlSb3QgKz0gKDkwICogZWxhcHNlZCkgLyAxMDAwLjA7XG4gICAgICAgICAgIC8velJvdCArPSAoOTAgKiBlbGFwc2VkKSAvIDEwMDAuMDtcbiAgICAgICAgfVxuICAgICAgICBsYXN0VGltZSA9IHRpbWVOb3c7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiB0aWNrKCkge1xuICAgICAgICByZXF1ZXN0QW5pbUZyYW1lKHRpY2spO1xuICAgICAgICBkcmF3U2NlbmUoKTtcbiAgICAgICAgZHJhd1NreUJveCgpXG4gICAgICAgIGFuaW1hdGUoKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHdlYkdMU3RhcnQoKSB7XG4gICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRoZS1jYW52YXNcIik7XG4gICAgICAgIGluaXRHTChjYW52YXMpO1xuXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IGhhbmRsZU1vdXNlRG93bjtcbiAgICAgICAgY2FudmFzLm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbihldikge3JldHVybiBmYWxzZTt9O1xuICAgICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBoYW5kbGVNb3VzZVVwO1xuICAgICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IGhhbmRsZU1vdXNlTW92ZTtcblxuICAgICAgICBpbml0U2hhZGVycygpO1xuICAgICAgICBpbml0QnVmZmVycygpO1xuXG4gICAgICAgLy8gaW5pdFRleHR1cmUoKTtcbiAgICAgICBwb29sLlRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgICAgaW5pdFRleHR1cmUocG9vbC5UZXh0dXJlLCBcInRpbGUvdGlsZS5wbmdcIik7XG4gICAgICAgLy9pbml0VGV4dHVyZShwb29sLlRleHR1cmUsIFwidGlsZS90aWxlMi5qcGdcIik7XG5cbiAgICAgICBsb2FkVGV4dHVyZVNreUJveCgpO1xuXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTtcbiAgICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuXG4gICAgICAgIHRpY2soKTtcbiAgICB9XG5cblxuICB3ZWJHTFN0YXJ0KClcbn1cbmV4cG9ydCBkZWZhdWx0IHdhdGVyRmx1aWRcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL3dhdGVyLWZsdWlkL3dhdGVyLWZsdWlkLmpzXG4vLyBtb2R1bGUgaWQgPSAuL3B1YmxpYy93YXRlci1mbHVpZC93YXRlci1mbHVpZC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBpbXBvcnQgcGl4aSBmcm9tICcuL3BpeGlqcy0xJyAvLyBmaXJzdCBkZW1vIGFxdWEgbWFnbmlmeVxuLy8gaW1wb3J0IHBpeGkgZnJvbSAnLi9yZXNpemUnXG4vLyBpbXBvcnQgbGlxdWlmeSBmcm9tICcuL2xpcXVpZnktb25lJ1xuLy8gaW1wb3J0IGxpcXVpZnkgZnJvbSAnLi9saXF1aWZ5LXR3bydcbi8vIGltcG9ydCBzbW9rZXkgZnJvbSAnLi9zbW9rZSdcbi8vIGltcG9ydCB3YXRlckltYWdlIGZyb20gJy4vd2F0ZXItaW1hZ2UnXG4vLyBpbXBvcnQgc2ltcGxlRGlzcGxhY2VtZW50IGZyb20gJy4vc2ltcGxlLWRpc3BsYWNlbWVudCdcbi8vIGltcG9ydCBzbWVhciBmcm9tICcuL3NtZWFyJ1xuLy8gaW1wb3J0IHdvYmJsZSBmcm9tICcuL3dvYmJsZSdcbi8vIGltcG9ydCByZWdsIGZyb20gJy4vcmVnbCdcbi8vIGltcG9ydCB3YXRlciBmcm9tICcuL3RocmVlLXdhdGVyJ1xuaW1wb3J0IHdhdGVyRmx1aWQgZnJvbSAnLi4vLi4vcHVibGljL3dhdGVyLWZsdWlkL3dhdGVyLWZsdWlkJ1xuaW1wb3J0IHN0eWxlcyBmcm9tICcuLi9zdHlsZXMvc3R5bGVzLnNjc3MnXG5cblxuY29uc3QgZG9jUmVhZHkgPSAoLyogZXZlbnQgKi8pID0+IHtcbiAgLy8gcGl4aSgpXG4gIC8vIGxpcXVpZnkoKVxuICAvLyBzbW9rZXkoKVxuICAvLyBzbW9rZXlQaXhpKClcbiAgLy8gd2F0ZXJJbWFnZSgpXG4gIC8vIHNpbXBsZURpc3BsYWNlbWVudCgpXG4gIC8vIHNtZWFyKClcbiAgLy8gd29iYmxlKClcbiAgLy8gcmVnbCgpXG4gIC8vIHdhdGVyKClcbiAgd2F0ZXJGbHVpZCgpXG5cbn1cblxuY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGRvY1JlYWR5KVxufVxuXG5cbmluaXQoKVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2pzL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3R5bGVzL3N0eWxlcy5zY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9zdHlsZXMvc3R5bGVzLnNjc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==