import React, { useContext } from 'react'

import {
  Box,
  FormGroup,
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
} from 'components/form/inputs/DirectoryInputs'
import { Schema, Initial } from 'components/form/schemas/interpreter-search.schema'
import Check from 'components/form/inputs/Check'
import { StyledButton } from 'components/Buttons'

import InterpreterSearchContext from 'contexts/InterpreterSearchContext'
import { InterpreterSearchParams } from 'constants/interfaces'
import { ErrorMessage, Field, Formik, FormikProps, FieldProps } from 'formik'
import { CourtLocationSelect } from './CourtLocationSelect'

export default function Search({ getSearchResults }: { getSearchResults: Function }) {
  const { search } = useContext(InterpreterSearchContext)
  return (
    <Box>
      <Formik
        /* TODO set default value as clerk location */
        initialValues={{
          ...Initial,
          ...search,
          city: '',
        }}
        enableReinitialize={true}
        validationSchema={Schema}
        onSubmit={async (values) => getSearchResults(values)}>
          {({ handleSubmit, isSubmitting }: FormikProps<InterpreterSearchParams>) => (
            <>
              <GridRow container spacing={4}>
                <Grid item xs={4}>
                  <StyledFormControl>
                    <StyledLabel htmlFor='name'>
                      Name
                    </StyledLabel>
                    <Field name='name'>
                      {({ field, form, ...props }: FieldProps) => (
                        <StyledTextField
                          id='name'
                          variant='outlined'
                          size='small'
                          placeholder='First, last or both'
                          {...field}
                          {...props}
                        />
                      )}
                    </Field>
                    <ErrorMessage name='name' />
                  </StyledFormControl>
                </Grid>
                {/* <Grid item xs={4}>
                  <StyledFormControl>
                    <StyledFormLabel htmlFor='city'>
                      Court Location
                    </StyledFormLabel>
                    <CourtLocationSelect
                      id='city'
                      name='city'/>
                    <ErrorMessage name='city' />
                  </StyledFormControl>
                </Grid> */}
                <Grid item xs={4}>
                  <StyledFormControl>
                    <StyledLabel htmlFor='keywords'>
                      Keywords
                    </StyledLabel>
                    <Field name='keywords'>
                      {({ field, form, ...props }: FieldProps) => (
                        <StyledTextField
                          id='keywords'
                          variant='outlined'
                          size='small'
                          placeholder='Email, phone etc'
                          {...field}
                          {...props}
                        />
                      )}
                    </Field>
                    <ErrorMessage name='keywords' />
                  </StyledFormControl>
                </Grid>
              </GridRow>
              <GridRow container spacing={4} mt={2}>
                <Grid item xs={4}>
                  <StyledFormControl>
                    <StyledLabel htmlFor='language'>
                      Language
                    </StyledLabel>
                    <Field name='language'>
                      {({ field, form, ...props }: FieldProps) => (
                        <StyledTextField
                          id='language'
                          variant='outlined'
                          size='small'
                          {...field}
                          {...props}
                        />
                      )}
                    </Field>
                    <ErrorMessage name='language' />
                  </StyledFormControl>
                </Grid>
                <Grid item xs={4}>
                  <StyledFormControl>
                    <StyledFormLabel>
                      Level
                    </StyledFormLabel>
                    <FormGroup aria-label='level' row>
                      <Check value='1' />
                      <Check value='2' />
                      <Check value='3' />
                      <Check value='4' />
                    </FormGroup>
                  </StyledFormControl>
                  <ErrorMessage name='level' />
                </Grid>
                <Grid item xs={4}>
                  <StyledFormControl>
                    <StyledFormLabel htmlFor='submit' />
                    <StyledButton
                      style={{ marginTop: '1.25rem' }}
                      type='submit'
                      variant='contained'
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? '...' : 'Search'}
                    </StyledButton>
                  </StyledFormControl>
                </Grid>
              </GridRow>
            </>
          )}
      </Formik>
    </Box>
  )
}
