import React, { useEffect, useState, createContext } from 'react'
import {
  Box,
  CircularProgress,
} from '@material-ui/core'
import useAxios from 'axios-hooks'
import queryString from 'query-string'

import Search from 'components/form/DirectorySearch'
import DirectoryTable from 'components/table/DirectoryTable'
import { SearchParams } from 'constants/interfaces'

export const SearchContext = createContext<{ search: SearchParams, updateSearchContext: Function }>({
  search: {
    language: '',
    level: [],
    city: '',
    dates: []
  },
  updateSearchContext: () => {}
})

const Directory = () => {
  const [search, setSearch] = useState<SearchParams>({
    language: '',
    level: [],
    // TODO: update with clerk location on login
    city: 'Victoria',
    dates: []
  })

  const [{ data: interpreters, loading, error }, getInterpreters] = useAxios('/interpreter')

  const getSearchResults = async (params: SearchParams) => {
    setSearch(params)
    await getInterpreters({
      url: '/interpreter/search',
      method: 'POST',
      data: params
    })
  }

  return (
    <Box px='150px'>
      <SearchContext.Provider value={{ search, updateSearchContext: setSearch }}>
        <Search getSearchResults={getSearchResults} />
        {
          loading
            ? <Box mt={12}><CircularProgress /></Box>
            : error
            ? <Box p='120'>{error.message}</Box>
            : interpreters
            ? <DirectoryTable data={interpreters.data} disabled={!search.dates.length} />
            : null
        }
      </SearchContext.Provider>
    </Box>
  )
}
export default Directory
