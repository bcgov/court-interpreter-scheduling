import React, { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
} from '@material-ui/core'
import useAxios from 'axios-hooks'
import queryString from 'query-string'

import Search from '../components/form/DirectorySearch'
import DirectoryTable from '../components/table/DirectoryTable'
import { SearchParams } from '../constants/interfaces'

const Directory = () => {
  const [search, setSearch] = useState<SearchParams>({
    language: '',
    level: [],
    city: '',
  })

  const [{ data: interpreters, loading, error }, getInterpreters] = useAxios('/interpreter', { manual: true })

  useEffect(() => {
    getInterpreters({ url: `/interpreter?${queryString.stringify(search, { arrayFormat: 'bracket' })}` })
  }, [search, getInterpreters])

  return (
    <Box px='150px'>
      <Search handleSearch={(searchObject: SearchParams) => setSearch(searchObject)} />
      {
        loading
          ? <Box mt='20'><CircularProgress /></Box>
          : error
          ? <Box p='120'>{error.message}</Box>
          : interpreters
          ? <DirectoryTable  data={interpreters.data} />
          : null
        }
    </Box>
  )
}
export default Directory
