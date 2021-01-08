import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { Dates } from 'components/form/inputs/Booking'
import { BookingDate } from 'constants/interfaces'

export default function EditBookingDates({ dates }: { dates: BookingDate[] }) {
  const [edit, toggle] = useState(false)
  return (
    <Grid item xs={12}>
      {edit ? (
        <span onClick={() => toggle(!edit)} className='linkSpan pointer'>Edit Mode ON</span>
      ) : (
        <>
          <Dates dates={dates} />
          <Grid container>
            <Box mt={2}>
              <span onClick={() => toggle(!edit)} className='linkSpan pointer'>Edit Booking Dates</span>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  )
}
