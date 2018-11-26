import {
  MEASUREMENT_NAME,
  MEASUREMENTS
} from './constants.js'
import {
  createElement,
  pluralize,
} from './utils.js'
import {ResultStatListItem} from './result-stat-list-item.js'

class ResultStatList {
  constructor() {
    this.itemsMap = {}

    this.elementClassName = 'result-stat-list'

    this.element = null

    this._buildElement()
    this._initializeItems()
  }

  _buildElement() {
    this.element = createElement({
      type: 'ul',
      className: this.elementClassName,
    })
  }

  _initializeItems() {
    MEASUREMENTS.forEach(measurement => {
      const item = new ResultStatListItem({label: pluralize(MEASUREMENT_NAME[measurement], 100)})
      this.itemsMap[measurement] = item
      this.element.appendChild(item.getElement())
    })
  }

  setData(data) {
    let shouldShow = false
    MEASUREMENTS.forEach(measurement => {
      const value = data[measurement]
      const item = this.itemsMap[measurement]

      if (value !== 0 && shouldShow === false) {
        shouldShow = true
      }

      item.setValue(value)

      if (shouldShow) {
        item.show()
      } else {
        item.hide()
      }
    })
  }

  getElement() {
    return this.element
  }
}

export {
  ResultStatList,
}
