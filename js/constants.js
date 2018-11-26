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

export {
  INPUT_DATETIME_LOCAL_FORMAT,
  DAYS_IN_WEEK,
  MEASUREMENT,
  MEASUREMENT_NAME,
  MEASUREMENTS,
}
