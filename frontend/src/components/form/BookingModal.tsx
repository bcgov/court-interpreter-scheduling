import React, { useState, useEffect } from 'react'

import BookingInputs from './inputs/Booking'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import {
  StyledFormControl,
  StyledLabel,
  StyledTextField,
  StyledFormLabel,
  StyledNativeSelect,
  StyledSelectInput,
  GridRow,
} from './inputs/DirectoryInputs'

import { Field, Formik, FormikProps } from 'formik'

type BookingModalProps = {
  interpreter: any;
  setInterpreter: Function;
}

export default function BookingModal({ interpreter, setInterpreter }: BookingModalProps) {

  const [open, toggleOpen] = useState(!!interpreter)

  useEffect(() => {
    toggleOpen(!!interpreter)
  }, [interpreter])

  return (

    <Dialog open={open} onClose={() => setInterpreter(null)} maxWidth={'xl'}>
      <Formik
        initialValues={{
          name: '',
          registry: '',
          file: '',
          interpretFor: '',
          caseName: '',
          requestedBy: '',
          federal: '',
          language: '',
          reason: '',
          prosecutor: '',
          comment: '',
        }}
        onSubmit={(values) => console.dir(values)}
      >
        {({ handleSubmit }: FormikProps<any>) => (
          <>
            <DialogTitle>
              <Typography variant='h4'>
                Court Interpreter Request
              </Typography>
              <Typography variant='h4'>
                {interpreter?.name} (Level {interpreter?.level}) <Button>Edit</Button>
              </Typography>
            </DialogTitle>
            <DialogContent>
              <BookingInputs />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => toggleOpen(false)} color='secondary'>
                Cancel
              </Button>
              <Button onClick={() => toggleOpen(false)} color='primary'>
                Subscribe
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  )
}
