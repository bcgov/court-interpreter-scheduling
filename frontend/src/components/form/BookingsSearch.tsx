import React from 'react'

import moment from 'moment'

import {
  Box,
  Grid,
} from '@material-ui/core'

import {
  StyledFormControl,
  StyledLabel,
  StyledTextField,
  StyledFormLabel,
  StyledNativeSelect,
  StyledSelectInput,
  GridRow,
} from './inputs/DirectoryInputs'

import { Schema, Initial } from 'components/form/schemas/booking-search.schema'
import { ButtonPrimary } from 'components/Buttons'
import BookingsRange from 'components/form/BookingsRange'

import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik'

const dateFormat = 'MMM D, YYYY'

export default function Search({ getSearchResults }: { getSearchResults: Function }) {
  return (
    <Box>
      <Formik
        initialValues={Initial}
        validationSchema={Schema}
        onSubmit={async (values) => getSearchResults({ data: { ...values, dates: [values.dates] } })}>
          {({ handleSubmit, isSubmitting, values }: FormikProps<any>) => (
            <Form onSubmit={handleSubmit}>
              <GridRow container spacing={4}>

                <Grid item xs={3}>
                  <BookingsRange
                    text={
                      values.dates.startDate && values.dates.endDate
                        ? `${moment(values.dates.startDate).format(dateFormat)} to ${moment(values.dates.endDate).format(dateFormat)}`
                        : 'Select Date'
                    }
                  />
                  <ErrorMessage name='dates' render={msg => <div>{msg}</div>} />
                </Grid>

                <Grid item xs={3}>
                  <StyledFormControl>
                    <StyledLabel htmlFor='interpreter'>
                      Interpreter
                    </StyledLabel>
                    <Field name='interpreter'>
                      {({ field, form, ...props }: any) => (
                        <StyledTextField
                          id='interpreter'
                          variant='outlined'
                          size='small'
                          {...field}
                          {...props}
                        />
                      )}
                    </Field>
                    <ErrorMessage name='interpreter' />
                  </StyledFormControl>
                </Grid>

                <Grid item xs={3}>
                  <StyledFormControl>
                    <StyledFormLabel htmlFor='location'>
                      Location
                    </StyledFormLabel>
                    <StyledNativeSelect
                      input={
                        <Field component={({ field, form, ...props }: any) => (
                          <StyledSelectInput {...field} {...props} />
                        )} />
                      }
                      /* TODO set default value as clerk location */
                      id='location'
                      name='location'
                      variant='outlined'
                      defaultValue='Victora'
                    >
                      <option value='Victoria'>Victoria</option>
                      <option value='Nanaimo'>Nanaimo</option>
                      <option value='Courtenay'>Courtenay</option>
                      <option value='Abbotsford'>Abbotsford</option>
                      <option value='Vancouver'>Vancouver</option>
                    </StyledNativeSelect>
                    <ErrorMessage name='location' />
                  </StyledFormControl>
                </Grid>

                <Grid item xs={3}>
                  <StyledFormControl>
                    <StyledLabel htmlFor='file'>
                      Case Number
                    </StyledLabel>
                    <Field name='file'>
                      {({ field, form, ...props }: any) => (
                        <StyledTextField
                          id='file'
                          variant='outlined'
                          size='small'
                          {...field}
                          {...props}
                        />
                      )}
                    </Field>
                    <ErrorMessage name='file' />
                  </StyledFormControl>
                </Grid>

                <Grid item xs={2}>
                  <StyledFormControl>
                    <StyledFormLabel htmlFor='submit' />
                    <ButtonPrimary
                      type='submit'
                      variant='contained'
                      color='secondary'
                      disabled={isSubmitting}
                    >
                      Search
                    </ButtonPrimary>
                  </StyledFormControl>
                </Grid>

              </GridRow>
            </Form>
          )}
      </Formik>
    </Box>
  )
}
