import React, { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
} from '@material-ui/core'
import useAxios from 'axios-hooks'
import useError from 'hooks/useError'

import InterpreterSearch from 'components/form/InterpreterSearch'
import CreateInterpreter from 'components/form/InterpreterModal'
import InterpretersTable from 'components/table/InterpretersTable'
import { InterpreterSearchParams } from 'constants/interfaces'
import InterpreterSearchContext from 'contexts/InterpreterSearchContext'

const Directory = () => {
  const [search, setSearch] = useState<InterpreterSearchParams>({
    language: '',
    level: [],
    // TODO: update with clerk location on login
    city: 'Victoria',
  })

  const [open, toggle] = useState(true)

  const [{ data: interpreters, loading, error }, getInterpreters] = useAxios('/interpreter')
  useError({ error, prefix: 'Failed to load the interpreter directory.' })

  const getSearchResults = async (params: InterpreterSearchParams) => {
    setSearch(params)
    await getInterpreters({
      url: '/interpreter/search',
      method: 'POST',
      data: params
    })
  }

  return (
    <Box px='150px'>
      <InterpreterSearchContext.Provider value={{ search, updateSearchContext: setSearch }}>
        <InterpreterSearch openCreateModal={toggle} getSearchResults={getSearchResults} />
        {
          loading
            ? <Box mt={12}><CircularProgress /></Box>
            : interpreters
            ? <InterpretersTable data={interpreters.data} />
            : null
        }
      </InterpreterSearchContext.Provider>
      <CreateInterpreter open={open} toggle={toggle} />
    </Box>
  )
}
export default Directory
