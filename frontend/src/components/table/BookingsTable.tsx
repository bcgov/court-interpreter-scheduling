import React, { useState } from 'react'
import { Box, IconButton, withStyles } from '@material-ui/core'
import BorderColorIcon from '@material-ui/icons/BorderColor'
import BaseTable from 'components/table/Base'
import DateTimeCell from 'components/table/DateTimeCell'
import StatusButton from 'components/table/Status'
import InterpreterName from 'components/table/InterpreterName'

import EditBookingModal from 'components/form/EditBookingModal'

const StyledIconButton = withStyles({
  root: {
    backgroundColor: '#E8F3FD',
    borderRadius: '4px',
    height: '40px',
    width: '40px',
  }
})(IconButton)

export default function BookingsTable({ data, refetch }: { data: Array<any>, refetch: Function }) {

  const [booking, setBooking] = useState()

  return (
    <Box mt={4}>
      <BaseTable
        data={data}
        columns={[
          { render: (row: any) => <DateTimeCell date={row.date} />, title: 'Date & Time' },
          { field: 'file', title: 'Court File Number' },
          { field: 'caseName', title: 'Case Name' },
          { render: (row: any) => <InterpreterName interpreter={row.interpreter} />, title: 'Interpreter' },
          { render: (row: any) => <StatusButton status={row.status} />, title: 'Status' },
          { field: 'comment', title: 'Comment' },
          {
            render: (row: any) => (
              <StyledIconButton
                className='pointer'
                onClick={() => setBooking(row)}
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
      <EditBookingModal refetch={refetch} booking={booking} setBooking={setBooking} />
    </Box>
  )
}
