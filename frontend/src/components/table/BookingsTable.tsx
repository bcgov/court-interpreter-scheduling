import React, { useState } from 'react';
import { Box, IconButton, withStyles } from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import GetAppIcon from '@material-ui/icons/GetApp';

import BaseTable from 'components/table/Base';
import DateTimeCell from 'components/table/DateTimeCell';
import StatusButton from 'components/table/Status';
import InterpreterName from 'components/table/InterpreterName';
import EditBookingModal from 'components/form/EditBookingModal';

import { Booking } from 'constants/interfaces';
import { useAxiosFileGet } from 'hooks/axios';

const StyledIconButton = withStyles({
  root: {
    backgroundColor: '#E8F3FD',
    borderRadius: '4px',
    height: '40px',
    width: '40px',
  },
})(IconButton);

export default function BookingsTable({
  data,
  refetch,
}: {
  data: Booking[];
  refetch: Function;
}) {
  const [booking, setBooking] = useState();
  const [
    { data: fileGetData, error, loading },
    downloadExcel,
  ] = useAxiosFileGet({ url: '/booking/export' }, { manual: true });

  return (
    <Box mt={4}>
      <BaseTable
        data={data}
        columns={[
          {
            render: (row: any) => (
              <DateTimeCell
                date={row.dates[0].date}
                arrival={row.dates[0].arrivalTime}
              />
            ),
            title: 'Date & Time',
          },
          { field: 'file', title: 'Court File Number' },
          { field: 'caseName', title: 'Case Name' },
          { field: 'language', title: 'Language' },
          {
            render: (row: any) => (
              <InterpreterName interpreter={row.interpreter} />
            ),
            title: 'Interpreter',
          },
          {
            render: (row: any) => <StatusButton status={row.status} />,
            title: 'Status',
          },
          { field: 'comment', title: 'Comment' },
          {
            render: (row: any) => (
              <>
                <StyledIconButton
                  className="pointer"
                  onClick={async () => {
                    const file = await downloadExcel({
                      url: `/booking/export/${row.id}`,
                    });

                    const url = window.URL.createObjectURL(
                      new Blob([file.data])
                    );
                    const link = document.createElement('a');
                    link.download = `booking_${Date.now()}.xlsx`;
                    link.href = url;
                    link.click();
                    link.href = '';
                  }}
                  color="primary"
                >
                  <GetAppIcon />
                </StyledIconButton>
                <span> </span>
                <StyledIconButton
                  className="pointer"
                  onClick={() => setBooking(row)}
                  color="primary"
                >
                  <BorderColorIcon />
                </StyledIconButton>
              </>
            ),
            align: 'right',
            width: 48,
          },
        ]}
      />
      <EditBookingModal
        refetch={refetch}
        booking={booking}
        setBooking={setBooking}
      />
    </Box>
  );
}
