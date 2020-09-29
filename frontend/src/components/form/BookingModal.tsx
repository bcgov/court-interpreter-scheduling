import React, { useState, useEffect } from 'react'
import useAxios from 'axios-hooks'
import BookingInputs from './inputs/Booking'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import { Formik, FormikProps } from 'formik'

type BookingModalProps = {
  interpreter: any;
  setInterpreter: Function;
}

export default function BookingModal({ interpreter, setInterpreter }: BookingModalProps) {

  const [open, toggleOpen] = useState(!!interpreter)
  const [{ data, response, error, loading }, postBooking] = useAxios({ url: '/booking', method: 'POST' }, { manual: true })

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
        onSubmit={(values) => {
          postBooking({ data: values })
        }}
      >
        {({ handleSubmit, isSubmitting }: FormikProps<any>) => (
          <>
            <DialogTitle>
              <Typography variant='h4'>
                Court Interpreter Request
              </Typography>
              <Typography variant='h4'>
                {interpreter?.firstName} {interpreter?.lastName} (Level {interpreter?.language[0].level}) <Button>Edit</Button>
              </Typography>
            </DialogTitle>
            <DialogContent>
              <BookingInputs />
            </DialogContent>
            <DialogActions>
              <Button variant='outlined' onClick={() => toggleOpen(false)} color='secondary'>
                Cancel
              </Button>
              <Button variant='contained' onClick={() => handleSubmit()} color='primary' disabled={isSubmitting}>
                Create Booking
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  )
}
