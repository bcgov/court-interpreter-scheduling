import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import { useAxiosGet } from 'hooks/axios'

import BookingsTable from 'components/table/BookingsTable'
import BookingsSearch from 'components/form/BookingsSearch'
import ContentBox from 'components/layout/ContentBox'
import useError from 'hooks/useError'
import BookingSearchContext from 'contexts/BookingSearchContext'
import { BookingSearchParams } from 'constants/interfaces'

const Booking = () => {
  const [{ data: bookings, error, loading }, getBookings] = useAxiosGet('/booking')
  useError({ error, prefix: 'Failed to load bookings.' })
  const [search, setSearch] = React.useState<BookingSearchParams>({
    file: '',
    interpreter: '',
    locationId: undefined,
    dates: [],
  });
  return (
    <ContentBox>
      <BookingSearchContext.Provider
       value={{search, updateSearchContext: setSearch}}
       >
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
      </BookingSearchContext.Provider>
    </ContentBox>
  )
}
export default Booking
