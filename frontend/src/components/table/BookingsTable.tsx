import React, { useState } from 'react';
import { format } from 'date-fns';
import { Box, IconButton, withStyles } from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';

import BaseTable from 'components/table/Base';
import { DatesCell } from 'components/table/DateTimeCell';
import StatusButton from 'components/table/Status';
import InterpreterName from 'components/table/InterpreterName';
import EditBookingModal from 'components/form/EditBookingModal';
import { StyledTooltip } from 'components/reusable/StyledTooltip';
import { fixLanguageName } from 'constants/languages';
import { Booking } from 'constants/interfaces';
import { useAxiosFileGet } from 'hooks/axios';
import { useAlert } from 'hooks/useAlert';
import {
  fieldSort,
  objectFieldSort,
  bookingDateSort,
} from 'util/sort';
import DownloadIcon from '../../assets/images/download-invoice.png';
import { TableFC } from 'components/table/Base';

const StyledIconButton = withStyles({
  root: {
    backgroundColor: '#E8F3FD',
    borderRadius: '4px',
    height: '40px',
    width: '40px',
  },
})(IconButton);


const GenericBaseTable: TableFC<Booking> = BaseTable;

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

  const { addAlert } = useAlert();

  return (
    <Box mt={4}>
      <GenericBaseTable
        data={data}
        columns={[
          {
            render: (row) => (row.dates?.length > 0 ? <DatesCell dates={row.dates} />: null),
            title: 'Date & Time',
            sorting: false,
          },
          { field: 'file', title: 'Court File Number', customSort: fieldSort('file'), },
          { field: 'caseName', title: 'Case Name', customSort: fieldSort('caseName'), },
          {
            title: 'Language',
            render: (row: any) => (
              <div>{fixLanguageName(row).languageName}</div>
            ),
            customSort: fieldSort('language'),
          },
          {
            render: (row: any) => (
              <InterpreterName interpreter={row.interpreter} />
            ),
            title: 'Interpreter',
            customSort: objectFieldSort('interpreter', 'lastName')
          },
          {
            render: (row: any) => <StatusButton status={row.status} />,
            title: 'Status',
            customSort: fieldSort('status'),
          },
          { field: 'comment', title: 'Comment', customSort: fieldSort('comment') },
          {
            render: (row: any) => (
              <>
                <StyledTooltip title="Download ADM-322">
                  <StyledIconButton
                    className="pointer"
                    onClick={async () => {
                      addAlert('Exporting the ADM322 Excel file...', null);
                      try {
                        const file = await downloadExcel({
                          url: `/booking/export/${row.id}`,
                        });

                        const url = window.URL.createObjectURL(
                          new Blob([file.data])
                        );
                        const link = document.createElement('a');
                        link.download = `booking_${row.interpreter.firstName}_${
                          row.language
                        }_${format(
                          new Date(row.dates[0].date),
                          'yyyy-LLL-dd'
                        )}.xlsx`;
                        link.href = url;
                        link.click();
                        window.URL.revokeObjectURL(link.href);
                        addAlert('Successfully exported the ADM322 Excel file');
                      } catch (err) {
                        addAlert(err.message);
                      }
                    }}
                    color="primary"
                  >
                    <img src={DownloadIcon} />
                  </StyledIconButton>
                </StyledTooltip>
                <span> </span>
                <StyledTooltip title="Edit Booking">
                  <StyledIconButton
                    className="pointer"
                    onClick={() => setBooking(row)}
                    color="primary"
                  >
                    <BorderColorIcon />
                  </StyledIconButton>
                </StyledTooltip>
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
