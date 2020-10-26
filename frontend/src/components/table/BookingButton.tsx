import React from 'react'
import { withStyles } from '@material-ui/core'
import Button, { ButtonProps } from '@material-ui/core/Button'

export const StyledButton = withStyles({
  root: {
    backgroundColor: '#E8F3FD',
    color: '#1A5A96',
    borderRadius: '4px',
    width: '95px',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '16px'
  },
})(Button)

export default function BookingButton(props: ButtonProps) {
  return <StyledButton {...props}>Book</StyledButton>
}
