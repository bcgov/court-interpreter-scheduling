import React from 'react'
import {
  Box,
  CircularProgress,
} from '@material-ui/core'
import useAxios from 'axios-hooks'

import BookingsTable from 'components/table/BookingsTable'
import BookingsSearch from 'components/form/BookingsSearch'
import Error from 'components/Error'

const Booking = () => {
  const [{ data: bookings, error, loading }, getBookings] = useAxios('/booking')

  return (
    <Box px='150px'>
      <BookingsSearch getSearchResults={getBookings} />
      <Error message={error?.message} prefix='Failed to fetch bookings.' />
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
    </Box>
  )
}
export default Booking
