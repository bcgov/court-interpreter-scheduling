import React, { useRef, useState } from 'react'

import Popover from '@material-ui/core/Popover'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'

import { Interpreter } from 'constants/interfaces'

export default function InterpreterName({ interpreter }: { interpreter?: Interpreter }) {
  const [open, toggle] = useState(false)
  const anchorEl = useRef(null)
  return interpreter ? (
    <>
      <span
        ref={anchorEl}
        className='linkSpan pointer'
        onClick={() => toggle(true)}
      >
        {interpreter.firstName} {interpreter.lastName}
      </span>
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
            <Grid xs={6} item>
              <b>Phone</b>
            </Grid>
            <Grid xs={6} item>
              {interpreter.phone}
            </Grid>
            <Grid xs={6} item>
              <b>Email Address</b>
            </Grid>
            <Grid xs={6} item>
              {interpreter.email}
            </Grid>
            <Grid xs={6} item>
              <b>Court location</b>
            </Grid>
            <Grid xs={6} item>
              lorem ipsum
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  ) : <span>-</span>
}
