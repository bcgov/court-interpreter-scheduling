import React, { useState } from 'react';
import { Box } from '@material-ui/core'
import { StyledTable } from 'vaping-regulation-shared-components'
import BookingModal from '../form/BookingModal'
import BookingButton from './BookingButton'
import { SearchParams } from '../../constants/interfaces'

export default function DirectoryTable({ searchParams, data }: { searchParams: SearchParams, data: Array<any> }) {

  const [interpreter, setInterpreter] = useState()

  const applySearchParams = (list: Array<any>) =>
    list.filter(i => searchParams.level.length ? searchParams.level.includes(i.level.toString()) : true)

  return (
    <Box mt={4}>
      <StyledTable
        data={applySearchParams(data)}
        columns={[
          { title: 'Name', field: 'name', },
          { title: 'Phone', field: 'phone', },
          { title: 'Level', field: 'level', },
          { title: 'Email', field: 'emailAddress', },
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
