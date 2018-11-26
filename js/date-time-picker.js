/* global jQuery */

import {INPUT_DATETIME_LOCAL_FORMAT} from './constants.js'

class DateTimePicker {
  constructor({
    onChange,
  }) {
    this._onChange = onChange

    this._element = jQuery('#datetimepicker')

    this._initialize()
  }

  _initialize() {
    this._element
      .datetimepicker({
        inline: true,
        sideBySide: true,
        format: INPUT_DATETIME_LOCAL_FORMAT,
      })
      .on('dp.change', ({date}) => this._onChange(date))
      .on('dp.update', ({viewDate}) => this._onChange(viewDate))
  }

  setDate(date) {
    this._element.data('DateTimePicker').date(date)
  }
}

export {
  DateTimePicker,
}
