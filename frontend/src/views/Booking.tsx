import React, { useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import { useAxiosGet } from 'hooks/axios'

import BookingsTable from 'components/table/BookingsTable'
import BookingsSearch from 'components/form/BookingsSearch'
import ContentBox from 'components/layout/ContentBox'
import useError from 'hooks/useError'

const Booking = () => {
  const [{ data: bookings, error, loading }, getBookings] = useAxiosGet('/booking')
  useError({ error, prefix: 'Failed to load bookings.' })
  return (
    <ContentBox>
      <BookingsSearch getSearchResults={getBookings} />
      {
        loading
          ?
            <Box mt={10}>
              <CircularProgress />
            </Box>
          :
            <BookingsTable
              refetch={getBookings}
              data={bookings?.data || []}
            />
      }
    </ContentBox>
  )
}
export default Booking
