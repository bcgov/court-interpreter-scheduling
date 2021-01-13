import React, { useContext } from 'react'

import {
  Box,
  FormGroup,
  Grid,
  Hidden,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import {
  StyledFormControl,
  StyledLabel,
  StyledTextField,
  StyledFormLabel,
  GridRow,
} from 'components/form/inputs/DirectoryInputs'
import AutocompleteInput from 'components/form/inputs/Autocomplete'
import SearchDates from 'components/form/SearchDates'
import { Schema, Initial } from 'components/form/schemas/search.schema'
import Range from 'components/form/Range'
import Check from 'components/form/inputs/Check'
import { StyledButton } from 'components/Buttons'

import { languages } from 'constants/languages'
import { courtLocations } from 'constants/courtLocations'
import SearchContext from 'contexts/SearchContext'
import { ErrorMessage, Field, FieldProps, Formik, FormikProps, Form } from 'formik'

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
                    <AutocompleteInput
                      fieldName='language'
                      options={languages}
                      initialValue={search?.language}
                    />
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
                  <Hidden xsUp>
                    <StyledFormControl>
                      <StyledFormLabel htmlFor='city'>
                        Court Location
                      </StyledFormLabel>
                      <Field name='city'>
                        {({ field, form, ...props }: FieldProps) => (
                          <Autocomplete
                            options={courtLocations}
                            getOptionLabel={(option) => option.name}
                            id='city'
                            size='small'
                            onChange={(event, value) => form.setFieldValue('city', value || '')}
                            renderInput={(params) => (
                              <StyledTextField
                                {...params}
                                variant='outlined'
                                {...field}
                                {...props}
                              />
                            )}
                          />
                        )}
                      </Field>
                      <ErrorMessage name='city' />
                    </StyledFormControl>
                  </Hidden>
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
