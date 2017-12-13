import { addListener } from './utils/events'

const smear = () => {

  //<input type="radio" name="distortionType" id="smear">Smear<br>

  // var imgCanvas = $('imgCanvas');
  // var imgCtx=imgCanvas.getContext('2d');

  var imgCanvas = document.createElement('canvas');
  var w = imgCanvas.width = 400
  let h = imgCanvas.height = 400
  var imgCtx = imgCanvas.getContext('2d');

  document.body.appendChild(imgCanvas);

  // var mouseIsDown=false;
  var mouseIsDown=false;
  var mx=0;
  var my=0;
  var lx=0;
  var ly=0;
  var radius=0;
  var amount=0;

  var distLeft=0;
  var distUp=0;
  var width=0;
  var height=0;

  var radiusMD=false;
  var amountMD=false;

  var edited=false;
  var img;

  //var status=$('status');
  imgCanvas.width=w;
  imgCanvas.height=h;
  imgCanvas.onmousemove=function(event){lx=mx;ly=my;updateMousePos(event);}

  // Math.random()<0.5 ? loadImage('images/angelababy.jpg') : loadImage('images/angelababy.jpg');
  loadImage('public/angelababy.jpg')

  addListener('canvas', 'mousedown', () => {
    console.log('mousedown')

    canvasMouseDown(event);
  })
  // jQuery(document).ready(function(){
  // 	jQuery('#imgCanvas').on("vmousedown", function(event){
  // 		if(event.button==0) canvasMouseDown(event);
  // 	});
  //
  // 	jQuery('#imgCanvas').on("vmouseup", function(event){
  // 		canvasMouseUp();
  // 	});
  //
  // 	jQuery('#uploadbtn').on('click', saveViaAJAX);
  //
  // })


  // function moveSlider(evt,id,doit)
  // {
  //   if(doit)
  //   {
  //     var x=evt.clientX-$('slidertd').offsetLeft-$('gAdTd').offsetWidth-$('tbl').offsetLeft-$('outerTable').offsetLeft-10-2;
  //     if(x<0) x=0;
  //     if(x>183) x=183;
  //     $(id).style.left=x;
  //   }
  // }


  function canvasMouseDown(evt) {
    mouseIsDown=true;
    updateMousePos(evt);
    lx=mx;
    ly=my;
    distort();
  }

  function updateMousePos(evt) {
    mx = evt.clientX //- $('outerTable').offsetLeft-$('gAdTd').offsetWidth-$('tbl').offsetLeft-$('tbltd').offsetLeft-2;
    my=evt.clientY //-$('outerTable').offsetTop-$('tbl').offsetTop-$('tbltd').offsetTop-2;
  }

  function canvasMouseUp() {
    mouseIsDown=false;
  }

  function distort() {
    if(mouseIsDown) {
      radius=80//Math.round(parseInt($('radius').style.left)/184*205+20); //from 20 to 225.
      amount=50//Math.round(parseInt($('amount').style.left)/184*10+90); //from 90 to 100.

      // if($('shrink').checked || $('ccw').checked) amount=-amount;

      if(radius>100) imgCanvas.style.cursor="wait";
      setTimeout(realDistort(1),0);
    }
  }

  function realDistort(force)
  {
    if(mouseIsDown || force==1)
    {
      var mmx=mx; //my mx - mx at time of distortion click
      var mmy=my;
      var mlx=lx;
      var mly=ly;

      edited=true;

      mmx>radius? distLeft=radius : distLeft=mmx;
      mmx<w-radius? width=radius*2+1 : width=w-mmx+radius;

      mmy>radius? distUp=radius : distUp=mmy;
      mmy<h-radius? height=radius*2+1 : height=h-mmy+radius;

      var curImageData=imgCtx.getImageData(mmx-distLeft,mmy-distUp,width,height);
      var newImageData=imgCtx.createImageData(width,height);

      for(var x=-distLeft;x<width-distLeft;x++) {
        for(var y=-distUp;y<height-distUp;y++) {
          //this is where the transformation takes place.
          var dist=Math.sqrt(x*x + y*y); //this is the distance of the current pixel from the click point.
          var angle=Math.atan(y/x);
          if(isNaN(angle)) angle=0;

          if(dist<=radius) {

            var push=Math.cos(dist/(radius) * Math.PI/2);
            var dx=mmx-mlx;
            var dy=mmy-mly;
            var dmax=3;

            if(dx>dmax) {
              dy=dy/(dx/dmax);
              dx=dmax;
            }
            if(dy>dmax) {
              dx=dx/(dy/dmax);
              dy=dmax;
            }

            var cx=x-dx*push*(amount-20)/50;
            var cy=y-dy*push*(amount-20)/50;
          }
          //alert(push);

          var abort=false;

          if(cx<-distLeft) cx=-distLeft;
          if(cx>width-distLeft) cx=width-distLeft;
          if(cy<-distUp) cy=-distUp;
          if(cy>height-distUp) cy=height-distUp;

          var cxf=Math.floor(cx);
          var cyf=Math.floor(cy);

          var i00=i(cxf,cyf);
          var i01=i(Math.ceil(cx),Math.ceil(cy));
          var factor=Math.sqrt((Math.pow(cx-cxf,2) + Math.pow(cy-cyf,2))/2); //distance between actual and floor divided by sqrt2.
          var i1=i(x,y,1);
          if(x<-radius || x>=radius || y<-radius || y>=radius) {
            //alert('current!');
          }

          if(!curImageData.data[i00+3]) {
            //$('debug').innerHTML+="(x,y)=("+x+","+y+"); (cx,cy)=("+cx+","+cy+"); i00="+i00+"; curImageData.data[i00+3]="+curImageData.data[i00+3]+"<br>";
          }

          newImageData.data[i1]=curImageData.data[i00]*(1-factor) + curImageData.data[i01]*factor;     //setting the color of the new coords to be equal to the color
          newImageData.data[i1+1]=curImageData.data[i00+1]*(1-factor) + curImageData.data[i01+1]*factor; //of the current pixel.
          newImageData.data[i1+2]=curImageData.data[i00+2]*(1-factor) + curImageData.data[i01+2]*factor;
          newImageData.data[i1+3]=curImageData.data[i00+3]*(1-factor) + curImageData.data[i01+3]*factor;
        }
      }

      imgCtx.putImageData(newImageData,mmx-distLeft,mmy-distUp);

    }
    else
    {
      imgCanvas.style.cursor='default';
    }
  }

  //this function returns a data index for the red component of the pixel at a given x and y, given
  //the very specific circumstances I'm using in distort().
  function i(x,y)
  {
    return ((y+distUp)*width*4) + ((x+distLeft)*4);
  }

  function $(id)
  {
    return document.getElementById(id);
  }

  //this function is called when the user clicks "load". It downloads the image and calls readImage().
  function loadImage(u)
  {
    var cont=true;

    if(edited) cont=confirm("Discard current image and load new one?");

    if(cont)
    {
      img=new Image();
      img.onload=function()
      {
        imgCtx.clearRect(0,0,w,h);
        if(img.width>=img.height*w/h && img.width>w)
        {
          //toooooo wide.
          drawAnImage(0,0,w,w*(img.height/img.width));
        }
        else if(img.width<img.height*w/h && img.height>h)
        {
          //toooooo tall.
          drawAnImage(0,0,h*(img.width/img.height),h);
        }
        else
        {
          //it fits!
          drawAnImage(0,0);
        }
      }
      //status.innerHTML='Downloading&nbsp;image...';
      img.src=u;
      edited=false;
    }
  }

  function drawAnImage(x,y,w,h) {
    try {
      if(w===undefined) {
        imgCtx.drawImage(img,x,y);
      } else {
        imgCtx.drawImage(img,x,y,w,h);
      }
    }
    catch(err) {
      if(w===undefined) {
        setTimeout("drawAnImage("+x+","+y+");",10);
      } else {
        setTimeout("drawAnImage("+x+","+y+","+w+","+h+");",10);
      }
    }
  }
}

export default smear
