import React, { useState } from 'react'
import {
  Box,
  CircularProgress,
} from '@material-ui/core'
import useAxios from 'axios-hooks'
import Search from '../components/form/DirectorySearch'
import DirectoryTable from '../components/table/DirectoryTable'
import { SearchParams } from '../constants/interfaces'

const Directory = () => {
  const [search, setSearch] = useState<SearchParams>({
    language: '',
    level: [],
    location: 'Abbotsford',
    dates: {}
  })

  const [{ data: interpreters, response, loading, error }] = useAxios('/interpreter')

  return (
    <Box px='150px'>
      <Search handleSearch={(searchObject: SearchParams) => setSearch(searchObject)} />
      {
        loading
          ? <CircularProgress />
          : error
          ? <span>{error.toJSON()}</span>
          : interpreters
          ? <DirectoryTable searchParams={search} data={interpreters.data} />
          : null
        }
    </Box>
  )
}
export default Directory
