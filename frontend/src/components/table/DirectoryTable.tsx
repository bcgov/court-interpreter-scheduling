import React, { useState } from 'react'
import { Box } from '@material-ui/core'

import { Interpreter, Language, Level } from 'constants/interfaces'

import BaseTable from 'components/table/Base'
import Calendar from 'components/calendar/DirectoryCalendar'
import ViewToggle from 'components/calendar/ViewToggle'
import BookingModal from 'components/form/BookingModal'
import BookingButton from 'components/table/BookingButton'

const getValueFromLanguages = (
  language: string | undefined,
  languages: Language[],
  field: 'level' | 'languageName',
): string | Level => {
  if (!language) return languages[0][field]
  const activeLanguage = languages.find((l: Language) => l.languageName.toUpperCase() === language.toUpperCase())
  return activeLanguage ? activeLanguage[field] : languages[0][field]
}

export default function DirectoryTable({ data, disabled, language }: { data: Interpreter[], disabled: boolean, language?: string }) {

  const [interpreter, setInterpreter] = useState()
  const [view, setView] = useState('list')

  return (
    <Box mt={8}>
      {!disabled && <ViewToggle view={view} setView={setView} />}
      {
        view === 'list' ?
          <BaseTable
            data={data}
            columns={[
              { title: 'Name', render: (row: any) => `${row.firstName} ${row.lastName}`, },
              { title: 'Phone', field: 'phone', },
              { title: 'Email', field: 'email', },
              { title: 'Language', render: (row: any) => getValueFromLanguages(language, row.languages, 'languageName') },
              { title: 'Level', render: (row: any) =>  getValueFromLanguages(language, row.languages, 'level') },
              { render: (row: any) => <BookingButton disabled={disabled} onClick={() => setInterpreter(row)} />, align: 'right' }
            ]}
          /> : <Calendar setInterpreter={setInterpreter} interpreters={data} />
        }
      <BookingModal interpreter={interpreter} setInterpreter={setInterpreter} />
    </Box>
  )
}
