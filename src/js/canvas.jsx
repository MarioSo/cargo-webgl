import React, { PropTypes } from 'react'
import imagesLoaded from 'imagesloaded'

import Webgl from './canvas-webgl'
import styles from './canvas.scss'
import pixi from './pixijs'

class Canvas extends React.Component {
  constructor(props) {
    super(props)
    // this.state = { txt: 'World' }
  }

  componentDidMount() {
    pixi()
    // var spriteImages = document.querySelectorAll( '.slide-item__image' );
    // var spriteImagesSrc = [];
    // var texts = [];
    // console.log(spriteImages)

    // imagesLoaded(spriteImages, () => {
      // for ( var i = 0; i < spriteImages.length; i++ ) {
      //   var img = spriteImages[i];
      //   // Set the texts you want to display to each slide
      //   // in a sibling element of your image and edit accordingly
      //   if ( img.nextElementSibling ) {
      //     texts.push(img.nextElementSibling.innerHTML);
      //   } else {
      //     texts.push('');
      //   }
      //   spriteImagesSrc.push( img.getAttribute('src' ) );
      // }
      // console.log(spriteImagesSrc)

      // Webgl({
      //   // stageWidth: 400,
      //   // stageHeight: 400,
      //   sprites: spriteImagesSrc,
      //   displacementImage: 'img/dmaps/2048x2048/clouds.jpg',
      //   autoPlay: false,
      //   autoPlaySpeed: [4, 3],
      //   displaceScale: [5000, 10000],
      //   interactive: true,
      //   interactionEvent: 'click', // 'click', 'hover', 'both'
      //   displaceAutoFit: ture,
      //   dispatchPointerOver: true // restarts pointerover event after click
      // })
    // })
  }

  render() {
    return (
      <div className="slide-item">
        {/* <img src="http://localhost:3000/public/13.jpg" className="slide-item__image" /> */}
      </div>
      )
  }
}


export default Canvas
