import React, { useState } from 'react'

import { Grid, Box } from '@material-ui/core'
import BorderColorIcon from '@material-ui/icons/BorderColor'
import AddIcon from '@material-ui/icons/Add'

import BaseTable from 'components/table/Base'
import { StyledIconButton } from 'components/Buttons'
import EditInterpreterModal from 'components/form/EditInterpreterModal'

import { Interpreter } from 'constants/interfaces'

export default function InterpretersTable({
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
          { title: 'Name', render: (row: any) => `${row.firstName} ${row.lastName}` },
          { title: 'Phone', field: 'phone' },
          { title: 'Email', field: 'email' },
          { title: 'Language', render: (row: any) => `${row.languages[0].languageName}` },
          { title: 'Level', render: (row: any) => `${row.languages[0].level}` },
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
                  {`${rowData.address} ${rowData.city} ${rowData.postal}`}</Box>
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
                  <b>Comments</b>
                  <br />
                  {rowData.comments}
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
