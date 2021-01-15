import React, { useState } from 'react'
import { Box, Grid } from '@material-ui/core'

import { Interpreter, Language } from 'constants/interfaces'
import { fieldSort, arrayFieldSort, levelSort, languageArraySort } from 'util/sort'
import { comments } from 'util/tableHelpers'

import BaseTable from 'components/table/Base'
import Calendar from 'components/calendar/DirectoryCalendar'
import ViewToggle from 'components/calendar/ViewToggle'
import BookingModal from 'components/form/BookingModal'
import BookingButton from 'components/table/BookingButton'

export default function DirectoryTable({
  data,
  disabled,
  language,
}: {
  data: Interpreter[],
  disabled: boolean,
  language?: string,
}) {

  const [interpreter, setInterpreter] = useState()
  const [view, setView] = useState('list')

  return (
    <Box mt={8}>
      {!disabled && <ViewToggle view={view} setView={setView} />}
      {
        view === 'list' ?
          <BaseTable
            data={language ? levelSort(data, language) : data}
            columns={[
              {
                title: 'Name',
                render: (row: any) => `${row.firstName} ${row.lastName}`, customSort: fieldSort('lastName')
              },
              {
                title: 'Phone',
                render: (row: any) => (
                  <div>
                    <div>{row.phone}</div>
                    {row.businessPhone && row.businessPhone !== row.phone && <div>{row.businessPhone} <small>home</small></div>}
                    {row.homePhone && row.homePhone !== row.phone && <div>{row.homePhone} <small>work</small></div>}
                  </div>
                )
              },
              { title: 'Email', field: 'email' },
              {
                title: 'Language',
                render: (row: any) =>
                  row.languages.map(
                    (l: Language) =>
                      <div className={language && l.languageName.toUpperCase().includes(language?.toUpperCase()) ? 'bold' : ''}>
                        {l.languageName}  {l.level}
                      </div>
                  ),
                customSort: language ? languageArraySort(language, 'level') : arrayFieldSort('languages', 0, 'languageName')
              },
              {
                title: 'Address',
                render: (row: any) => (
                  <span>
                    {row.address}
                    <br /> {row.city} <a target='_blank' rel='noopener noreferrer' href={encodeURI(`https://www.google.com/maps/dir/?api=1&origin=${row.address.trim()},${row.city.trim()},${row.postal}&destination=${row.city} BC courthouse`)}>{row.postal}</a>
                  </span>
                ),
                customSort: fieldSort('city')
              },
              {
                render: (row: any) => <BookingButton disabled={disabled} onClick={() => setInterpreter(row)} />,
                align: 'right'
              }
            ]}
            overrides={{
              detailPanel: (rowData: any) => (
                <Grid container justify='space-around'>
                  <Grid item>
                    <Box p={1}>
                      <b>Supplier #</b>
                      <br />
                      {rowData.supplier}
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box p={1}>
                      <b>GST #</b>
                      <br />
                      {rowData.gst}
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box p={1}>
                      <b>Comments</b>
                      <br />
                      {comments(rowData.comments, rowData.languages)}
                    </Box>
                  </Grid>
                </Grid>
              )
            }}
          /> : <Calendar setInterpreter={setInterpreter} interpreters={data} />
        }
      <BookingModal interpreter={interpreter} setInterpreter={setInterpreter} />
    </Box>
  )
}
