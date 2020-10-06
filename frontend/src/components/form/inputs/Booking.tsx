import React from 'react'
import moment from 'moment'

import CalendarIcon from '@material-ui/icons/CalendarToday'
import ClockIcon from '@material-ui/icons/Schedule'

import { withStyles } from '@material-ui/core'
import Hidden from '@material-ui/core/Hidden'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

import {
  StyledFormControl,
  StyledNativeSelect,
  StyledSelectInput,
  StyledTextField,
  StyledLabel,
} from './DirectoryInputs'

import { BookingDate, SearchParams } from 'constants/interfaces'
import { ErrorMessage, Field, FieldArray, ArrayHelpers, useFormikContext, FieldProps } from 'formik'

type GridItemInputProps = {
  name: string;
  label: string;
  rows?: any;
}

const StyledField = ({ name, label, rows = { xs: 6 } }: GridItemInputProps) => (
  <Grid item {...rows}>
    <StyledFormControl>
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
      <Field name={name}>
        {({ field, form, ...props }: any) => (
          <StyledTextField
            id={name}
            variant='outlined'
            size='small'
            {...field}
            {...props}
          />
        )}
      </Field>
    </StyledFormControl>
  </Grid>
)

const StyledRadios = () => {
  const { values } = useFormikContext()
  return (
    <Grid item xs={6}>
      <StyledFormControl>
        <StyledLabel htmlFor='federal'>Federal</StyledLabel>
        <Field name='federal' value={values.federal}>
          {({ form }: FieldProps) => (
            <React.Fragment>
              <RadioGroup row name='federal' onChange={(e) => form.setFieldValue('federal', e.target.value === 'yes')}>
                <FormControlLabel value='yes' control={<Radio color='primary' checked={values.federal === true} />} label='Yes' />
                <FormControlLabel value='no' control={<Radio color='primary' checked={values.federal === false} />} label='No' />
              </RadioGroup>
            </React.Fragment>
          )}
        </Field>
      </StyledFormControl>
    </Grid>
  )
}

const StyledSelect = ({ options, name, rows = { xs: 6 } }: { options: string[], name: string, rows?: GridItemInputProps['rows'] }) => (
  <Grid item {...rows}>
    <StyledFormControl>
      <StyledLabel htmlFor={name}>
        {name}
      </StyledLabel>
      <StyledNativeSelect
        input={
          <Field component={({ field, form, ...props }: any) => (
            <StyledSelectInput {...field} {...props} />
          )} />
        }
        id={name}
        name={name}
        variant='outlined'
      >
      {options.map((option, index) => (
        <option key={`${option}-${index}`} value={option}>{option}</option>
      ))}
      </StyledNativeSelect>
      <ErrorMessage name={name} />
    </StyledFormControl>
  </Grid>
)

const StyledBox = withStyles({
  root: {
    border: 'solid 1px #979797',
    borderRadius: '4px',
    padding: '8px',
    marginBottom: '8px',
  },
})(Box)

const Dates = ({ dates = [] }: { dates?: SearchParams['dates'] }) => (
  <Grid item xs={12} lg={4}>
    {dates.map((bookingDate: BookingDate, index: number) => (
      <StyledBox key={`bookingDate_${index}`}>
        <Grid justify='space-evenly' alignItems='center' container spacing={2}>
          <Grid style={{ alignItems: 'baseline', display: 'flex' }} xs={1} item><CalendarIcon /></Grid>
          <Grid xs={5} item>{moment(bookingDate.date).format('dddd, MMM D')}</Grid>
          <Grid style={{ alignItems: 'baseline', display: 'flex' }} xs={1} item><ClockIcon /></Grid>
          <Grid xs={5} item>{moment(bookingDate.arrivalTime, 'HH:mm').format('hh:mmA')}</Grid>
        </Grid>
      </StyledBox>
    ))}
  </Grid>
)

export default function BookingInputs ({ interpreter, search }: { interpreter?: any, search?: SearchParams }) {
  return (
    <Grid container spacing={4}>

      <StyledSelect rows={{ lg: 3, xs: 12 }} name='status' options={['Pending', 'Booked', 'Cancelled']} />
      <Grid item xs={8} />

      <Dates dates={search?.dates} />
      <Grid item xs={8} />

      <StyledField name='room' label='Court Room' rows={{ xs: 6, lg: 3 }} />
      <Hidden mdDown><Grid item xs={3} /></Hidden>
      <StyledField name='registry' label='Registry Location' rows={{ xs: 6, lg: 5 }} />

      <StyledField name='file' label='Court File Number' rows={{ xs: 6, lg: 3 }} />
      <Hidden mdDown><Grid item xs={3} /></Hidden>
      <StyledField name='interpretFor' label='Interpret For' rows={{ xs: 6, lg: 3 }} />

      <StyledField name='caseName' label='Case Name' />
      <StyledField name='requestedBy' label='Requested By' rows={{ xs: 6, lg: 3 }} />

      <StyledSelect name='language' options={interpreter?.languages.map((l: { language: { name: string } }) => l.language.name)} />

      <StyledRadios />

      <StyledField name='reason' label='Reason' />
      <StyledField name='prosecutor' label='Federal Prosecutor Name' />

      <Grid item xs={6}>
        <StyledFormControl>
          <StyledLabel htmlFor='comment'>Comment</StyledLabel>
          <Field name='comment'>
            {({ field, form, ...props }: any) => (
              <StyledTextField
                id='comment'
                variant='outlined'
                multiline
                rows={4}
                {...field}
                {...props}
              />
            )}
          </Field>
        </StyledFormControl>
      </Grid>
    </Grid>
  )
}
