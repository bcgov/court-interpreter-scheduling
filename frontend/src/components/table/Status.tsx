import React from 'react'
import { Button, withStyles } from '@material-ui/core'
import { BookingStatus, BookingStatusColor } from 'constants/interfaces'

const StatusButton = withStyles({
  root: {
    textTransform: 'capitalize',
    backgroundColor: (props: { status: string }) => BookingStatusColor[props.status as BookingStatus] as string,
    borderRadius: '4px',
  }
})(Button)

export default function Status({ status }: { status: string }) {
  return (
    <StatusButton status={status}>
      {status}
    </StatusButton>
  )
}
