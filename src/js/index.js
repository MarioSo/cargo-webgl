// import pixi from './pixijs' // first demo aqua magnify
// import pixi from './resize'
// import liquify from './liquify-one'
// import liquify from './liquify-two'
import smokey from './smoke'
import waterImage from './water-image'
import simpleDisplacement from './simple-displacement'
import smear from './smear'
import wobble from './wobble'
import regl from './regl'
import water from './three-water'
import styles from '../styles/styles.scss'


const docReady = (/* event */) => {
  // pixi()
  // liquify()
  // smokey()
  // smokeyPixi()
  // waterImage()
  // simpleDisplacement()
  // smear()
  // wobble()
  // regl()
  water()
}

const init = () => {
  document.addEventListener('DOMContentLoaded', docReady)
}


init()
