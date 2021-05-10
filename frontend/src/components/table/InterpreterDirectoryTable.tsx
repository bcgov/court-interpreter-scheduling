import React, { useState } from 'react';
import moment from 'moment';

import { Grid, Box } from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import AddIcon from '@material-ui/icons/Add';
import ArchiveIcon from '@material-ui/icons/Archive';

import { StyledTooltip } from 'components/reusable/StyledTooltip';
import Tag from 'components/reusable/Tag';
import CopyIcon from 'assets/images/copy.png';

import BaseTable from 'components/table/Base';
import { StyledIconButton } from 'components/Buttons';
import EditInterpreterModal from 'components/form/EditInterpreterModal';

import { Language, Interpreter } from 'constants/interfaces';
import { fieldSort, languageArraySort, arrayFieldSort } from 'util/sort';
import {
  comments,
  fullName,
  withEvent,
  withLanguageEvent,
} from 'util/tableHelpers';
import { fixLanguageName } from 'constants/languages';
import { useAxiosFileGet } from 'hooks/axios';
import { useAlert } from 'hooks/useAlert';

export default function DirectoryTable({
  data,
  openCreateModal,
  getInterpreters,
  language,
  handleCopyEmails,
}: {
  data: Array<Interpreter>;
  openCreateModal: Function;
  getInterpreters: Function;
  language?: string;
  handleCopyEmails?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const [interpreter, setInterpreter] = useState();
  const [
    { data: fileGetData, error, loading },
    downloadExcel,
  ] = useAxiosFileGet({ url: '/interpreter/file-export' }, { manual: true });

  const { addAlert } = useAlert();
  return (
    <Box mt={8}>
      <BaseTable
        data={data}
        columns={[
          {
            title: 'Name',
            render: (row: any) => fullName(row.firstName, row.lastName),
            customSort: fieldSort('lastName'),
          },
          {
            title: 'Phone',
            field: 'phone',
            render: (row: any) => (
              <span>
                {row.phone}
                {withEvent('phone', row.events)}
              </span>
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
          {
            title: 'Language',
            render: (row: any) =>
              row.languages.map(fixLanguageName).map((l: Language) => (
                <div
                  className={
                    language &&
                    l.languageName
                      .toUpperCase()
                      .includes(language?.toUpperCase())
                      ? 'bold'
                      : ''
                  }
                >
                  {l.languageName}
                  {withLanguageEvent(l.languageName, 'name', row.events)}
                </div>
              )),
            customSort: language
              ? languageArraySort(language, 'languageName')
              : arrayFieldSort('languages', 0, 'languageName'),
          },
          {
            title: 'Level',
            render: (row: any) =>
              row.languages.map(fixLanguageName).map((language: Language) => (
                <div>
                  {language.level}
                  {withLanguageEvent(
                    language.languageName,
                    'level',
                    row.events
                  )}
                </div>
              )),
            customSort: language
              ? languageArraySort(language, 'level')
              : arrayFieldSort('languages', 0, 'level'),
          },
          {
            title: 'Active',
            field: 'contractExtension',
            render: (row: any) => (
              <span>
                {row.contractExtension ? 'Active' : 'Inactive'}
                {withEvent('contractExtension', row.events)}
              </span>
            ),
          },
          {
            title: 'City',
            field: 'city',
            render: (row: any) => (
              <span>
                {row.city}
                {withEvent('city', row.events)}
              </span>
            ),
          },
          {
            render: (row: any) =>
              moment(row.createdAt).isAfter(moment().subtract(30, 'days')) ? (
                <Tag data={{ createdAt: row.createdAt }} className="mr-2" />
              ) : null,
          },
          {
            title: (
              <StyledIconButton
                className="pointer"
                onClick={() => openCreateModal(true)}
                color="primary"
              >
                <AddIcon />
              </StyledIconButton>
            ),
            sorting: false,
            render: (row: any) => (
              <>
                <StyledIconButton
                  className="pointer"
                  onClick={() => setInterpreter(row)}
                  color="primary"
                >
                  <BorderColorIcon />
                </StyledIconButton>
              </>
            ),
            width: 75,
          },
          {
            title: (
              <StyledIconButton
                className="pointer"
                onClick={async () => {
                  addAlert('Exporting the interpreters to excel file...', null);
                  try {
                    const file = await downloadExcel({
                      url: `/interpreter/file-export`,
                    });

                    const url = window.URL.createObjectURL(
                      new Blob([file.data])
                    );
                    const link = document.createElement('a');
                    link.download = `interpreters.xlsx`;
                    link.href = url;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                    addAlert('Successfully exported to excel file');
                  } catch (err) {
                    alert(err.message);
                  }
                }}
                color="primary"
              >
                <ArchiveIcon />
              </StyledIconButton>
            ),
            sorting: false,
            width: 75,
          },
        ]}
        overrides={{
          detailPanel: (rowData: any) => (
            <Grid container justify="space-around">
              <Grid item>
                <Box p={1}>
                  <b>Address</b>
                  <br />
                  {`${rowData.address} ${rowData.city} ${rowData.postal}`}
                  {withEvent(['address', 'city', 'postal'], rowData.events)}
                </Box>
              </Grid>
              <Grid item>
                <Box p={1}>
                  <b>Supplier #</b>
                  <br />
                  {rowData.supplier}
                  {withEvent('supplier', rowData.events)}
                </Box>
              </Grid>
              <Grid item>
                <Box p={1}>
                  <b>GST #</b>
                  <br />
                  {rowData.gst}
                  {withEvent('gst', rowData.events)}
                </Box>
              </Grid>
              <Grid item>
                <Box p={1}>
                  <b>Record Check</b>
                  <br />
                  {rowData.criminalRecordCheckDate
                    ? moment(rowData.criminalRecordCheckDate).format(
                        'YYYY-MM-DD'
                      )
                    : rowData.criminalRecordCheck}
                  {withEvent(
                    ['criminalRecordCheck', 'criminalRecordCheckDate'],
                    rowData.events
                  )}
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
      <EditInterpreterModal
        interpreter={interpreter}
        setInterpreter={setInterpreter}
        refetch={getInterpreters}
      />
    </Box>
  );
}
