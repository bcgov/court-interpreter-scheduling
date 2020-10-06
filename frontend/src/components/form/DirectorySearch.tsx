import React from 'react'

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

import { SearchContext } from 'views/Directory'
import SearchDates from 'components/form/SearchDates'
import { Schema, Initial } from 'components/form/schemas/search.schema'
import Range from 'components/form/Range'
import Check from 'components/form/inputs/Check'

import { StyledButton } from 'components/Buttons'
import { ErrorMessage, Field, Formik, FormikProps } from 'formik'

export default function Search({ getSearchResults }: { getSearchResults: Function }) {
  return (
    <Box>
      <SearchContext.Consumer>
        {({ search }) => (
          <Formik
            /* TODO set default value as clerk location */
            initialValues={{
              ...Initial,
              city: 'Victoria',
            }}
            validationSchema={Schema}
            onSubmit={async (values) => {
              await getSearchResults({
                ...values,
                dates: search.dates,
              })
            }}>
              {({ handleSubmit, errors, isSubmitting, ...props }: FormikProps<any>) => (
                <>
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
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFormControl>
                        <StyledFormLabel htmlFor='city'>
                          Court Location
                        </StyledFormLabel>
                        <StyledNativeSelect
                          input={
                            <Field
                              component={
                                ({ field, form, ...props }: any) => (
                                  <StyledSelectInput {...field} {...props} />
                                )
                              }
                            />
                          }
                          id='city'
                          name='city'
                          variant='outlined'
                        >
                          <option value='Victoria'>Victoria</option>
                          <option value='Nanaimo'>Nanaimo</option>
                          <option value='Courtenay'>Courtenay</option>
                          <option value='Abbotsford'>Abbotsford</option>
                          <option value='Vancouver'>Vancouver</option>
                        </StyledNativeSelect>
                        <ErrorMessage name='city' />
                      </StyledFormControl>
                    </Grid>
                  </GridRow>
                  <GridRow container spacing={4} mt={2}>
                    <Grid item xs={8}>
                      <Range />
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFormControl>
                        <StyledFormLabel htmlFor='submit' />
                        <StyledButton
                          style={{ marginTop: '1rem' }}
                          type='submit'
                          variant='contained'
                          onClick={() => handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? '...' : 'Search'}
                        </StyledButton>
                      </StyledFormControl>
                    </Grid>
                  </GridRow>
                  {search.dates.length > 0 && <SearchDates values={props.values} />}
                </>
              )}
          </Formik>
        )}
      </SearchContext.Consumer>
    </Box>
  )
}
