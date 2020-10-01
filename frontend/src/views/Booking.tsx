import React from 'react'
import {
  Box,
} from '@material-ui/core'
import BookingsTable from 'components/table/BookingsTable'
import useAxios from 'axios-hooks'
import DataService from 'data/index'

const bookings = DataService.bookings(20)

const Booking = () => {
  /* TODO add API call for GET booking */
  /* const [{ data: bookings, error, loading }] = useAxios('/booking') */

  return (
    <Box px='150px'>
      <BookingsTable data={bookings} />
    </Box>
  )
}
export default Booking
