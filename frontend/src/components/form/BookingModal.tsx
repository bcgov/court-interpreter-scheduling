import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useAxios from 'axios-hooks'
import useError from 'hooks/useError'

import BookingInputs from 'components/form/inputs/Booking'
import { Schema, Initial } from 'components/form/schemas/booking.schema'
import { ButtonPrimary, ButtonSecondary } from 'components/Buttons'

import SearchContext from 'contexts/SearchContext'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'

import { Formik, FormikProps } from 'formik'

type BookingModalProps = {
  interpreter: any;
  setInterpreter: Function;
}

export default function BookingModal({ interpreter, setInterpreter }: BookingModalProps) {
  const [open, toggle] = useState(false)
  const { state } = useLocation()
  const [{ response, error, loading }, postBooking] = useAxios({ url: '/booking', method: 'POST' }, { manual: true })
  useError({ error, prefix: 'Failed to create a booking.'})

  useEffect(() => {
    toggle(interpreter !== null)
  }, [interpreter])

  useEffect(() => {
    if ([200, 201].some((status) => status === response?.status)) setInterpreter(null)
  }, [response])

  return (
    <SearchContext.Consumer>
      {({ search }) => (
        <Dialog open={open} maxWidth='xl'>
          <Formik
            initialValues={{
              ...Initial,
              ...state?.booking,
              language: state?.booking?.language?.name || search.language
            }}
            validationSchema={Schema}
            onSubmit={async (values) => {
              if (state?.booking) {
                await postBooking({
                  url: `/booking/${state.booking.id}`,
                  method: 'PATCH',
                  data: values,
                })
              } else {
                await postBooking({
                  data: {
                    ...values,
                    dates: search.dates,
                    interpreterId: interpreter.id,
                  }
                })
              }
              return
            }}
          >
            {({ handleSubmit, isSubmitting }: FormikProps<any>) => (
              <>
                <DialogTitle>
                  <Grid container justify='space-between'>
                    <Grid item xs={11}>
                      <Typography variant='h6' color='primary'>
                        Court Interpreter Request
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <CloseIcon onClick={() => setInterpreter(null)} className='right pointer' />
                    </Grid>
                  </Grid>
                </DialogTitle>

                <Divider variant='middle' />

                <DialogContent>
                  <Box mt={2} mb={2}>
                    <Typography variant='h4'>
                      {interpreter?.firstName} {interpreter?.lastName} (Level {interpreter?.languages[0].level})
                    </Typography>
                  </Box>
                  <BookingInputs interpreter={interpreter} search={search} />
                  {error && (
                    <Box p={2} mt={2}>
                      <span>{error.message}</span>
                    </Box>
                  )}
                </DialogContent>

                <Divider variant='middle' />

                <DialogActions style={{ marginTop: '2rem', marginBottom: '1rem', paddingLeft: '24px', paddingRight: '24px' }}>
                  <Grid container justify='space-between'>
                    <Grid item xs={10}>
                      <ButtonSecondary
                        variant='outlined'
                        onClick={() => setInterpreter(null)}
                      >
                        Cancel
                      </ButtonSecondary>
                    </Grid>
                    <Grid item xs={2}>
                      <ButtonPrimary
                        className='right'
                        variant='contained'
                        onClick={() => handleSubmit()}
                        disabled={isSubmitting || loading}
                      >
                        Create Booking
                      </ButtonPrimary>
                    </Grid>
                  </Grid>
                </DialogActions>
              </>
            )}
          </Formik>
        </Dialog>
      )}
    </SearchContext.Consumer>
  )
}
