import { find } from './utils/elements'
// import pixi from './pixijs-1' // first demo aqua magnify
// import pixi from './resize'
// import liquify from './liquify-one'
// import liquify from './liquify-two'
// import smokey from './smoke'
// import waterImage from './water-image'
// import simpleDisplacement from './simple-displacement'
// import smear from './smear'
// import wobble from './wobble'
// import regl from './regl'
// import water from './three-water'
// import waterFluid from '../../public/water-fluid/main'
//
// import dp2 from './displace-2'
import Cargo from './cargo'
import styles from '../styles/styles.scss'


const docReady = (/* event */) => {
    Cargo()

  // pixi()
  // liquify()
  // smokey()
  // smokeyPixi()
  // waterImage()
  // simpleDisplacement()
  // smear()
  // wobble()
  // regl()
  // water()
  // waterFluid()
  // regl()

  // dp2(find('.c-img')[0], {
  //   img: 'https://farm6.staticflickr.com/5078/14032935559_8c13e9b181_z_d.jpg'
  // })
  //
  // dp2(find('.c-logo')[0], {
  //   // img: 'public/turtle-512.jpg'
  //   img: 'public/cargo-logo.png'
  // })
}

const init = () => {
  document.addEventListener('DOMContentLoaded', docReady)
}


init()
