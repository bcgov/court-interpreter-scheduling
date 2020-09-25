import React, { useState } from 'react'
import { useField } from 'formik'
import {
  FormControl,
  InputAdornment,
  IconButton,
} from '@material-ui/core'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { DateRangePicker, DateRange } from '@matharumanpreet00/react-daterange-picker'
import { StyledLabel, StyledTextField } from './inputs/directory'

export default function Range() {
  const [open, setOpen] = useState(false)
  const [field, meta, helpers] = useField('dates')
  return (
    <>
      <FormControl onClick={() => setOpen(true)}>
        <StyledLabel htmlFor='language'>
          Date Range
        </StyledLabel>
        <StyledTextField
          id='date-static'
          variant='outlined'
          size='small'
          value={field.value?.startDate}
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
      </FormControl>
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
