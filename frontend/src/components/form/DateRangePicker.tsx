import React, { useState } from 'react'
import { useField } from 'formik'
import dayjs from 'dayjs'
import {
  InputAdornment,
  IconButton,
} from '@material-ui/core'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { DateRangePicker, DateRange } from '@matharumanpreet00/react-daterange-picker'
import { StyledFormControl, StyledLabel, StyledTextField } from './inputs/DirectoryInputs'

export default function Range() {
  const [open, setOpen] = useState(false)
  const [field, meta, helpers] = useField('dates')
  const dateFormat = 'MMM D, YYYY'
  return (
    <>
      <StyledFormControl onClick={() => setOpen(true)}>
        <StyledLabel htmlFor='language'>
          Date Range
        </StyledLabel>
        <StyledTextField
          style={{ maxWidth: `calc(50% - 16px)` }}
          id='date-static'
          variant='outlined'
          size='small'
          value={`${dayjs(field.value?.startDate).format(dateFormat)} to ${dayjs(field.value?.endDate).format(dateFormat)}`}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton edge='end'>
                  <CalendarTodayIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </StyledFormControl>
      <DateRangePicker
        open={open}
        {...field}
        {...meta}
        onChange={(range: DateRange) => {
          helpers.setValue(range)
          setOpen(!open)
        }}
      />
    </>
  )
}
