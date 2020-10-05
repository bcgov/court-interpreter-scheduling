import React from 'react'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

import {
  StyledFormControl,
  StyledTextField,
  StyledLabel,
} from './DirectoryInputs'

import { Field, useFormikContext, FieldProps } from 'formik'

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
            <RadioGroup name='federal' onChange={(e) => form.setFieldValue('federal', e.target.value === 'yes')}>
              <FormControlLabel value='yes' control={<Radio color='primary' checked={values.federal === true} />} label='Yes' />
              <FormControlLabel value='no' control={<Radio color='primary' checked={values.federal === false} />} label='No' />
            </RadioGroup>
          </React.Fragment>
        )}
      </Field>
    </StyledFormControl>
  </Grid>
)}
export default function BookingInputs () {
  return (
    <Grid container spacing={2}>

      <StyledField name='room' label='Court Room' rows={{ xs: 6, lg: 3 }} />
      <Hidden mdDown><Grid item xs={3} /></Hidden>
      <StyledField name='registry' label='Registry Location' rows={{ xs: 6, lg: 5 }} />

      <StyledField name='file' label='Court File Number' rows={{ xs: 6, lg: 3 }} />
      <Hidden mdDown><Grid item xs={3} /></Hidden>
      <StyledField name='interpretFor' label='Interpret For' rows={{ xs: 6, lg: 3 }} />

      <StyledField name='caseName' label='Case Name' />
      <StyledField name='requestedBy' label='Requested By' />

      <StyledField name='language' label='Language' />
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
