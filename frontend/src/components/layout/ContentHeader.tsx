import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import {
  makeStyles,
  Paper,
  withStyles,
  Theme,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
  contentHeader: {
    alignItems: 'center',
    backgroundColor: '#F2F5F7', // TODO: Replace with theme color once theme is refactored with MUI
    width: '100%',
    maxWidth: '100vw',
    height: '90px',
    boxSizing: 'border-box',
    padding: '0 65px 0 150px',
    color: '#fff',
    display: 'flex',
  },
});

export default function Header() {
  const { pathname } = useLocation()
  const classes = useStyles()
  let headerText;
  // TODO introduce concept of a user and get the clerk's location
  switch(pathname) {
    case '/booking':
      headerText = `Upcoming Bookings - Victoria`
      break
    case '/directory':
      headerText = `Search Interpreters`
      break
    default:
      break
  }

  return headerText ? (
    <Paper elevation={0} square className={classes.contentHeader}>
      <Typography color='primary' variant='h5'>{headerText}</Typography>
    </Paper>
  ) : null
}
