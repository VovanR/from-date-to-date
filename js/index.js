/* global moment */

import {FromDate} from './from-date.js'
import {SearchParamsStorage} from './search-params-storage.js'
import {Form} from './form.js'
import {DateTimePicker} from './date-time-picker.js'
import {Play} from './play.js'

const $fromDate = document.querySelector('#from-date')
const $fromDateDateTimePicker = document.querySelector('#from-date-datetimepicker')

const $toDate = document.querySelector('#to-date')
const $toDateDateTimePicker = document.querySelector('#to-date-datetimepicker')

const getValues = () => ({
  from: $fromDate.value,
  to: $toDate.value,
})

const searchParamsStorage = new SearchParamsStorage()

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

const updateDateFromDatetimepicker = () => {
  triggerFormChange()
}

const dateTimePickerFrom = new DateTimePicker({
  element: $fromDate,
  container: $fromDateDateTimePicker,
  onChange() {
    updateDateFromDatetimepicker()
  }
})

const dateTimePickerTo = new DateTimePicker({
  element: $toDate,
  container: $toDateDateTimePicker,
  onChange() {
    updateDateFromDatetimepicker()
  }
})

const {from, to} = searchParamsStorage.load()
dateTimePickerFrom.setDate(from)
dateTimePickerTo.setDate(to)

// "Now" button
document.querySelector('#from-now-button').addEventListener('click', () => {
  dateTimePickerFrom.setDate(moment())
  triggerFormChange()
})

// "Reset" buttons
document.querySelector('#form-from-reset-button').addEventListener('click', () => {
  dateTimePickerFrom.reset()
  triggerFormChange()
})
document.querySelector('#form-to-reset-button').addEventListener('click', () => {
  dateTimePickerTo.reset()
  triggerFormChange()
})
