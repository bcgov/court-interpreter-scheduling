import React, { useRef, useState } from 'react'
import { useField } from 'formik'
import moment from 'moment'
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  Popover,
} from '@material-ui/core'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { DayPickerRangeController } from 'react-dates';
import { StyledFormControl, StyledLabel, StyledTextField } from 'components/form/inputs/DirectoryInputs'

const dateFormat = 'YYYY-MM-DD'

function Picker () {
  const [field, , helpers] = useField('dates')
  const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>('startDate')
  return (
    <DayPickerRangeController
      startDate={field.value ? moment(field.value.startDate) : null}
      endDate={field.value ? moment(field.value.endDate) : null}
      onDatesChange={({ startDate, endDate }) => {
        helpers.setValue({
          startDate: moment(startDate).format(dateFormat),
          endDate: moment(endDate).format(dateFormat),
        })
      }}
      focusedInput={focusedInput}
      onFocusChange={(fI) => setFocusedInput(focusedInput === 'endDate' ? 'startDate' : fI)}
      initialVisibleMonth={() => moment()}
      numberOfMonths={2}
      hideKeyboardShortcutsPanel
      keepOpenOnDateSelect
      minimumNights={0}
      noBorder
    />
  )
}

export default function Range({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const anchor = useRef(null)
  const id = open ? 'date-range-popover' : undefined
  return (
    <>
      <StyledFormControl>
        <StyledLabel htmlFor='dates'>
          Date Range
        </StyledLabel>
        <StyledTextField
          ref={anchor}
          style={{ maxWidth: `calc(50% - 16px)` }}
          id='date-static'
          aria-describedby={id}
          variant='outlined'
          size='small'
          value={text}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton edge='end' onClick={() => setOpen(true)}>
                  <CalendarTodayIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </StyledFormControl>
      <Popover
        id={id}
        open={open}
        anchorEl={anchor.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Grid container style={{ width: 'min-content' }}>
          <Grid item xs={12}>
            <Picker />
          </Grid>

          <Grid item xs={12}>
            <Box p={2}>
              <Grid justify='space-between' container>
                <Grid item xs={2}>
                  <Button variant='outlined' type='button' onClick={() => setOpen(!open)}>Cancel</Button>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    className='right'
                    variant='contained'
                    color='primary'
                    onClick={() => setOpen(!open)}
                    type='button'
                  >
                    Save
                </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Popover>
    </>
  )
}
