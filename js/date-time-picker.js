import Picker from '../vendor/picker.esm.js'
import {INPUT_DATETIME_LOCAL_FORMAT} from './constants.js'

/**
 * [Docs]{@link https://github.com/fengyuanchen/pickerjs/blob/master/README.md}
 * [Example]{@link https://fengyuanchen.github.io/pickerjs/}
 */
class DateTimePicker {
  constructor({
    element,
    container,
    onChange,
  }) {
    this._element = element
    this._container = container
    this._onChange = onChange

    this._picker = null

    this._initialize()
    this._bindControls()
  }

  _initialize() {
    this._picker = new Picker(this._element, {
      container: this._container,
      format: INPUT_DATETIME_LOCAL_FORMAT,
      inline: true,
      rows: 3,
    })
  }

  _bindControls() {
    this._element.addEventListener('change', () => this._onChange())
  }

  setDate(date) {
    if (date) {
      this._picker
        .setDate(date)
        .pick()
    } else {
      this.reset()
    }
  }

  reset() {
    this._picker.reset()
  }
}

export {
  DateTimePicker,
}
