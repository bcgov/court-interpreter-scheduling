import React, { useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import moment from 'moment';

import { Interpreter, Language } from 'constants/interfaces';
import {
  fieldSort,
  arrayFieldSort,
  levelSort,
  languageArraySort,
} from 'util/sort';
import { comments, fullName, withEvent, withLanguageEvent } from 'util/tableHelpers';
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

export default function SearchTable({
  data,
  disabled,
  language,
  handleCopyEmails,
}: {
  data: Interpreter[];
  disabled: boolean;
  language?: string;
  handleCopyEmails?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
      render: (row: any) => fullName(row.firstName, row.lastName, row.events),
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
            {l.languageName}{withLanguageEvent(l.languageName, 'name', row.events)} {l.level}{withLanguageEvent(l.languageName, 'level', row.events)}
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
        <>
                    {moment(row.createdAt).isAfter(moment().subtract(30, 'days')) ? <Tag data={{ createdAt: row.createdAt }} className='mr-2' /> : null}
          <BookingButton
            disabled={disabled}
            onClick={() => setInterpreter(row)}
          />
        </>
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
