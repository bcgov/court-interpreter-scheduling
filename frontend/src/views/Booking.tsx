import React, { useEffect } from 'react'
import {
  Box,
  CircularProgress,
} from '@material-ui/core'
import useAxios from 'axios-hooks'

import BookingsTable from 'components/table/BookingsTable'
import BookingsSearch from 'components/form/BookingsSearch'
import useError from 'hooks/useError'

const Booking = () => {
  const [{ data: bookings, error, loading }, getBookings] = useAxios('/booking')
  useError({ error, prefix: 'Failed to load bookings.' })
  useEffect(() => {
    getBookings()
  }, [])
  return (
    <Box px='150px'>
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
    </Box>
  )
}
export default Booking
