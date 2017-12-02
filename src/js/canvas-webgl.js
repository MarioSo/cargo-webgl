import { TweenMax } from 'gsap'

const Webgl = (options) => {
  var that  =   this;

  //  OPTIONS
  /// ---------------------------
  options                     = options || {};
  options.stageWidth          = options.hasOwnProperty('stageWidth') ? options.stageWidth : 1920;
  options.stageHeight         = options.hasOwnProperty('stageHeight') ? options.stageHeight : 1080;
  options.pixiSprites         = options.hasOwnProperty('sprites') ? options.sprites : [];
  options.centerSprites       = options.hasOwnProperty('centerSprites') ? options.centerSprites : false;
  options.texts               = options.hasOwnProperty('texts') ? options.texts : [];
  options.autoPlay            = options.hasOwnProperty('autoPlay') ? options.autoPlay : true;
  options.autoPlaySpeed       = options.hasOwnProperty('autoPlaySpeed') ? options.autoPlaySpeed : [10, 3];
  options.fullScreen          = options.hasOwnProperty('fullScreen') ? options.fullScreen : true;
  options.displaceScale       = options.hasOwnProperty('displaceScale') ? options.displaceScale : [200, 70];
  options.displacementImage   = options.hasOwnProperty('displacementImage') ? options.displacementImage : '';
  options.navElement          = options.hasOwnProperty('navElement')  ?  options.navElement : document.querySelectorAll( '.scene-nav' );
  options.displaceAutoFit     = options.hasOwnProperty('displaceAutoFit')  ?  options.displaceAutoFit : false;
  options.wacky               = options.hasOwnProperty('wacky') ? options.wacky : false;
  options.interactive         = options.hasOwnProperty('interactive') ? options.interactive : false;
  options.interactionEvent    = options.hasOwnProperty('interactionEvent') ? options.interactionEvent : '';
  options.displaceScaleTo     = ( options.autoPlay === false ) ? [ 0, 0 ] : [ 20, 20 ];
  options.textColor           = options.hasOwnProperty('textColor') ? options.textColor : '#fff';
  options.displacementCenter  = options.hasOwnProperty('displacementCenter') ? options.displacementCenter : false;
  options.dispatchPointerOver = options.hasOwnProperty('dispatchPointerOver') ? options.dispatchPointerOver : false;



  //  PIXI VARIABLES
  /// ---------------------------
  var renderer            = new PIXI.autoDetectRenderer( options.stageWidth, options.stageHeight, { transparent: true });
  var stage               = new PIXI.Container();
  var slidesContainer     = new PIXI.Container();
  var displacementSprite  = new PIXI.Sprite.fromImage( options.displacementImage );
  var displacementFilter  = new PIXI.filters.DisplacementFilter( displacementSprite );

  const initPixi = () => {
    // Add canvas to the HTML
    document.body.appendChild( renderer.view );


    // Add child container to the main container
    stage.addChild( slidesContainer );


    // Enable Interactions
    stage.interactive = true;


    // Fit renderer to the screen
    if ( options.fullScreen === true ) {
      renderer.view.style.objectFit = 'cover';
      renderer.view.style.width     = '100%';
      renderer.view.style.height    = '100%';
      renderer.view.style.top       = '50%';
      renderer.view.style.left      = '50%';
      renderer.view.style.webkitTransform = 'translate( -50%, -50% ) scale(1.2)';
      renderer.view.style.transform = 'translate( -50%, -50% ) scale(1.2)';
    } else {
      renderer.view.style.maxWidth  = '100%';
      renderer.view.style.top       = '50%';
      renderer.view.style.left      = '50%';
      renderer.view.style.webkitTransform = 'translate( -50%, -50% )';
      renderer.view.style.transform = 'translate( -50%, -50% )';
    }


    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;


    // Set the filter to stage and set some default values for the animation
    stage.filters = [displacementFilter];

    if ( options.autoPlay === false ) {
      displacementFilter.scale.x = 0;
      displacementFilter.scale.y = 0;
    }

    if ( options.wacky === true ) {

      displacementSprite.anchor.set(0.5);
      displacementSprite.x = renderer.width / 2;
      displacementSprite.y = renderer.height / 2;
    }

    displacementSprite.scale.x = 2;
    displacementSprite.scale.y = 2;

    // PIXI tries to fit the filter bounding box to the renderer so we optionally bypass
    displacementFilter.autoFit = options.displaceAutoFit;

    stage.addChild( displacementSprite );
  }

  const loadPixiSprites = ( sprites ) => {


    // console.log(sprites)
    var rSprites = options.sprites;
    var rTexts   = options.texts;

    for ( var i = 0; i < rSprites.length; i++ ) {

      var texture   = new PIXI.Texture.fromImage( sprites[i] );
      var image     = new PIXI.Sprite( texture );

      // if ( rTexts ) {
      //   var richText = new PIXI.Text( rTexts[i], style);
      //   image.addChild(richText);
      //
      //   richText.anchor.set(0.5);
      //   richText.x = image.width / 2;
      //   richText.y = image.height / 2;
      // }

      if ( options.centerSprites === true ) {
        image.anchor.set(0.5);
        image.x = renderer.width / 2;
        image.y = renderer.height / 2;
      }
      // image.transform.scale.x = 1.3;
      // image.transform.scale.y = 1.3;



      if ( i !== 0  ) {
        TweenMax.set( image, { alpha: 0 } );
      }

      // console.log(slidesContainer)
      slidesContainer.addChild( image );

    }

  };

  const init = () => {
    initPixi();
    loadPixiSprites( options.pixiSprites );

    if ( options.autoPlay === true ) {

      var ticker = new PIXI.ticker.Ticker();

      ticker.autoStart = options.autoPlay;

      ticker.add(function( delta ) {

        displacementSprite.x += options.autoPlaySpeed[0] * delta;
        displacementSprite.y += options.autoPlaySpeed[1];

        renderer.render( stage );

      });

    }

    if ( options.displacementCenter === true ) {
      displacementSprite.anchor.set(0.5);
      displacementSprite.x = renderer.view.width / 2;
      displacementSprite.y = renderer.view.height / 2;
    }

    TweenMax.to( displacementFilter.scale, 1, { x: "+=" + Math.sin( mouseX ) * 1200 + "", y: "+=" + Math.cos( mouseY ) * 200 + ""  });
  }
  init()
}

export default Webgl
