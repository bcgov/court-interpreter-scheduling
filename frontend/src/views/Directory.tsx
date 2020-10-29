import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAxiosGet } from 'hooks/axios'
import useError from 'hooks/useError'

import {
  Box,
  CircularProgress,
} from '@material-ui/core'

import Search from 'components/form/DirectorySearch'
import DirectoryTable from 'components/table/DirectoryTable'

import { Booking, BookingDate, SearchParams } from 'constants/interfaces'
import SearchContext from 'contexts/SearchContext'

interface LocationState {
  booking: Booking;
}

const Directory = () => {
  const { state } = useLocation<LocationState>()
  const [search, setSearch] = useState<SearchParams>({
    language: '',
    level: [],
    // TODO: update with clerk location on login
    city: '',
    dates: []
  })

  const [{ data: interpreters, loading, error }, getInterpreters] = useAxiosGet('/interpreter')
  useError({ error, prefix: 'Failed to load the interpreter directory.' })

  const getSearchResults = async (params: SearchParams) => {
    setSearch(params)
    await getInterpreters({
      url: '/interpreter/search',
      method: 'POST',
      data: params
    })
  }

  useEffect(() => {
    if (state?.booking) {
      const { booking } = state
      getSearchResults({
        language: booking.language?.languageName,
        level: ['1', '2', '3', '4'],
        city: booking.registry || search.city,
        dates: booking.dates.map((d: BookingDate) => ({
          date: d.date,
          period: d.period,
          arrivalTime: d.arrivalTime,
        }))
      })
    }
  }, [])

  return (
    <Box px='150px'>
      <SearchContext.Provider value={{ search, updateSearchContext: setSearch }}>
        <Search getSearchResults={getSearchResults} />
        {
          loading
            ? <Box mt={12}><CircularProgress /></Box>
            : interpreters
            ? <DirectoryTable language={search.language} data={interpreters.data} disabled={!search.dates.length} />
            : null
        }
      </SearchContext.Provider>
    </Box>
  )
}
export default Directory
