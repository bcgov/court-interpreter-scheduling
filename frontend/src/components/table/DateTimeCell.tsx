import React from 'react'
import moment from 'moment'

export default function DateTimeCell({ date, arrival }: { date: string, arrival: string }) {
  return (
    <div>
      <b>{moment(date).format('ddd, MMM DD')}</b>
      <br />
      <span>{moment(arrival || date, ['hh:mm:ss', moment.ISO_8601]).format('hh:mm A')}</span>
    </div>
  )
}
