import {createElement} from './utils.js'

class ResultStatListItem {
  constructor({label, value}) {
    this.label = label
    this.value = value

    this.itemClassName = 'result-stat-list__item'
    this.itemHiddenClassName = 'result-stat-list__item_hidden'
    this.labelClassName = 'result-stat-list__label'
    this.valueClassName = 'result-stat-list__value'

    this.labelElement = null
    this.valueElement = null
    this.element = null

    this._buildElement()
    this.hide()
  }

  _buildElement() {
    this.labelElement = createElement({
      type: 'span',
      className: this.labelClassName,
      text: `${this.label}: `,
    })

    this.valueElement = createElement({
      type: 'span',
      className: this.valueClassName,
      text: this.value,
    })

    this.element = createElement({
      type: 'li',
      className: this.itemClassName,
      children: [
        this.labelElement,
        this.valueElement,
      ]
    })
  }

  setValue(value) {
    if (value === this.value) {
      return
    }

    this.value = value
    this.update()
  }

  update() {
    this.valueElement.innerText = this.value.toLocaleString()
  }

  show() {
    this.element.classList.remove(this.itemHiddenClassName)
  }

  hide() {
    this.element.classList.add(this.itemHiddenClassName)
  }

  getElement() {
    return this.element
  }
}

export {
  ResultStatListItem,
}
