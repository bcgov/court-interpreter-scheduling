import React from 'react'
import {
  Box,
  CircularProgress,
} from '@material-ui/core'
import BookingsTable from 'components/table/BookingsTable'
import BookingsSearch from 'components/form/BookingsSearch'
import useAxios from 'axios-hooks'

const Booking = () => {
  /* TODO add API call for GET booking */
  const [{ data: bookings, error, loading }, refetch] = useAxios('/booking')
  const [{ data: searchResults, loading: searchLoading }, search] = useAxios({
    url: '/booking/search',
    method: 'POST'
  }, {
    manual: true,
  })

  return (
    <Box px='150px'>
      <BookingsSearch getSearchResults={search} />
      {error && <p>Failed to fetch bookings. {error.message}</p>}
      {
        (loading || searchLoading)
          ?
            <Box mt={10}>
              <CircularProgress />
            </Box>
          :
            <BookingsTable
              refetch={refetch}
              data={searchResults?.data || bookings?.data || []}
            />
      }
    </Box>
  )
}
export default Booking
