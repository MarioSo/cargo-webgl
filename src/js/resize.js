
const pixi = () => {
  // aliases
  const PIXI = window.PIXI
  const Container = PIXI.Container
  const Sprite = PIXI.Sprite

  // globals
  let app
  let renderer

  const init = () => {
    app = new PIXI.Application(800, 600, {
      transparent: true,
    })
    renderer = app.renderer
    document.body.appendChild(app.view)

    const bg = new Sprite.fromImage('public/13.jpg')
    bg.anchor.set(0.5)
    bg.x = renderer.width / 2
    bg.y = renderer.height / 2


    app.stage.addChild(bg)

    renderer.render(app.stage)
  }

  init()
}

export default pixi
