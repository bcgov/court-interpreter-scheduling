import React from 'react'
import { useLocation } from 'react-router-dom'

import {
  makeStyles,
  Typography,
} from '@material-ui/core'

import ContentBox from 'components/layout/ContentBox'

const useStyles = makeStyles({
  contentHeader: {
    alignItems: 'center',
    backgroundColor: '#F2F5F7', // TODO: Replace with theme color once theme is refactored with MUI
    width: '100%',
    maxWidth: '100vw',
    height: '90px',
    boxSizing: 'border-box',
    color: '#fff',
    display: 'flex',
  },
})

export default function Header() {
  const { pathname } = useLocation()
  const classes = useStyles()
  let headerText
  // TODO introduce concept of a user and get the clerk's location
  switch(pathname) {
    case '/booking':
      headerText = `Upcoming Bookings - Victoria`
      break
    case '/directory':
      headerText = ``
      break
    case '/interpreters':
      headerText = `Manage Interpreters`
      break
    default:
      break
  }

  return headerText ? (
    <ContentBox className={classes.contentHeader}>
      <Typography color='primary' variant='h5'>{headerText}</Typography>
    </ContentBox>
  ) : null
}
