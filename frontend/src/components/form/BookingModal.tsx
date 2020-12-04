import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useAxiosPost } from 'hooks/axios'
import useError from 'hooks/useError'

import BookingInputs from 'components/form/inputs/Booking'
import { Schema, Initial } from 'components/form/schemas/booking.schema'
import { ButtonPrimary, ButtonSecondary } from 'components/Buttons'

import SearchContext from 'contexts/SearchContext'
import { Interpreter, Booking } from 'constants/interfaces'

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
  interpreter?: Interpreter;
  setInterpreter: Function;
}

interface LocationState {
  booking: Booking;
}

export default function BookingModal({ interpreter, setInterpreter }: BookingModalProps) {
  const [open, toggle] = useState(false)
  const { state } = useLocation<LocationState>()
  const history = useHistory()
  const [{ response, error, loading }, postBooking] = useAxiosPost({ url: '/booking' }, { manual: true })
  useError({ error, prefix: 'Failed to create a booking.'})

  useEffect(() => {
    toggle(!!interpreter)
  }, [interpreter])

  useEffect(() => {
    if ([200, 201].some((status) => status === response?.status)) {
      setInterpreter(null)
      history.push('/booking')
    }
  }, [response])

  return (
    <SearchContext.Consumer>
      {({ search }) => (
        <Dialog open={open} maxWidth='xl'>
          <Formik
            initialValues={{
              ...Initial,
              ...state?.booking,
              language: state?.booking?.language?.languageName || search.language,
            }}
            validationSchema={Schema}
            onSubmit={async (values) => {
              if (state?.booking) {
                await postBooking({
                  url: `/booking/${state.booking.id}`,
                  method: 'PATCH',
                  data: {
                    ...values,
                    interpreterId: interpreter?.id,
                  },
                })
              } else {
                await postBooking({
                  data: {
                    ...values,
                    dates: search.dates,
                    interpreterId: interpreter?.id,
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
                      <CloseIcon onClick={() => setInterpreter()} className='right pointer' />
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
                </DialogContent>

                <Divider variant='middle' />

                <DialogActions style={{ marginTop: '2rem', marginBottom: '1rem', paddingLeft: '24px', paddingRight: '24px' }}>
                  <Grid container justify='space-between'>
                    <Grid item xs={10}>
                      <ButtonSecondary
                        variant='outlined'
                        onClick={() => setInterpreter()}
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
                        {state?.booking ? 'Update Booking' : 'Create Booking'}
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
