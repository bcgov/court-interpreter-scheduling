import React from 'react'
import * as Moment from 'moment'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core'
import { extendMoment } from 'moment-range'
import { BookingDate } from 'constants/interfaces'

const moment = extendMoment(Moment)

type MonthProps = {
  start: number;
  bookings: Array<any>;
}

const DateCell = withStyles({
  root: {
    width: '24px',
    textAlign: 'center',
  },
})(Grid)

const WeekHeader = withStyles({
  root: {
    backgroundColor: '#EEEEEE',
    borderRadius: '4px',
    fontSize: '14px',
    padding: '4px 12px',
  }
})(Grid)

export default function Month ({ start, bookings }: MonthProps) {
  const monthStart = start ? moment().add(start, 'month').startOf('month') : moment().startOf('month')
  const monthEnd = start ? moment().add(start, 'month').endOf('month') : moment().endOf('month')
  const todayDayOfMonth = moment().date()
  const month = moment.range(monthStart, monthEnd)

  const days = Array.from(month.by('day'))
  const firstDay = days[0].day()
  let date = 1
  let weeksArray = []

  for (let i = 0; i < 6; i++) {
    let week = []
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDay) || (date > days.length)) {
        week.push(null)
      } else {
        week.push((start === 0 && todayDayOfMonth > date) ? null : days[date - 1])
        date++
      }
    }
    weeksArray.push(week)
  }
  return (
    <>
      <WeekHeader container justify='space-between'>
        <Grid item>M</Grid>
        <Grid item>T</Grid>
        <Grid item>W</Grid>
        <Grid item>T</Grid>
        <Grid item>F</Grid>
        <Grid item>S</Grid>
        <Grid item>S</Grid>
      </WeekHeader>
      {weeksArray.map((w: Array<Moment.Moment | null>) => (
        <Grid container justify='space-between' style={{ fontWeight: 600, padding: '0 4px' }}>
          {w.map((d: Moment.Moment | null) => {
            const booking = d
              ? bookings
                .find(b => b.dates.some((bookingDate: BookingDate) => moment(bookingDate.date).isSame(d, 'day')))
              : false

            const className = booking
              ? booking.dates
                .find((bookingDate: BookingDate) => moment(bookingDate.date).isSame(d, 'day'))?.period
              : ''

            return (
              <DateCell item className={className}>
                {d ? <b>{d.date()}</b> : <div />}
              </DateCell>
            )
          })}
        </Grid>
      ))}
    </>
  )
}
