import React, { useState } from 'react';
import { Box } from '@material-ui/core'
import { StyledTable } from 'vaping-regulation-shared-components'
import BookingModal from '../form/BookingModal'
import BookingButton from './BookingButton'

export default function DirectoryTable({ data }: { data: Array<any> }) {

  const [interpreter, setInterpreter] = useState()

  return (
    <Box mt={4}>
    <StyledTable
      data={data}
      columns={[
        { title: 'Name', render: (row: any) => `${row.firstName} ${row.lastName}`, },
        { title: 'Phone', field: 'phone', },
        { title: 'Email', field: 'email', },
        { title: 'Language', render: (row: any) => `${row.language[0].language.name}`, },
        { title: 'Level', render: (row: any) => `${row.language[0].level}`, },
        { render: (row: any) => <BookingButton onClick={() => setInterpreter(row)} />, align: 'right' }
      ]}
      options={{
          pageSize: 10
        }}
      />
      <BookingModal interpreter={interpreter} setInterpreter={setInterpreter} />
    </Box>
  )
}
