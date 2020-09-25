import React, { useState } from 'react'
import {
  Box,
} from '@material-ui/core'
import Search from '../components/form/directorySearch'
import DirectoryTable from '../components/table/Directory'
import { SearchParams } from '../constants/interfaces'

import DataService from '../data/index'
const data = DataService.interpreters(20)

const Directory = () => {
  const [search, setSearch] = useState<SearchParams>({
    language: '',
    level: [],
    location: 'Abbotsford',
    dates: {}
  })

  return (
    <Box px='150px'>
      <Search handleSearch={(searchObject: SearchParams) => setSearch(searchObject)} />
      <DirectoryTable searchParams={search} data={data} />
    </Box>
  )
}
export default Directory
