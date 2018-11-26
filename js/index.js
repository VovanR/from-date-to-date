/* global moment */

import {FromDate} from './from-date.js'
import {SearchParamsStorage} from './search-params-storage.js'
import {Form} from './form.js'
import {ActiveInput} from './active-onput.js'
import {DateTimePicker} from './date-time-picker.js'
import {Play} from './play.js'
import {fillInput} from './utils.js'

const $fromDate = document.getElementById('from-date')
const $toDate = document.getElementById('to-date')

const getValues = () => ({
  from: $fromDate.value,
  to: $toDate.value,
})

const searchParamsStorage = new SearchParamsStorage()

const load = () => {
  const {from, to} = searchParamsStorage.load()

  fillInput(from, $fromDate)
  fillInput(to, $toDate)
}

load()

const fromDate = new FromDate(getValues())

const update = () => fromDate.update(getValues())

const play = new Play({
  canPlay: () => ($fromDate.value && !$toDate.value) || (!$fromDate.value && $toDate.value),
  onTick: () => update(),
})

const form = new Form({
  onChange: () => {
    update()
    play.start()

    searchParamsStorage.save(getValues())
  },
})

const triggerFormChange = () => form.triggerChange()

// "Now" button
document.getElementById('from-now-button').addEventListener('click', () => {
  fillInput(moment(), $fromDate)
  triggerFormChange()
})

// Start bootstrap-datetimepicker
const activeInput = new ActiveInput({
  initialActive: $fromDate,
  inputElements: [
    $fromDate,
    $toDate,
  ],
  onChange: activeInputElement => {
    // Update datetimepicker value by focusing inputs
    updateDatetimepickerFromDateInput(activeInputElement)
  },
})

const updateDateFromDatetimepicker = date => {
  fillInput(date, activeInput.getActiveElement())
  triggerFormChange()
}

// Initialize datetimepicker
const dateTimePicker = new DateTimePicker({
  onChange(date) {
    updateDateFromDatetimepicker(date)
  }
})

const updateDatetimepickerFromDateInput = activeInputElement => {
  const {value} = activeInputElement

  if (value) {
    dateTimePicker.setDate(value)
  }
}
