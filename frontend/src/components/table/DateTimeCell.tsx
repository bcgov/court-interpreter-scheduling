import React from 'react';
import dayjs from 'dayjs'

export default function DateTimeCell({ date }: { date: string }) {
  return (
    <div>
      <b>{dayjs(date).format('ddd, MMM DD')}</b>
      <br />
      <span>{dayjs(date).format('hh:mm A')}</span>
    </div>
  )
}
