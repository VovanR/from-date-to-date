const $form = document.getElementById('form')
const $fromDate = document.getElementById('from-date')
const $toDate = document.getElementById('to-date')

const $result = document.getElementById('result-text')
const $resultStat = document.getElementById('result-list')

const $resultFoo = document.getElementById('result-foo-text')
const $resultFooStat = document.getElementById('result-foo-list')


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
const measurements = [
  MEASUREMENT.years,
  MEASUREMENT.months,
  MEASUREMENT.weeks,
  MEASUREMENT.days,
  MEASUREMENT.hours,
  MEASUREMENT.minutes,
  MEASUREMENT.seconds,
  MEASUREMENT.milliseconds,
]


const pluralize = (word, count) => count > 1 ? `${word}s` : word

const createList = (arr) => arr.length > 0 ? `<ul><li>${arr.join('</li><li>')}</ul></li>` : ''


class FromDate {
  constructor({from, to}) {
    this.update({from, to})
  }

  toJSON() {
    return measurements.reduce((acc, measurement) => ({
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

    return measurements.reduce((acc, measurement) => {
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
        return duration.days()
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
    const result = measurements.reduce((acc, measurement) => {
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

  renderResultStat() {
    return this._renderResultStatList(this.toDurationJSON())
  }
  renderResultFooStat() {
    return this._renderResultStatList(this.toJSON())
  }
  _renderResultStatList(stat) {
    return createList(measurements.reduce((acc, measurement) => {
      const value = stat[measurement]
      if (value) {
        acc.push(`${measurement}: ${value.toLocaleString()}`)
      }
      return acc
    }, []))
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
    $resultStat.innerHTML = this.renderResultStat()

    $resultFoo.value = this.toFormattedFooString()
    $resultFooStat.innerHTML = this.renderResultFooStat()
  }
}


const fromDate = new FromDate({
  from: $fromDate.value,
  to: $toDate.value,
})


// let canPlay = false

const canPlay = () => {
  return ($fromDate.value && !$toDate.value) || (!$fromDate.value && $toDate.value)
}

// setInterval(update)

function step() {
  if (canPlay()) {
    update()
  }
  // start();
}
const start = () => window.requestAnimationFrame(step)
// const stop = () => canPlay = false


const update = () => {
  fromDate.update({
    from: $fromDate.value,
    to: $toDate.value,
  })
  start()
}

update()

document.getElementById('from-now-button').addEventListener('click', () => {
  $fromDate.value = moment().format('YYYY-MM-DDTHH:mm:ss')
  $form.dispatchEvent(new Event('change'))
})

$form.addEventListener('change', () => {
  update()
})
