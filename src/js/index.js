import pixi from './pixijs'

const docReady = (/* event */) => {
  pixi()
}

const init = () => {
  document.addEventListener('DOMContentLoaded', docReady)
}


init()
