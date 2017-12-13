

const particle = (x, y) => {
  let x = x
  let y = y
  let velY = -2
  let velX = (random(1, 10)-5)/10
  let size = random(3, 5)/10
  let alpha = 1

  const update = () => {
    y += velY
    x += velX
    velY *= 0.79

    if(alpha < 0) {
      alpha = 0
    }
    c.globalAlpha = alpha
    c.save()
    c.translate(x, y)
    c.scale(size, size)
    c.drawImage(img, -img.width/2, -img.height/2)
    c.restore()
    alpha *= 0.96
    size += 0.1
  }
}

export default particle
