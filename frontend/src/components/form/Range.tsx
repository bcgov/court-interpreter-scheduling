import React, { useRef, useState } from 'react'
import { Field, ErrorMessage, Formik, useField, useFormikContext } from 'formik'
import moment from 'moment'
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  IconButton,
  Popover,
} from '@material-ui/core'
import { SearchContext } from 'views/Directory'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { DayPickerRangeController } from 'react-dates';
import { StyledFormControl, StyledLabel, StyledTextField, GridRow } from 'components/form/inputs/DirectoryInputs'
import { TextCheck } from 'components/form/inputs/Check'

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
  const { setFieldValue } = useFormikContext();
  return (
    <SearchContext.Consumer>
      {({ search, updateSearchContext }) => (
        <Formik
          initialValues={{
            arrivalTime: '',
            dates: {
              startDate: '',
              endDate: '',
            },
            period: [],
          }}
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
            updateSearchContext({
              ...search,
              dates,
            })
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
                    <ErrorMessage name='dates' />
                  </Grid>

                  <Divider style={{ flexShrink: 1, width: '100%' }} variant='middle' />

                  <GridRow mt={0.5} item xs={12}>
                    <Box px={2}>
                      <Grid container>
                        <Grid item xs={4}>
                          <StyledFormControl>
                            <StyledLabel htmlFor='time-options'>
                              Arrival Time
                            </StyledLabel>
                            <Field type='time' name='arrivalTime' />
                            <ErrorMessage name='arrivalTime' />
                          </StyledFormControl>
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={7}>
                          <StyledFormControl>
                            <StyledLabel htmlFor='time-options'>
                              Time Options
                            </StyledLabel>
                            <div role='group' aria-labelledby='time-options'>
                              <TextCheck
                                label='Full Day'
                                name='period'
                                value='WHOLE_DAY'
                              />
                              <TextCheck
                                label='Morning'
                                name='period'
                                value='MORNING'
                              />
                              <TextCheck
                                label='Afternoon'
                                name='period'
                                value='AFTERNOON'
                              />
                              <ErrorMessage name='period' />
                            </div>
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
      )}
    </SearchContext.Consumer>
  )
}
