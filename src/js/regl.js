import regl from 'regl'

const reglProgram = () => {

  const NUM_VERTS = 8
  const RADIUS = 0.2
  const IMG_SRC = 'public/v2-cute-cat-picture.jpg'

  const r = regl()
  const drawImage = r({
    frag: `
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }`,

    vert: `
  attribute vec2 position;
  uniform float scale;
  void main() {
    gl_Position = vec4(scale * position, 0, 1);
  }`,


    attributes: {
      position: [[0, -1], [-1, 0], [1, 1]],
    },

    uniforms: {
      scale: r.prop('scale'),
    },

    count: 3,
  })

  // From an image element
  // var image = new Image()
  // image.src = IMG_SRC
  // image.onload = () => {
  //   var imageTexture = r.texture(image)
  //   console.log(imageTexture)
  // }

  drawImage({
    scale: 0.5,
    spped: 1,
  })
}

export default reglProgram
