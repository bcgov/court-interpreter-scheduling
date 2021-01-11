import React, { useEffect, useState } from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { useField } from 'formik'

import Range from 'components/form/Range'
import SearchDates from 'components/form/SearchDates'
import { Dates } from 'components/form/inputs/Booking'
import { BookingDate } from 'constants/interfaces'

export default function EditBookingDates({ dates }: { dates?: BookingDate[] }) {
  const [edit, toggle] = useState(false)
  const [, meta] = useField('dates')
  return (
    <Grid item xs={12}>
      {edit ? (
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Range />
          </Grid>
          <Grid item xs={12}>
            <SearchDates values={{ dates: meta.value }} />
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <span onClick={() => toggle(!edit)} className='linkSpan pointer'>Cancel</span>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Grid container>
          <Dates dates={dates} />
          <Box mt={2}>
            <span onClick={() => toggle(!edit)} className='linkSpan pointer'>Edit Booking Dates</span>
          </Box>
        </Grid>
      )}
    </Grid>
  )
}
