import React, { useState } from 'react'
import { Box } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import BaseTable from 'components/table/Base'
import DateTimeCell from 'components/table/DateTimeCell'
import StatusButton from 'components/table/Status'

import EditBookingModal from 'components/form/EditBookingModal'

export default function BookingsTable({ data }: { data: Array<any> }) {

  const [booking, setBooking] = useState()
  const [interpreter, setInterpreter] = useState()

  return (
    <Box mt={4}>
      <BaseTable
        data={data}
        columns={[
          { render: (row: any) => <DateTimeCell date={row.date} />, title: 'Date & Time' },
          { field: 'file', title: 'Court File Number' },
          { field: 'caseName', title: 'Case Name' },
          { render: (row: any) => <span className='linkSpan pointer' onClick={() => setInterpreter(row.interpreterId)}>{row.interpreterName}</span>, title: 'Interpreter' },
          { render: (row: any) => <StatusButton status={row.isBooked ? 'Booked' : 'Pending'} />, title: 'Status' },
          { field: 'comments', title: 'Comment' },
          { render: (row: any) => <EditIcon className='pointer' onClick={() => setBooking(row)} />, align: 'right' }
        ]}
      />

      {/* TODO: create a popover for when an interpreter has been selected to show interpreter details */}
      {/* ?: will this require an api call or a join on the bookings GET endpoint? */}
      <EditBookingModal booking={booking} setBooking={setBooking} />
    </Box>
  )
}
