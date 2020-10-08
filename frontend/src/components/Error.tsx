import React, { useEffect, useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert, { AlertProps } from '@material-ui/lab/Alert'

type ErrorProps = {
  message?: string;
  prefix?: string;
  severity?: AlertProps['severity'];
}

export default function Error ({ message, prefix, severity = 'error' }: ErrorProps) {
  const [open, toggle] = useState(false)

  useEffect(() => {
    toggle(!!message)
  }, [message])

  return (
    <Snackbar open={open} onClose={() => toggle(false)} autoHideDuration={6000}>
      <Alert severity={severity}>
        {prefix} {message}
      </Alert>
    </Snackbar>
  )
}
