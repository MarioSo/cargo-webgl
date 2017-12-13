const waterImage = () => {

  // aliases
  const PIXI = window.PIXI
  const Container = PIXI.Container
  const Sprite = PIXI.Sprite

  // globals
  let app
  let renderer

  const getMousePosition = () => app.renderer.plugins.interaction.mouse.global

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

    // replicate image with mask & displacement effect
    const effect = new Container()
    effect.x = 0
    effect.y = 0
    // effect.interactive = true

    // double background for effect
    const bgEffect = PIXI.Sprite.fromImage('public/13.jpg')
    bgEffect.anchor.set(0.5)
    bgEffect.x = renderer.width / 2
    bgEffect.y = renderer.height / 2
    effect.addChild(bgEffect)

    // displacement map
    // const displacementSprite = new Sprite.fromImage('public/dmaps/2048x2048/clouds.jpg')
    const displacementSprite = new Sprite.fromImage('public/4i2aso.jpg')
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


    // block following mouse
    // const mouseBlock = new Container()
    // const rect = new PIXI.Graphics();
    // rect.beginFill(0x0022cc);
    // rect.drawRect(0, 0, 64, 64);
    // mouseBlock.addChild(rect)


    //// create smoke here -------

    // const displacementSprite = new Sprite.fromImage('public/4i2aso.jpg')
    // const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite)
    // displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    // mouseBlock.filters = [displacementFilter]
    // displacementFilter.scale.x = 10
    // displacementFilter.scale.y = 10
    // displacementFilter.autoFit = true
    // mouseBlock.addChild(displacementSprite)
    //


    //// create smoke here -------




    app.stage.addChild(bg, effect)
    // app.stage.addChild(bg, mouseBlock)

    const ticker = new PIXI.ticker.Ticker()

    let mousePosition
    ticker.autoStart = true

    ticker.add((delta) => {
      mousePosition = getMousePosition()
      // original
      mask.x = mousePosition.x
      mask.y = mousePosition.y

      displacementSprite.x += 3 * delta
      displacementSprite.y += 2

      // mouseBlock.x = mousePosition.x - mouseBlock.width / 2
      // mouseBlock.y = mousePosition.y - mouseBlock.height / 2




      renderer.render(app.stage)
    })

    renderer.render(app.stage)
  }

  init()
}

export default waterImage
