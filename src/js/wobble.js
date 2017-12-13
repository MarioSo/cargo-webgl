
const wobble = () => {
  const U = undefined;
  const RESIZE_DEBOUNCE_TIME = 100;
  var w,
    h,
    cw,
    ch,
    canvas,
    ctx,
    mouse,
    createCanvas,
    resizeCanvas,
    setGlobals,
    globalTime=0,
    resizeCount = 0;

var L = typeof log === "function" ? log : function(d){ console.log(d); }

createCanvas = function () {
  var c,
    cs;
  cs = (c = document.createElement("canvas")).style;
  cs.position = "absolute";
  cs.top = cs.left = "0px";
  cs.zIndex = 1000;
  document.body.appendChild(c); return c;

}
resizeCanvas = function () {
  if (canvas === U) {
    canvas = createCanvas();
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");

  if (typeof setGlobals === "function") {
    setGlobals();
  }
  if (typeof onResize === "function") {
    resizeCount += 1; setTimeout(debounceResize,RESIZE_DEBOUNCE_TIME);
  }
}

function debounceResize(){
  resizeCount -= 1;
  if(resizeCount <= 0){
    onResize();
  }
}
setGlobals = function(){
  cw = (w = canvas.width) / 2;
  ch = (h = canvas.height) / 2; mouse.updateBounds();
}

mouse = (function(){
    function preventDefault(e) { e.preventDefault(); }
    var mouse = {
      x : 0,
      y : 0,
      w : 0,
      alt : false,
      shift : false,
      ctrl : false,
      buttonRaw : 0,
      over : false,
      bm : [1, 2, 4, 6, 5, 3],
      active : false,
      bounds : null,
      crashRecover : null,
      mouseEvents : "mousemove,mousedown,mouseup,mouseout,mouseover,mousewheel,DOMMouseScroll".split(",")
    };
    var m = mouse;
    function mouseMove(e) {
        var t = e.type;
        m.x = e.clientX - m.bounds.left; m.y = e.clientY - m.bounds.top;
        m.alt = e.altKey; m.shift = e.shiftKey; m.ctrl = e.ctrlKey;
        if (t === "mousedown") { m.buttonRaw |= m.bm[e.which-1]; }
        else if (t === "mouseup") { m.buttonRaw &= m.bm[e.which + 2]; }
        else if (t === "mouseout") { m.buttonRaw = 0; m.over = false; }
        else if (t === "mouseover") { m.over = true; }
        else if (t === "mousewheel") { m.w = e.wheelDelta; }
        else if (t === "DOMMouseScroll") { m.w = -e.detail; }
        if (m.callbacks) { m.callbacks.forEach(c => c(e)); }
        if((m.buttonRaw & 2) && m.crashRecover !== null){ if(typeof m.crashRecover === "function"){ setTimeout(m.crashRecover,0);}}
        e.preventDefault();
    }
    m.updateBounds = function(){
        if(m.active){
            m.bounds = m.element.getBoundingClientRect();
        }
    }
    m.addCallback = function (callback) {
        if (typeof callback === "function") {
            if (m.callbacks === U) { m.callbacks = [callback]; }
            else { m.callbacks.push(callback); }
        } else { throw new TypeError("mouse.addCallback argument must be a function"); }
    }
    m.start = function (element, blockContextMenu) {
        if (m.element !== U) { m.removeMouse(); }
        m.element = element === U ? document : element;
        m.blockContextMenu = blockContextMenu === U ? false : blockContextMenu;
        m.mouseEvents.forEach( n => { m.element.addEventListener(n, mouseMove); } );
        if (m.blockContextMenu === true) { m.element.addEventListener("contextmenu", preventDefault, false); }
        m.active = true;
        m.updateBounds();
    }
    m.remove = function () {
        if (m.element !== U) {
            m.mouseEvents.forEach(n => { m.element.removeEventListener(n, mouseMove); } );
            if (m.contextMenuBlocked === true) { m.element.removeEventListener("contextmenu", preventDefault);}
            m.element = m.callbacks = m.contextMenuBlocked = U;
            m.active = false;
        }
    }
    return mouse;
})();

resizeCanvas();
mouse.start(canvas,true);
window.addEventListener("resize",resizeCanvas);
function display(){
    ctx.setTransform(1,0,0,1,0,0); // reset transform
    ctx.globalAlpha = 1;           // reset alpha
    ctx.clearRect(0,0,w,h);
    if(webGL !== undefined){
        webGLRender();
    }
}
function update(timer){ // Main update loop
    globalTime = timer;
    display();  // call demo code
    requestAnimationFrame(update);
}
requestAnimationFrame(update);
var globalTime = new Date().valueOf();  // global to this

// creates vertex and fragment shaders
function createProgramFromScripts( gl, ids) {
    var shaders = [];
    for (var i = 0; i < ids.length; i += 1) {
        var script = shadersSource[ids[i]];
        if (script !== undefined) {
            var shader = gl.createShader(gl[script.type]);
            gl.shaderSource(shader, script.source);
            gl.compileShader(shader);
            shaders.push(shader);
        }else{
            throw new ReferenceError("*** Error: unknown script ID : " + ids[i]);
        }
    }
    var program = gl.createProgram();
    shaders.forEach((shader) => {  gl.attachShader(program, shader); });
    gl.linkProgram(program);
    return program;
}

// setup simple 2D webGL image processor
var webGL;
function startWebGL(image) {
  // Get A WebGL context
  webGL = document.createElement("canvas");
  webGL.width = image.width;
  webGL.height = image.height;
  webGL.gl = webGL.getContext("webgl");
  var gl = webGL.gl;
  var program = createProgramFromScripts(gl, ["VertexShader", "FragmentShader"]);
  gl.useProgram(program);
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0,  0.0,1.0,  0.0,0.0,  1.0,0.0,  1.0,1.0,  0.0,1.0,  1.0]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

  // lookup uniforms for frag shader
  var locs = {}
  locs.timer = gl.getUniformLocation(program, "time");  // the time used to control waves
  locs.phase = gl.getUniformLocation(program, "phase"); // Sort of phase, moves to attractors around
  locs.amount = gl.getUniformLocation(program, "amount"); // Mix amount of effect and flat image
  webGL.locs = locs;

  gl.uniform2f(resolutionLocation, webGL.width, webGL.height);
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  setRectangle(gl, 0, 0, image.width, image.height);
}
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}

function randomInt(range) {
  return Math.floor(Math.random() * range);
}



var shadersSource = {
    VertexShader : {
        type : "VERTEX_SHADER",
        source : `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            uniform vec2 u_resolution;
            varying vec2 v_texCoord;
            void main() {
                vec2 zeroToOne = a_position / u_resolution;
                vec2 zeroToTwo = zeroToOne * 2.0;
                vec2 clipSpace = zeroToTwo - 1.0;
                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                v_texCoord = a_texCoord;
            }`
    },
    FragmentShader : {
        type : "FRAGMENT_SHADER",
        source : `
            precision mediump float;
            uniform sampler2D u_image;
            uniform float time;
            uniform float phase;
            uniform float amount;
            varying vec2 v_texCoord;
            vec2 offset;
            float dist;
            float edge;
            float v;
            vec2 pos1 = vec2(0.5 + sin(phase * 0.03)*1.3, 0.5 + cos(phase * 0.032)*1.3);
            vec2 pos2 = vec2(0.5 + cos(phase * 0.013)*1.3,0.5 + cos(phase*0.012)*1.3);
            void main() {
                dist = distance(pos1,v_texCoord) * distance(pos2,v_texCoord);


                edge = 1. - distance(vec2(0.5,0.5),v_texCoord) / 0.707;
                v = time * dist * 0.0001 * edge * phase;
                offset = vec2(
                        v_texCoord.x + sin(v+time) * 0.1 * edge * amount,
                        v_texCoord.y + cos(v+time) * 0.1 * edge * amount
                );
                //offset = smoothstep(v_texCoord.x,offset.x,abs(0.5-v_textCoord.x) );
                gl_FragColor = texture2D(u_image, offset);
            }`
    }
}


var md = 0;
var mr = 0;
var mdy = 0;
var mry = 0;
function webGLRender(){
  var gl = webGL.gl;
  md += (mouse.x / canvas.width - mr) * 0.016;
  md *= 0.018;
  mr += md;
  mdy += (mouse.y - mry) * 0.016;
  mdy *= 0.018;
  mry += mdy;

  gl.uniform1f(webGL.locs.timer, globalTime/100);
  gl.uniform1f(webGL.locs.phase, mr * 400);
  gl.uniform1f(webGL.locs.amount, ((mry/canvas.height)) * 9);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  ctx.drawImage(webGL,0,0, canvas.width, canvas.height);


  // console.log(globalTime/100, mr * 400, ((mry/canvas.height)) * 9)

}


var image = document.createElement("canvas");
image.width = 1024;
image.height = 512;
image.ctx = image.getContext("2d");
image.ctx.font = "192px Arial";
image.ctx.textAlign = "center";
image.ctx.textBaseline = "middle";
image.ctx.lineJoin = "round";
image.ctx.lineWidth = 32;
image.ctx.strokeStyle = "red";
image.ctx.fillStyle = "black";
image.ctx.strokeText("WOBBLE",512,256);
image.ctx.lineWidth = 16;
image.ctx.strokeStyle = "white";

image.ctx.strokeText("WOBBLE",512,256);
image.ctx.fillText("WOBBLE",512,256);
image.ctx.font = "32px Arial";
image.ctx.fillText("Mouse position on image controls wobble",512,32);
image.ctx.fillText("Using WebGL and 2D Canvas",512,512-32);

startWebGL(image);
/*var image = new Image(); // load image
image.src = "https://i.stack.imgur.com/C7qq2.png?s=328&g=1";  // MUST BE SAME DOMAIN!!!
image.onload = function() {
    startWebGL(image);
}*/
}
export default wobble
