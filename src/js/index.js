// import pixi from './pixijs' // first demo aqua magnify
import pixi from './resize'
import styles from '../styles/styles.scss'

const docReady = (/* event */) => {
  pixi()
}

const init = () => {
  document.addEventListener('DOMContentLoaded', docReady)
}


init()
