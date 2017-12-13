const smokey = () => {
  var canvas = document.createElement('canvas');
  var w = canvas.width = 800
  let h = canvas.height = 600
  var c = canvas.getContext('2d');

  var img = new Image();
  img.src = 'http://oi41.tinypic.com/4i2aso.jpg';

  var position = {x : w/2, y : h/2};

  document.body.appendChild(canvas);

  var particles = [];
  var random = function(min, max){
    return Math.random()*(max-min)*min;
  };

  canvas.onmousemove = function(e){
    position.x = e.offsetX;
    position.y = e.offsetY;
  };

  function Particle(x, y){
    this.x = x;
    this.y = y;
    this.velY = -2;
    this.velX = (random(1, 10)-5)/10;
    this.size = random(3, 5)/10;
    this.alpha = 1;
    this.update = function(){
      this.y += this.velY;
      this.x += this.velX;
      this.velY *= 0.79;
      if(this.alpha < 0)
        this.alpha = 0;
      c.globalAlpha = this.alpha;
      c.save();
      c.translate(this.x, this.y);
      c.scale(this.size, this.size);
      c.drawImage(img, -img.width/2, -img.height/2);
      c.restore();
      this.alpha *= 0.96;
      this.size += 0.1;
    };
  }


  var draw = function(){
    var p = new Particle(position.x, position.y);
    particles.push(p);

    while(particles.length > 200) particles.shift();

    c.globalAlpha = 1;
    c.fillStyle = '#000';
    c.fillRect(0,0,w,h);

    for(var i = 0; i < particles.length; i++)
    {
      particles[i].update();
    }
  };

  setInterval(draw, 1000/60);
}

export default smokey
