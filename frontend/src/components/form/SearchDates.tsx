import React, { useState, useEffect, useContext } from 'react'
import {
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import moment from 'moment'

import { Field, FieldArray, ArrayHelpers } from 'formik'

import { StyledFormControl, StyledLabel, } from 'components/form/inputs/DirectoryInputs'
import { ArrayPeriodRadio } from 'components/form/inputs/Check'
import { BookingDate } from 'constants/interfaces'

const useStyles = makeStyles({
  parent: {
    marginTop: '1rem',
    overflow: 'auto',
  },
  closeIcon: {
    float: 'right',
  },
});

export default function SearchDates({ values }: { values: { dates: BookingDate[] }}) {
  const classes = useStyles()
  return (
    <FieldArray
      name='dates'
      render={(arrayHelpers: ArrayHelpers) => (
        <Grid wrap='nowrap' spacing={1} container className={classes.parent}>
          {values.dates.map((bookinDate: BookingDate, index: number) => (
            <Grid xs={2} item key={`fieldArray-dates-${index}`}>
              <Card>
                <CardContent>
                  <CloseIcon className={`pointer ${classes.closeIcon}`} onClick={() => arrayHelpers.remove(index)} />
                  <Typography variant='body1'>
                    {moment(bookinDate.date).format('dddd')}
                  </Typography>
                  <Typography variant='h5' component='span' color='primary'>
                    {moment(bookinDate.date).format('MMM D')}
                  </Typography>
                  <StyledFormControl>
                    <StyledLabel htmlFor='time-options'>
                      Arrival Time
                    </StyledLabel>
                    <Field type='time' name={`dates[${index}].arrivalTime`} />
                  </StyledFormControl>
                  <div role='group' aria-labelledby='time-options'>
                    <ArrayPeriodRadio
                      index={index}
                      label='Full Day'
                      name={`dates[${index}].period`}
                      fieldName='period'
                      value='WHOLE_DAY'
                    />
                    <ArrayPeriodRadio
                      index={index}
                      label='Morning'
                      name={`dates[${index}].period`}
                      fieldName='period'
                      value='MORNING'
                    />
                    <ArrayPeriodRadio
                      index={index}
                      label='Afternoon'
                      name={`dates[${index}].period`}
                      fieldName='period'
                      value='AFTERNOON'
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    />
  )
}
