import React, { useState } from 'react'

import { Grid, Box } from '@material-ui/core'
import BorderColorIcon from '@material-ui/icons/BorderColor'
import AddIcon from '@material-ui/icons/Add'

import BaseTable from 'components/table/Base'
import { StyledIconButton } from 'components/Buttons'
import EditInterpreterModal from 'components/form/EditInterpreterModal'

import { Language, Interpreter } from 'constants/interfaces'
import { fieldSort } from 'util/sort'
import { comments } from 'util/tableHelpers'

export default function DirectoryTable({
  data,
  openCreateModal,
  getInterpreters,
}: {
  data: Array<Interpreter>,
  openCreateModal: Function,
  getInterpreters: Function,
}) {

  const [interpreter, setInterpreter] = useState()

  return (
    <Box mt={8}>
      <BaseTable
        data={data}
        columns={[
          { title: 'Name', render: (row: any) => `${row.firstName} ${row.lastName}`, customSort: fieldSort('lastName') },
          { title: 'Phone', field: 'phone' },
          { title: 'Email', field: 'email' },
          { title: 'Language', render: (row: any) => row.languages.map((language: Language) => <div>{language.languageName}</div>) },
          { title: 'Level', render: (row: any) => row.languages.map((language: Language) => <div>{language.level}</div>) },
          {
            title: 'City',
            field: 'city',
            render: (row: any) => <span>{row.city}</span>,
          },
          {
            title: (
              <StyledIconButton
                className='pointer'
                onClick={() => openCreateModal(true)}
                color='primary'
              >
                <AddIcon />
              </StyledIconButton>
            ),
            sorting: false,
            render: (row: any) => (
              <StyledIconButton
                className='pointer'
                onClick={() => setInterpreter(row)}
                color='primary'
              >
                <BorderColorIcon />
              </StyledIconButton>
            ),
            width: 75,
          }
        ]}
        overrides={{
          detailPanel: (rowData: any) => (
            <Grid container justify='space-around'>
              <Grid item>
                <Box p={1}>
                  <b>Address</b>
                  <br />
                  {`${rowData.address} ${rowData.city} ${rowData.postal}`}
                </Box>
              </Grid>
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
                  <b>Record Check</b>
                  <br />
                  {rowData.criminalRecordCheck}
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
      />
      <EditInterpreterModal
        interpreter={interpreter}
        setInterpreter={setInterpreter}
        refetch={getInterpreters}
      />
    </Box>
  )
}
