import React, { useState, useEffect } from 'react'
import useAxios from 'axios-hooks'
import BookingInputs from './inputs/Booking'
import { Schema, Initial } from './schemas/booking.schema'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import { Formik, FormikProps } from 'formik'

type BookingModalProps = {
  booking: any;
  setBooking: Function;
}

export default function BookingModal({ booking, setBooking }: BookingModalProps) {

  const [open, toggleOpen] = useState(!!booking)
  const [{ data, response, error, loading }, editBooking] = useAxios({ url: '/booking', method: 'POST' }, { manual: true })

  useEffect(() => {
    toggleOpen(!!booking)
  }, [booking])

  return (

    <Dialog open={open} onClose={() => setBooking(null)} maxWidth='xl'>
      <Formik
        initialValues={{
          ...Initial,
          ...booking,
          language: booking?.language?.name,
        }}
        validationSchema={Schema}
        onSubmit={async (values) => {
          await editBooking({ data: values })
          if (response?.status === 201) {
            setBooking(null)
          }
          return
        }}
      >
        {({ handleSubmit, isSubmitting }: FormikProps<any>) => (
          <>
            <DialogTitle>
              <Typography variant='h4'>
                Update Booking
              </Typography>
            </DialogTitle>
            <DialogContent>
              <BookingInputs />
              {error && (
                <Box p='120' mt='20'>
                  <span>{error.message}</span>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button variant='outlined' onClick={() => toggleOpen(false)} color='secondary'>
                Cancel
              </Button>
              <Button variant='contained' onClick={() => handleSubmit()} color='primary' disabled={isSubmitting}>
                Update
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  )
}
