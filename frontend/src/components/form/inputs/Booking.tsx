import React from 'react'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'

import {
  StyledFormControl,
  StyledTextField,
  StyledLabel,
} from './DirectoryInputs'

import { Field } from 'formik'

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

const StyledRadios = () =>   (
  <Grid item xs={6}>
    <StyledFormControl>
      <StyledLabel htmlFor='federal'>Federal</StyledLabel>
      <div id='federal' style={{ display: 'flex', flexDirection: 'row', maxWidth: '120px', justifyContent: 'space-evenly'}}>
        <label>
          <Field type='radio' value={true} name='federal' />
          <span style={{ marginLeft: '4px' }}>Yes</span>
        </label>
        <label>
          <Field type='radio' value={false} name='federal' />
          <span style={{ marginLeft: '4px' }}>No</span>
        </label>
      </div>
    </StyledFormControl>
  </Grid>
)
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
