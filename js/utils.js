/* global moment */

import {INPUT_DATETIME_LOCAL_FORMAT} from './constants.js'

/**
 * Pluralize word
 *
 * @param {string} word
 * @param {number} count
 * @returns {string}
 */
const pluralize = (word, count) => count > 1 ? `${word}s` : word

/**
 * Create HTMLElement
 * {@link http://jsfiddle.net/VovanR/6bwnfxat/}
 * @version 1.0.1
 *
 * @param {string} [type='div']
 * @param {string} [className]
 * @param {string} [text]
 * @param {string} [html]
 * @param {Node[]} [children]
 * @param {object} [attributes]
 * @param {object} [dataset]
 * @returns {HTMLElement}
 *
 * @example
 * createElement()
 * createElement({type: 'span', text: 'Foo'})
 * createElement({type: 'ul', html: '<li>1</li><li>2</li><li>3</li>'})
 * createElement({children: [createElement({text: 'Bar'}), document.createElement('div')]})
 * createElement({attributes: {type: 'button'}})
 * createElement({dataset: {id: '1'}})
 */
const createElement = ({
  type = 'div',
  className,
  text,
  html,
  children,
  attributes,
  dataset,
} = {}) => {
  const element = document.createElement(type)

  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value)
    }
  }

  if (className) {
    element.setAttribute('class', className)
  }

  if (text !== undefined) {
    element.textContent = text
  } else if (html) {
    element.innerHTML = html
  } else if (children) {
    children.forEach(childElement => {
      if (childElement instanceof Node) {
        element.appendChild(childElement)
      }
    })
  }

  if (dataset) {
    for (const [key, value] of Object.entries(dataset)) {
      element.dataset[key] = value
    }
  }

  return element
}

/**
 * Set datetime input value
 *
 * @param {string|moment} date
 * @param {HTMLInputElement} inputElement
 */
function fillInput(date, inputElement) {
  let value = ''

  /** @type {moment} */
  let momentDate
  if (typeof date === 'string') {
    if (date === 'now') {
      momentDate = moment()
    } else {
      momentDate = moment(date)
    }
  } else if (date instanceof moment) {
    momentDate = date
  }

  if (momentDate && momentDate.isValid()) {
    value = momentDate.format(INPUT_DATETIME_LOCAL_FORMAT)
  }

  inputElement.value = value
}

export {
  pluralize,
  createElement,
  fillInput,
}
