/* global moment */

import {ResultStatList} from './result-stat-list.js'
import {
  DAYS_IN_WEEK,
  MEASUREMENT,
  MEASUREMENT_NAME,
  MEASUREMENTS,
} from './constants.js'
import {pluralize} from './utils.js'

const $result = document.getElementById('result-text')
const $resultStat = document.getElementById('result-list')

const $resultFoo = document.getElementById('result-foo-text')
const $resultFooStat = document.getElementById('result-foo-list')

class FromDate {
  constructor({from, to}) {
    /** @type {moment} */
    this.from = null
    /** @type {moment} */
    this.to = null

    this.resultStatList = new ResultStatList()
    this.resultFooStatList = new ResultStatList()

    $resultStat.appendChild(this.resultStatList.getElement())
    $resultFooStat.appendChild(this.resultFooStatList.getElement())

    this.update({from, to})
  }

  toJSON() {
    return MEASUREMENTS.reduce((acc, measurement) => ({
      ...acc,
      [measurement]: this.to.diff(this.from, measurement),
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

export {
  FromDate,
}
