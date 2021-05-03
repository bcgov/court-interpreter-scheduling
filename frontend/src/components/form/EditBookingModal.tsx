import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAxiosPatch } from 'hooks/axios'
import useError from 'hooks/useError'

import { StyledButton, ButtonSecondary, BookingButton } from 'components/Buttons'
import ChangeLog from 'components/ChangeLog'
import BookingInputs from 'components/form/inputs/Booking'
import { Schema, Initial } from 'components/form/schemas/booking.schema'

import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tab from '@material-ui/core/Tab'
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList'
import TabPanel from '@material-ui/lab/TabPanel';

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

  const history = useHistory()

  const [open, toggleOpen] = useState(false)
  const [view, toggleView] = useState('schedule')
  const [{ response, loading, error }, editBooking] = useAxiosPatch({ url: '/booking' }, { manual: true })

  useError({ error, prefix: 'Failed to update booking.' })

  useEffect(() => {
    toggleOpen(!!booking)
  }, [booking])

  useEffect(() => {
    if (response?.status === 200) {
      toggleOpen(false)
      refetch()
    }
  }, [response, refetch])

  const editInterpreter = () => {
    history.push('/create', { booking })
  }

  return !booking ? null : (

    <Dialog open={open} maxWidth='xl' fullWidth>
      <Formik
        initialValues={{
          ...Initial,
          ...booking,
          language: booking?.language,
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
                  <CloseIcon className='right pointer' onClick={() => setBooking()} />
                </Grid>
              </Grid>
            </DialogTitle>

            <Divider variant='middle' />

            <DialogContent>

              <Box mt={2} mb={2}>
                <Typography variant='h4'>
                  {booking.interpreter?.firstName} {booking.interpreter?.lastName} (Level {booking.interpreter?.languages[0].level}) <BookingButton onClick={editInterpreter}>Edit</BookingButton>
                </Typography>
              </Box>

              <TabContext value={view}>

                <TabList indicatorColor="primary" onChange={(e, v) => toggleView(v)} aria-label="tabs to toggle between booking details and changes history">
                  <Tab label="Schedule details" id="schedule-details-tab" value="schedule" />
                  <Tab label="Update history" id="update-history-tab" value="changes" />
                </TabList>

                <TabPanel value="schedule">
                  <BookingInputs edit={true} interpreter={booking.interpreter} booking={booking} />
                </TabPanel>
                <TabPanel value="changes">
                  <ChangeLog events={booking.events} />
                </TabPanel>

              </TabContext>

            </DialogContent>

            <Divider variant='middle' />

            <DialogActions style={{ marginTop: '1rem', marginBottom: '1rem', paddingLeft: '24px', paddingRight: '24px' }}>
              <Grid container justify='space-between'>
                <Grid item xs={10}>
                  <ButtonSecondary
                    variant='outlined'
                    onClick={() => setBooking()}
                  >
                    Cancel
                  </ButtonSecondary>
                </Grid>
                <Grid item xs={2}>
                  <StyledButton
                    className='right'
                    variant='contained'
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting || loading}
                  >
                    Update Booking
                  </StyledButton>
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  )
}
