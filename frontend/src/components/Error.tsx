import React, { useEffect, useState, useContext } from 'react'
import ErrorContext from 'contexts/ErrorContext'
import Snackbar from '@material-ui/core/Snackbar'
import Alert, { AlertProps } from '@material-ui/lab/Alert'

type ErrorProps = {
  message?: string;
  prefix?: string;
  severity?: AlertProps['severity'];
}

export default function Error ({ prefix, severity = 'error' }: ErrorProps) {
  const [open, toggle] = useState(false)
  const { message, updateErrorContext } = useContext(ErrorContext)

  useEffect(() => {
    toggle(!!message)
  }, [message])

  if (!message) return null

  return (
    <Snackbar open={open} onClose={() => updateErrorContext(null)} autoHideDuration={6000}>
      <Alert severity={severity}>
        {prefix} {message}
      </Alert>
    </Snackbar>
  )
}
