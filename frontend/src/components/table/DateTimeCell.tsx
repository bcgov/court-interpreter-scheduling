import React from 'react'
import moment from 'moment'

export default function DateTimeCell({ date }: { date: string }) {
  return (
    <div>
      <b>{moment(date).format('ddd, MMM DD')}</b>
      <br />
      <span>{moment(date).format('hh:mm A')}</span>
    </div>
  )
}
