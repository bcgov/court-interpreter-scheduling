import React, { useState } from 'react';
import { Box, Grid } from '@material-ui/core';

import { Interpreter, Language } from 'constants/interfaces';
import {
  fieldSort,
  arrayFieldSort,
  levelSort,
  languageArraySort,
} from 'util/sort';
import { comments, fullName } from 'util/tableHelpers';
import { fixLanguageName } from 'constants/languages';

import BaseTable from 'components/table/Base';
import Calendar from 'components/calendar/DirectoryCalendar';
import ViewToggle from 'components/calendar/ViewToggle';
import BookingModal from 'components/form/BookingModal';
import BookingButton from 'components/table/BookingButton';
import { Column } from 'material-table';

export default function DirectoryTable({
  data,
  disabled,
  language,
}: {
  data: Interpreter[];
  disabled: boolean;
  language?: string;
}) {
  const [interpreter, setInterpreter] = useState();
  const [view, setView] = useState('list');

  // Remove "non-active" interpreters
  data = data.filter((lang) => lang.contractExtension || false);

  // check if distance exists
  const distanceColumn = !!data.find(
    (intp) => intp?.distance || intp?.distance === null
  )
    ? [
        {
          title: 'Distance (km)',
          render: (row: any) => (
            <div>{row?.distance === null ? 'n/a' : row?.distance}</div>
          ),
          customSort: fieldSort('distance'),
        },
      ]
    : [];
  let columns: Column<any>[] = [
    {
      title: 'Name',
      render: (row: any) => fullName(row.firstName, row.lastName),
      customSort: fieldSort('lastName'),
    },
    {
      title: 'Language',
      render: (row: any) =>
        row.languages.map(fixLanguageName).map((l: Language) => (
          <div
            className={
              language &&
              l.languageName.toUpperCase().includes(language?.toUpperCase())
                ? 'bold'
                : ''
            }
          >
            {l.languageName} {l.level}
          </div>
        )),
      customSort: language
        ? languageArraySort(language, 'level')
        : arrayFieldSort('languages', 0, 'languageName'),
    },
   
    {
      title: 'Address',
      render: (row: any) => (
        <span>
          {row.address}
          <br /> {row.city}{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={encodeURI(
              `https://www.google.com/maps/dir/?api=1&origin=${row.address.trim()},${row.city.trim()},${
                row.postal
              }&destination=${row.city} BC courthouse`
            )}
          >
            {row.postal}
          </a>
        </span>
      ),
      customSort: fieldSort('city'),
    },
    {
      title: 'Phone',
      render: (row: any) => (
        <div>
          <div>{row.phone} <small>mobile</small></div>
          {row.businessPhone && row.businessPhone !== row.phone && (
            <div>
              {row.businessPhone} <small>home</small>
            </div>
          )}
          {row.homePhone && row.homePhone !== row.phone && (
            <div>
              {row.homePhone} <small>work</small>
            </div>
          )}
        </div>
      ),
    },
    { title: 'Email', field: 'email' },
    ...distanceColumn,
    
    {
      render: (row: any) => (
        <BookingButton
          disabled={disabled}
          onClick={() => setInterpreter(row)}
        />
      ),
      align: 'right',
    },
  ];

  return (
    <Box mt={8}>
      {!disabled && <ViewToggle view={view} setView={setView} />}
      {view === 'list' ? (
        <BaseTable
          data={language ? levelSort(data, language) : data}
          columns={columns}
          overrides={{
            detailPanel: (rowData: any) => (
              <Grid container justify="space-around">
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
                    {comments(rowData.comments, rowData.languages)}
                  </Box>
                </Grid>
              </Grid>
            ),
          }}
        />
      ) : (
        <Calendar setInterpreter={setInterpreter} interpreters={data} />
      )}
      <BookingModal interpreter={interpreter} setInterpreter={setInterpreter} />
    </Box>
  );
}
