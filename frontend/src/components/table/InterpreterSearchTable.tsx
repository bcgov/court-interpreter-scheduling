import React, { useContext, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import moment from 'moment';

import { Interpreter, Language } from 'constants/interfaces';
import {
  fieldSort,
  arrayFieldSort,
  levelSort,
  languageArraySort,
} from 'util/sort';
import { comments, fullName, withEvent, withLanguageEvent, checkInterpreterAvailability } from 'util/tableHelpers';
import { fixLanguageName } from 'constants/languages';

import BaseTable from 'components/table/Base';
import Calendar from 'components/calendar/DirectoryCalendar';
import ViewToggle from 'components/calendar/ViewToggle';
import BookingModal from 'components/form/BookingModal';
import BookingButton from 'components/table/BookingButton';
import Tag from 'components/reusable/Tag';
import { Column } from 'material-table';
import { StyledTooltip } from 'components/reusable/StyledTooltip';
import { StyledIconButton } from 'components/Buttons';
import CopyIcon from 'assets/images/copy.png';
import SearchContext from 'contexts/SearchContext';

export default function SearchTable({
  data,
  disabled,
  handleCopyEmails,
}: {
  data: Interpreter[];
  disabled: boolean;
  handleCopyEmails?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const { search } = useContext(SearchContext);
  const [interpreter, setInterpreter] = useState();
  const [view, setView] = useState('list');

  // Remove "non-active" interpreters
  data = data.filter((lang) => lang.contractExtension || false);

  if (search.language) {
    data = levelSort(data, search.language)
  }
  
  if (search.dates.length) {
    data = data.map((interpreter) => {
      const conflicts = checkInterpreterAvailability(interpreter.bookings, search.dates)
      return ({
        ...interpreter,
        conflicts,
      })
    })
    .sort(
      (a, b) => {
        if (a.conflicts.length > 0 && b.conflicts.length > 0) return 0
        if (a.conflicts.length > 0) return 1
        if (b.conflicts.length > 0) return -1
        return 0
      }
    )
  }

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
      render: (row: any) => fullName(row.firstName, row.lastName, row.events),
      customSort: fieldSort('lastName'),
    },
    {
      title: 'Language',
      render: (row: any) =>
        row.languages.map(fixLanguageName).map((l: Language) => (
          <div
            className={
              search.language &&
              l.languageName.toUpperCase().includes(search.language?.toUpperCase())
                ? 'bold'
                : ''
            }
          >
            {l.languageName}{withLanguageEvent(l.languageName, 'name', row.events)} {l.level}{withLanguageEvent(l.languageName, 'level', row.events)}
          </div>
        )),
      customSort: search.language
        ? languageArraySort(search.language, 'level')
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
          {withEvent(['address', 'city', 'postal'], row.events)}
        </span>
      ),
      customSort: fieldSort('city'),
    },
    {
      title: 'Phone',
      render: (row: any) => (
        <div>
          <p className="flat">{row.phone} <small>mobile</small></p>{withEvent('phone', row.events)}
          {row.businessPhone && row.businessPhone !== row.phone && (
            <p className="flat">
              {row.businessPhone} <small>home</small>{withEvent('businessPhone', row.events)}
            </p>
          )}
          {row.homePhone && row.homePhone !== row.phone && (
            <p className="flat">
              {row.homePhone} <small>work</small>{withEvent('homePhone', row.events)}
            </p>
          )}
        </div>
      ),
    },
    {
      title: (
        <>
          <span>Email </span>
          <StyledTooltip title="Copy emails to clipboard">
            <StyledIconButton
              className="pointer"
              onClick={handleCopyEmails}
              color="primary"
              style={{ marginLeft: '1rem' }}
            >
              <img src={CopyIcon} />
            </StyledIconButton>
          </StyledTooltip>
        </>
      ),
      field: 'email',
      render: (row: any) => (
        <span>
          {row.email}
          {withEvent('email', row.events)}
        </span>
      ),
    },
    ...distanceColumn,
    {
      render: (row: any) => (
        <div className='intSearchButton'>
          {moment(row.createdAt).isAfter(moment().subtract(30, 'days')) ? <Tag data={{ createdAt: row.createdAt }} className='mr-2 intSearchTag' /> : null}
          <BookingButton
            disabled={disabled}
            conflicts={row.conflicts}
            onClick={() => setInterpreter(row)}
          />
        </div>
      ),
      align: 'right',
    },
  ];

  return (
    <Box mt={8}>
      {!disabled && <ViewToggle view={view} setView={setView} />}
      {view === 'list' ? (
        <BaseTable
          data={data}
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
                    <b>Site Code</b>
                    <br />
                    {rowData.siteCode}
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
                    {comments(rowData.comments, rowData.languages, rowData)}
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
