import React, { useState } from 'react'
import { Box, IconButton, withStyles } from '@material-ui/core'
import BorderColorIcon from '@material-ui/icons/BorderColor'
import BaseTable from 'components/table/Base'
import { StyledIconButton } from 'components/Buttons'
import EditInterpreterModal from 'components/form/EditInterpreterModal'
import { Interpreter } from 'components/form/schemas/interpreter.schema'

export default function InterpretersTable({ data }: { data: Array<Interpreter> }) {

  const [interpreter, setInterpreter] = useState(null)

  return (
    <Box mt={8}>
      <BaseTable
        data={data}
        columns={[
          { title: 'Name', render: (row: any) => `${row.firstName} ${row.lastName}`, },
          { title: 'Phone', field: 'phone', },
          { title: 'Email', field: 'email', },
          { title: 'Language', render: (row: any) => `${row.languages[0].language.name}`, },
          { title: 'Level', render: (row: any) => `${row.languages[0].level}`, },
          {
            render: (row: any) => (
              <StyledIconButton
                className='pointer'
                onClick={() => setInterpreter(row)}
                color='primary'
              >
                <BorderColorIcon />
              </StyledIconButton>
            ),
            align: 'right',
            width: 48,
          }
        ]}
      />
      <EditInterpreterModal interpreter={interpreter} setInterpreter={setInterpreter} refetch={() => console.log('get data again')} />
    </Box>
  )
}
