import React, { useContext, useEffect, useRef, useState } from 'react'
import { Field, ErrorMessage, Formik, useField, useFormikContext } from 'formik'

import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  IconButton,
  Popover,
} from '@material-ui/core'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import moment from 'moment'

import useKeyPress from 'hooks/useKeyPress'

import SearchContext from 'contexts/SearchContext'
import { Initial, Schema } from 'components/form/schemas/daterange-search.schema'
import { StyledFormControl, StyledLabel, StyledTextField } from 'components/form/inputs/DirectoryInputs'
import { PeriodRadio } from 'components/form/inputs/Check'

import { eachDayOfInterval, formatISO, compareAsc, isBefore, isSameDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Calendar } from 'react-nice-dates'

function Picker () {
  const [, , helpers] = useField('dates')

  const [lastDate, setLastDate] = useState<Date>()
  const [selectedDates, setSelectedDates] = useState<Array<Date>>([])

  useEffect(() => {
    helpers.setValue(selectedDates)
  }, [selectedDates])

  const modifiers = {
    selected: (date: Date | number) => selectedDates.some(selectedDate => isSameDay(selectedDate, date))
  }

  const shiftKeyPressed = useKeyPress('shift')

  const handleDayClick = (date: Date | null) => {
    if (date) {
      setLastDate(date)
      if (selectedDates.some(selectedDate => isSameDay(selectedDate, date))) {
        setSelectedDates(selectedDates.filter((selectedDate) => !isSameDay(selectedDate, date)).sort(compareAsc))
      } else {
        if (shiftKeyPressed && lastDate) {
          const start = isBefore(lastDate, date) ? lastDate : date
          const end = isBefore(lastDate, date) ? date : lastDate
          const range = eachDayOfInterval({ start, end })
          setSelectedDates([
            ...selectedDates,
            ...range
          ].reduce(
            (list: Array<Date>, currentDate: Date) => list.some((date) => isSameDay(date, currentDate)) ? list : [...list, currentDate], []
          ).sort(compareAsc))
        } else {
          setSelectedDates([...selectedDates, date].sort(compareAsc))
        }
      }
    }
  }

  return (
    <>
      <Calendar
        locale={enUS}
        onDayClick={handleDayClick}
        modifiers={modifiers}
        minimumDate={new Date()}
      />
    </>
  )
}

export default function Range() {
  const [open, setOpen] = useState(false)
  const anchor = useRef(null)
  const dateFormat = 'MMM D, YYYY'
  const id = open ? 'date-range-popover' : undefined
  const { values: searchValues, setFieldValue } = useFormikContext()
  const { search, updateSearchContext } = useContext(SearchContext)
  useEffect(() => {
    if (search?.dates) {
      setFieldValue('dates', search.dates)
    }
  }, [setFieldValue, search])
  return (
    <Formik
      initialValues={Initial}
      validationSchema={Schema}
      onSubmit={async (values, actions) => {

        const baseDay = {
          date: values.dates[0],
          period: values.period,
          arrivalTime: values.arrivalTime
        }
        let dates = values.dates.map(d => Object.assign({}, baseDay, { date: formatISO(d) }))

        updateSearchContext(Object.assign({}, search, searchValues, { dates }))
        setFieldValue('dates', dates)
        actions.resetForm()
        setOpen(false)
        return
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <>
          <StyledFormControl>
            <StyledLabel htmlFor='language'>
              Dates
            </StyledLabel>
            <StyledTextField
              ref={anchor}
              style={{ maxWidth: `calc(50% - 16px)` }}
              id='date-static'
              aria-describedby={id}
              variant='outlined'
              size='small'
              value={`${moment(search.dates[0]?.date).format(dateFormat)} to ${moment(search.dates[search.dates.length - 1]?.date).format(dateFormat)}`}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton id='rangeCalButton' edge='end' onClick={() => setOpen(true)}>
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
            <Grid container>

              <Grid item xs={12} md={6} className='rangeParent'>
                <Box p={1}>
                  <Picker />
                  <ErrorMessage name='dates' render={() => <Box px={3} pb={1}>Please select a date range</Box>} />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box p={4} pt={7}>
                  <StyledFormControl>
                    <StyledLabel htmlFor='time-options'>
                      Arrival Time
                    </StyledLabel>
                    <Box my={1}>
                      <Field type='time' name='arrivalTime' />
                    </Box>
                    <Box my={1}>
                      <ErrorMessage name='arrivalTime' />
                    </Box>
                  </StyledFormControl>

                  <StyledFormControl>
                    <StyledLabel htmlFor='time-options'>
                      Time Options
                    </StyledLabel>
                    <div role='group' aria-labelledby='time-options'>
                    <PeriodRadio
                        label='Full Day'
                        name='period'
                        value='WHOLE_DAY'
                      />
                      <PeriodRadio
                        label='Morning'
                        name='period'
                        value='MORNING'
                      />
                      <PeriodRadio
                        label='Afternoon'
                        name='period'
                        value='AFTERNOON'
                      />
                    </div>
                    <div><ErrorMessage name='period' /></div>
                  </StyledFormControl>
                </Box>
              </Grid>

              <Divider style={{ flexShrink: 1, width: '100%' }} variant='middle' />

              <Grid item xs={12}>
                <Box p={2}>
                  <Grid justify='space-between' container>
                    <Grid item xs={2}>
                      <Button variant='outlined' onClick={() => setOpen(!open)}>Cancel</Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        className='right'
                        variant='contained'
                        color='primary'
                        disabled={isSubmitting}
                        onClick={() => handleSubmit()}
                      >
                        {isSubmitting ? '...' : 'Add'}
                    </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Popover>
        </>
      )}
    </Formik>
  )
}
