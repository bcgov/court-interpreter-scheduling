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
import SearchDates from 'components/form/SearchDates'
import { Schema, Initial } from 'components/form/schemas/search.schema'
import Range from 'components/form/Range'
import Check from 'components/form/inputs/Check'
import { StyledButton } from 'components/Buttons'

import SearchContext from 'contexts/SearchContext'
import { ErrorMessage, Field, Formik, FormikProps, Form } from 'formik'
import { CourtLocationSelect } from './CourtLocationSelect'

export default function Search({ getSearchResults }: { getSearchResults: Function }) {
  const { search } = useContext(SearchContext)
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
          {({ handleSubmit, errors, isSubmitting, ...props }: FormikProps<any>) => (
            <Form onSubmit={handleSubmit}>
              <GridRow container spacing={4}>
                <Grid item xs={4}>
                  <StyledFormControl>
                    <StyledLabel htmlFor='language'>
                      Language
                    </StyledLabel>
                    <Field name='language'>
                      {({ field, form, ...props }: any) => (
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
                  {/* <StyledFormControl>
                    <StyledFormLabel htmlFor='city'>
                      Court Location
                    </StyledFormLabel>
                    <CourtLocationSelect
                      id='city'
                      name='city'/>
                    <ErrorMessage name='city' />
                  </StyledFormControl> */}
                </Grid>
              </GridRow>
              <GridRow container spacing={4} mt={2}>
                <Grid item xs={6}>
                  <Range />
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={4}>
                  <StyledFormControl>
                    <StyledFormLabel htmlFor='submit' />
                    <StyledButton
                      style={{ marginTop: '1.25rem' }}
                      type='submit'
                      variant='contained'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? '...' : 'Search'}
                    </StyledButton>
                  </StyledFormControl>
                </Grid>
              </GridRow>
              {search.dates.length > 0 && <SearchDates values={props.values} />}
            </Form>
          )}
      </Formik>
    </Box>
  )
}
