import React from 'react'
import { Button, withStyles } from '@material-ui/core'

const StatusButton = withStyles({
  root: {
    textTransform: 'capitalize',
    backgroundColor: (props: { status: string }) => props.status === 'Pending' ? '#FF8686' : '#58CB7D',
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
