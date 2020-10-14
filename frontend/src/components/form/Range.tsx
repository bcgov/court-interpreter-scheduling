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
import { DayPickerRangeController } from 'react-dates';
import moment from 'moment'

import SearchContext from 'contexts/SearchContext'
import { Initial, Schema } from 'components/form/schemas/daterange-search.schema'
import { StyledFormControl, StyledLabel, StyledTextField, GridRow } from 'components/form/inputs/DirectoryInputs'
import { PeriodRadio } from 'components/form/inputs/Check'

function Picker () {
  const [field, , helpers] = useField('dates')
  const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>('startDate')

  return (
    <DayPickerRangeController
      startDate={field.value ? moment(field.value.startDate) : null}
      endDate={field.value ? moment(field.value.endDate) : null}
      onDatesChange={({ startDate, endDate }) => {
        helpers.setValue({
          startDate: moment(startDate).format(),
          endDate: moment(endDate).format(),
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
  }, [])
  return (
    <Formik
      initialValues={Initial}
      validationSchema={Schema}
      onSubmit={async (values, actions) => {

        const { startDate, endDate } = values.dates
        const baseDay = {
          date: values.dates.startDate,
          period: values.period,
          arrivalTime: values.arrivalTime
        }
        let dates = [baseDay]

        let currentDate = moment(startDate)
        const endDateMoment = moment(endDate)

        while (currentDate.isBefore(endDateMoment)) {
          currentDate = currentDate.add(1, 'days')
          dates.push({
            ...baseDay,
            date: currentDate.format(),
          })
        }
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
              Date Range
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
                <ErrorMessage name='dates' render={() => <Box px={3} pb={1}>Please select a date range</Box>} />
              </Grid>

              <Divider style={{ flexShrink: 1, width: '100%' }} variant='middle' />

              <GridRow mt={0.5} item xs={12}>
                <Box px={3} py={1}>
                  <Grid container>
                    <Grid item xs={4}>
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
                    </Grid>
                    <Grid item xs={8}>
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
                    </Grid>
                  </Grid>
                </Box>
              </GridRow>

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
