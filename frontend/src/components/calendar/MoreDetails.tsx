import React, { useRef, useState } from 'react'

import { SearchParams } from 'constants/interfaces'
import BookingButton from 'components/table/BookingButton'

import { withStyles } from '@material-ui/core'
import Popover from '@material-ui/core/Popover'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'

const LinkTypography = withStyles({
  root: {
    textDecoration: 'underline',
    color: '#1A5A96',
    fontWeight: 600,
  },
})(Typography)

export default function MoreDetails({ interpreter, setInterpreter, search }: { interpreter?: any, setInterpreter: Function, search: SearchParams }) {
  const [open, toggle] = useState(false)
  const anchorEl = useRef(null)
  return (
    <>
      <LinkTypography
        ref={anchorEl}
        className='pointer'
        variant='body1'
        onClick={() => toggle(true)}
      >
        More Details
      </LinkTypography>
      <Popover
        anchorEl={anchorEl.current}
        open={open}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <Box p={3} style={{ maxWidth: '500px' }}>
          <Box mb={2}>
            <Grid justify='space-between' alignItems='center' container>
              <Grid xs={11} item>
                <Typography color='primary' variant='h4'>{interpreter.firstName} {interpreter.lastName}</Typography>
              </Grid>
              <Grid xs={1} item>
                <CloseIcon className='pointer' onClick={() => toggle(false)} />
              </Grid>
            </Grid>
          </Box>
          <Grid justify='space-between' container>
            <Grid xs={6} className='rowItem' item>
              <b>Language</b>
            </Grid>
            <Grid xs={6} className='rowItem' item>
              {search.language}
            </Grid>
            <Grid xs={6} className='rowItem' item>
              <b>Level</b>
            </Grid>
            <Grid xs={6} className='rowItem' item>
              {interpreter.languages.find((l: string) => l === search.language)?.level}
            </Grid>
            <Grid xs={6} className='rowItem' item>
              <b>Distance</b>
            </Grid>
            <Grid xs={6} className='rowItem' item>
              0.2
            </Grid>
            <Grid xs={6} className='rowItem' item>
              <b>Drive Time</b>
            </Grid>
            <Grid xs={6} className='rowItem' item>
              20 mins
            </Grid>
            <Grid xs={6} className='rowItem' item>
              <b>Location</b>
            </Grid>
            <Grid xs={6} className='rowItem' item>
              {interpreter.address}
            </Grid>
            <Grid xs={6} className='rowItem' item>
              <b>Phone</b>
            </Grid>
            <Grid xs={6} className='rowItem' item>
              {interpreter.phone}
            </Grid>
            <Grid xs={6} className='rowItem' item>
              <b>Email address</b>
            </Grid>
            <Grid xs={6} className='rowItem' item>
              {interpreter.email}
            </Grid>
            <Grid xs={6} className='rowItem' item>
              <b>Bookings in last 30 days</b>
            </Grid>
            <Grid xs={6} className='rowItem' item>
              5
            </Grid>
            <Grid>
              <BookingButton onClick={() => setInterpreter(interpreter)}>Book</BookingButton>
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  )
}
