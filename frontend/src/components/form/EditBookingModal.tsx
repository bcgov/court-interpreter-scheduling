import React, { useState, useEffect } from 'react'
import useAxios from 'axios-hooks'

import { ButtonPrimary, ButtonSecondary } from 'components/Buttons'
import BookingInputs from 'components/form/inputs/Booking'
import { Schema, Initial } from 'components/form/schemas/booking.schema'

import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'

import { Formik, FormikProps } from 'formik'

type BookingModalProps = {
  booking: any;
  setBooking: Function;
  refetch: Function;
}

export default function BookingModal({ booking, setBooking, refetch }: BookingModalProps) {

  const [open, toggleOpen] = useState(!!booking)
  const [{ data, response, error, loading }, editBooking] = useAxios({
    url: '/booking',
    method: 'PATCH',
  }, {
    manual: true
  })

  useEffect(() => {
    toggleOpen(!!booking)
  }, [booking])

  useEffect(() => {
    if (response?.status === 200) {
      toggleOpen(false)
      refetch()
    }
  }, [response])

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
          await editBooking({
            url: `/booking/${booking.id}`,
            data: values,
          })
          return
        }}
      >
        {({ handleSubmit, isSubmitting }: FormikProps<any>) => (
          <>
            <DialogTitle>
              <Grid container justify='space-between'>
                <Grid item xs={11}>
                  <Typography variant='h6' color='primary'>
                    Update Court Interpreter Request
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <CloseIcon className='right pointer' />
                </Grid>
              </Grid>
            </DialogTitle>

            <Divider variant='middle' />

            <DialogContent>
              <Box mt={2} mb={2}>
                <Typography variant='h4'>
                  {booking.interpreter?.firstName} {booking.interpreter?.lastName} (Level {booking.interpreter?.languages[0].level})
                </Typography>
              </Box>
              <BookingInputs interpreter={booking.interpreter} booking={booking} />
              {error && (
                <Box p={2} mt={2}>
                  <span>{error.message}</span>
                </Box>
              )}
            </DialogContent>

            <Divider variant='middle' />

            <DialogActions>
              <Grid container justify='space-between'>
                <Grid item xs={10}>
                  <ButtonSecondary variant='outlined' onClick={() => toggleOpen(false)}>
                    Cancel
                  </ButtonSecondary>
                </Grid>
                <Grid item xs={2}>
                  <ButtonPrimary className='right' variant='contained' onClick={() => handleSubmit()} disabled={isSubmitting}>
                    Update Booking
                  </ButtonPrimary>
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  )
}
