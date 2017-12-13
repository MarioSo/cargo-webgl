const debounce = (fn, delay) => {
  let timer = null
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

const attachListener = (element, eventName, handler, debounceDelay = 0) => {
  if (debounceDelay > 0) {
    handler = debounce(handler, debounceDelay)
  }

  if (element.addEventListener) {
    element.addEventListener(eventName, handler, false)
  } else if (element.attachEvent) {
    element.attachEvent(`on${eventName}`, handler)
  } else {
    element[`on${eventName}`] = handler
  }
}
/**
 * adds an eventListener to an object.
 *
 * @param [NodeList|Object|String]  el  Object(s) to bind the listener
 * @param [String]  eventName Name of the event e.g. click
 * @param [function]  handler Callback function
 */
export const addListener = (el, eventName, handler, debounceDelay = 0) => {
  if (typeof (el) === 'string') {
    el = document.querySelectorAll(el)
    if (el.length === 1) {
      el = el[0] // if only one set it properly
    }
  }

  if (el == null || typeof (el) === 'undefined') return

  if (el.length !== undefined && el.length > 1 && el !== window) { // it's a NodeListCollection
    for (let i = 0; i < el.length; i += 1) {
      attachListener(el[i], eventName, handler, debounceDelay)
    }
  } else { // it's a single node
    attachListener(el, eventName, handler, debounceDelay)
  }
}


const detachListener = (element, eventName, handler) => {
  if (element.addEventListener) {
    element.removeEventListener(eventName, handler, false)
  } else if (element.detachEvent) {
    element.detachEvent(`on${eventName}`, handler)
  } else {
    element[`on${eventName}`] = null
  }
}


export const removeListener = (el, eventName, handler) => {
  if (typeof (el) === 'string') {
    el = document.querySelectorAll(el)
    if (el.length === 1) {
      el = el[0] // if only one set it properly
    }
  }

  if (el == null || typeof (el) === 'undefined') return

  if (el.length !== undefined && el.length > 1 && el !== window) { // it's a NodeListCollection
    for (let i = 0; i < el.length; i += 1) {
      detachListener(el[i], eventName, handler)
    }
  } else { // it's a single node
    detachListener(el, eventName, handler)
  }
}

