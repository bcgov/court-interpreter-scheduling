import React, { useState } from 'react';
import { Box } from '@material-ui/core'
import BaseTable from 'components/table/Base'
import BookingModal from 'components/form/BookingModal'
import BookingButton from 'components/table/BookingButton'

export default function DirectoryTable({ data, disabled }: { data: Array<any>, disabled: boolean }) {

  const [interpreter, setInterpreter] = useState()

  return (
    <Box mt={4}>
      <BaseTable
        data={data}
        columns={[
          { title: 'Name', render: (row: any) => `${row.firstName} ${row.lastName}`, },
          { title: 'Phone', field: 'phone', },
          { title: 'Email', field: 'email', },
          { title: 'Language', render: (row: any) => `${row.languages[0].language.name}`, },
          { title: 'Level', render: (row: any) => `${row.languages[0].level}`, },
          { render: (row: any) => <BookingButton disabled={disabled} onClick={() => setInterpreter(row)} />, align: 'right' }
        ]}
      />
      <BookingModal interpreter={interpreter} setInterpreter={setInterpreter} />
    </Box>
  )
}
