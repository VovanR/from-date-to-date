const $form = document.getElementById('form')
const $fromDate = document.getElementById('from-date')
const $toDate = document.getElementById('to-date')

const $result = document.getElementById('result-text')
const $resultStat = document.getElementById('result-list')

const $resultFoo = document.getElementById('result-foo-text')
const $resultFooStat = document.getElementById('result-foo-list')

const INPUT_DATETIME_LOCAL_FORMAT = 'YYYY-MM-DDTHH:mm:ss'

const DAYS_IN_WEEK = 7

const MEASUREMENT = {
  years: 'years',
  months: 'months',
  weeks: 'weeks',
  days: 'days',
  hours: 'hours',
  minutes: 'minutes',
  seconds: 'seconds',
  milliseconds: 'milliseconds',
}
const MEASUREMENT_NAME = {
  [MEASUREMENT.years]: 'year',
  [MEASUREMENT.months]: 'month',
  [MEASUREMENT.weeks]: 'week',
  [MEASUREMENT.days]: 'day',
  [MEASUREMENT.hours]: 'hour',
  [MEASUREMENT.minutes]: 'minute',
  [MEASUREMENT.seconds]: 'second',
  [MEASUREMENT.milliseconds]: 'millisecond',
}
const MEASUREMENTS = [
  MEASUREMENT.years,
  MEASUREMENT.months,
  MEASUREMENT.weeks,
  MEASUREMENT.days,
  MEASUREMENT.hours,
  MEASUREMENT.minutes,
  MEASUREMENT.seconds,
  MEASUREMENT.milliseconds,
]

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
 *
 * @param {string} [type='div']
 * @param {string} [className]
 * @param {string} [text]
 * @param {string} [html]
 * @param {array} [children]
 * @returns {HTMLElement}
 */
const createElement = ({
  type = 'div',
  className,
  text,
  html,
  children,
}) => {
  const element = document.createElement(type)

  if (className) {
    element.classList.add(className)
  }

  if (text) {
    element.innerText = text
  } else if (html) {
    element.innerHTML = html
  } else if (children) {
    children.forEach(childElement => element.appendChild(childElement))
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

  let momentDate
  if (typeof date === 'string') {
    momentDate = moment(date)
  } else if (date instanceof moment) {
    momentDate = date
  }

  if (momentDate && momentDate.isValid()) {
    value = momentDate.format(INPUT_DATETIME_LOCAL_FORMAT)
  }

  inputElement.value = value
}

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

    this.buildElement()
    this.hide()
  }

  buildElement() {
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

class ResultStatList {
  constructor() {
    this.itemsMap = {}

    this.elementClassName = 'result-stat-list'

    this.element = null

    this.buildElement()
    this.initItems()
  }

  buildElement() {
    this.element = createElement({
      type: 'ul',
      className: this.elementClassName,
    })
  }

  initItems() {
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

class FromDate {
  constructor({from, to}) {
    this.resultStatList = new ResultStatList()
    this.resultFooStatList = new ResultStatList()

    $resultStat.appendChild(this.resultStatList.getElement())
    $resultFooStat.appendChild(this.resultFooStatList.getElement())

    this.update({from, to})
  }

  toJSON() {
    return MEASUREMENTS.reduce((acc, measurement) => ({
      ...acc,
      [measurement]: this.to.diff(this.from, measurement)
    }), {})
  }

  getDuration() {
    return moment.duration(this.to.diff(this.from))
  }

  toDurationJSON() {
    const stat = this.toJSON()
    const duration = this.getDuration()

    return MEASUREMENTS.reduce((acc, measurement) => {
      if (stat[measurement]) {
        acc[measurement] = this.getFloorDurationByMeasurement(duration, measurement)
      } else {
        acc[measurement] = 0
      }
      return acc
    }, {})
  }

  getDurationByMeasurement(duration, measurement) {
    switch (measurement) {
      case MEASUREMENT.years:
        return duration.years()
      case MEASUREMENT.months:
        return duration.months()
      case MEASUREMENT.weeks:
        return duration.weeks()
      case MEASUREMENT.days:
        return duration.days() - (duration.weeks() * DAYS_IN_WEEK)
      case MEASUREMENT.hours:
        return duration.hours()
      case MEASUREMENT.minutes:
        return duration.minutes()
      case MEASUREMENT.seconds:
        return duration.seconds()
      case MEASUREMENT.milliseconds:
        return duration.milliseconds()
      default:
        throw new Error(`OMG! ${measurement}`)
    }
  }

  getFloorDurationByMeasurement(duration, measurement) {
    return Math.floor(this.getDurationByMeasurement(duration, measurement))
  }

  toFormattedString() {
    return this._toFormattedString(this.toDurationJSON(), 'and')
  }

  toFormattedFooString() {
    return this._toFormattedString(this.toJSON(), 'or')
  }

  _toFormattedString(stat, lastDivider) {
    const result = MEASUREMENTS.reduce((acc, measurement) => {
      const value = stat[measurement]
      if (value) {
        acc.push(`${value.toLocaleString()} ${pluralize(MEASUREMENT_NAME[measurement], value)}`)
      }
      return acc
    }, [])

    if (result.length === 0) {
      return ''
    }

    if (result.length === 1) {
      return result[0]
    }

    const lastItem = result.pop()

    return `${result.join(', ')} ${lastDivider} ${lastItem}`
  }

  update({from, to}) {
    const now = moment()
    if (from) {
      this.from = moment(from)
    } else {
      this.from = now
    }

    if (to) {
      this.to = moment(to)
    } else {
      this.to = now
    }

    this.render()
  }

  render() {
    $result.value = this.toFormattedString()
    this.resultStatList.setData(this.toDurationJSON())

    $resultFoo.value = this.toFormattedFooString()
    this.resultFooStatList.setData(this.toJSON())
  }
}

class SearchParamsStorage {
  constructor() {
    this._prevData = null
  }

  _parseSearchParamsToJSON() {
    const searchParams = new URLSearchParams(window.location.search)
    const data = {}
    for (const [key, value] of searchParams) {
      if (value) {
        data[key] = value
      }
    }
    return data
  }

  load() {
    return this._parseSearchParamsToJSON()
  }

  _isChanged(data) {
    return JSON.stringify(data) !== JSON.stringify(this._prevData)
  }

  save(data) {
    if (!this._isChanged(data)) {
      return
    }

    const newData = {}
    const newSearchParams = new URLSearchParams()

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        newData[key] = value
        newSearchParams.set(key, value)
      }
    })

    this._prevData = newData

    const url = window.location.pathname + '?' + newSearchParams.toString()
    window.history.pushState(null, null, url)
  }
}

const searchParamsStorage = new SearchParamsStorage()

const load = () => {
  const {from, to} = searchParamsStorage.load()

  fillInput(from, $fromDate)
  fillInput(to, $toDate)
}

load()

const fromDate = new FromDate({
  from: $fromDate.value,
  to: $toDate.value,
})

const canPlay = () => ($fromDate.value && !$toDate.value) || (!$fromDate.value && $toDate.value)

const step = () => {
  if (canPlay()) {
    update()
  }
}

const start = () => window.requestAnimationFrame(step)

const update = () => {
  fromDate.update({
    from: $fromDate.value,
    to: $toDate.value,
  })
  start()
}

const save = () => {
  searchParamsStorage.save({
    from: $fromDate.value,
    to: $toDate.value,
  })
}

start()

const triggerFormChange = () => $form.dispatchEvent(new Event('change'))

// "Now" button
document.getElementById('from-now-button').addEventListener('click', () => {
  fillInput(moment(), $fromDate)
  triggerFormChange()
})

$form.addEventListener('change', () => {
  update()
  save()
})

// Start bootstrap-datetimepicker
let $activeInput = $fromDate

const INPUT_ACTIVE_CLASS_NAME = 'active'
const removeActiveClassName = element => element.classList.remove(INPUT_ACTIVE_CLASS_NAME)
const addActiveClassName = element => element.classList.add(INPUT_ACTIVE_CLASS_NAME)

// Update datetimepicker value by focusing inputs
$form.querySelectorAll('input').forEach(element => {
  element.addEventListener('focus', ({target}) => {
    $activeInput = target
    target.closest('.js-form__inputs').querySelectorAll(`.${INPUT_ACTIVE_CLASS_NAME}`).forEach(removeActiveClassName)
    addActiveClassName(target.closest('.js-form__row'))
    updateDatetimepickerFromDateInput()
  })
})

const updateDateFromDatetimepicker = date => {
  if ($activeInput) {
    fillInput(date, $activeInput)
    triggerFormChange()
  }
}

const updateDatetimepickerFromDateInput = () => {
  if ($activeInput.value) {
    $('#datetimepicker').data('DateTimePicker').date($activeInput.value)
  }
}

// Initialize datetimepicker
$('#datetimepicker')
  .datetimepicker({
    inline: true,
    sideBySide: true,
    format: INPUT_DATETIME_LOCAL_FORMAT,
  })
  .on('dp.change', ({date}) => updateDateFromDatetimepicker(date))
  .on('dp.update', ({viewDate}) => updateDateFromDatetimepicker(viewDate))
