import React, { useState } from 'react'
import {
  Box,
  CircularProgress,
} from '@material-ui/core'
import { useAxiosGet } from 'hooks/axios'
import useError from 'hooks/useError'

import ContentBox from 'components/layout/ContentBox'
import DirectorySearch from 'components/form/DirectorySearch'
import CreateInterpreter from 'components/form/InterpreterModal'
import InterpretersTable from 'components/table/InterpreterDirectoryTable'
import { InterpreterSearchParams } from 'constants/interfaces'
import InterpreterSearchContext from 'contexts/InterpreterSearchContext'

export default function InterpreterDirectory () {
  const [search, setSearch] = useState<InterpreterSearchParams>({
    name: '',
    keywords: '',
    // TODO: update with clerk location on login
    city: 'Victoria',
    language: '',
    level: [],
  })

  const [open, toggle] = useState(false)

  const [{ data: interpreters, loading, error }, getInterpreters] = useAxiosGet('/interpreter')
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
    <ContentBox>
      <InterpreterSearchContext.Provider value={{ search, updateSearchContext: setSearch }}>
        <DirectorySearch getSearchResults={getSearchResults} />
        {
          loading
            ? <Box mt={12}><CircularProgress /></Box>
            : interpreters
            ? <InterpretersTable getInterpreters={getInterpreters} openCreateModal={toggle} data={interpreters.data} />
            : null
        }
      </InterpreterSearchContext.Provider>
      <CreateInterpreter open={open} toggle={toggle} />
    </ContentBox>
  )
}