const simpleDisplacement = () => {
  var canvas = document.createElement('canvas');
  var w = canvas.width = 400
  let h = canvas.height = 400
  var ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  // var canvas = document.getElementById('canvas');
  // var ctx = canvas.getContext('2d');
  var img_src = 'https://media0.giphy.com/media/szk1iRvAWhlo4/200_s.gif';
  var imageData;

  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = img_src;
  img.onload = function() {
    ctx.drawImage(img, 0, 0, 400, 200);

    for(var i = 0; i < 50; i++) {
      createDisplacement();
    }
  }


  function createDisplacement() {
    var xVal = Math.round(Math.random() * 8 - 4);
    var yVal = Math.round(Math.random() * canvas.height);
    var height = Math.round(Math.random() * 4 + 1);
    console.log(xVal, yVal, height)

    var data = ctx.getImageData(0, yVal, canvas.width, height);
    console.log(data)
    ctx.clearRect(0, yVal, canvas.width, height);
    ctx.putImageData(data, xVal, yVal);
  }

  const draw = () => {
    // createDisplacement()
    requestAnimationFrame(draw)
  }

  // draw()

}

export default simpleDisplacement
