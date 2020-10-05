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
} from './inputs/DirectoryInputs'

import { SearchContext } from 'views/Directory'
import SearchDates from 'components/form/SearchDates'
import { Schema, Initial } from 'components/form/schemas/search.schema'
import Range from './Range'
import Check from './inputs/Check'

import { StyledButton } from 'vaping-regulation-shared-components'
import { ErrorMessage, Field, Formik, FormikProps } from 'formik'

export default function Search({ getSearchResults }: { getSearchResults: Function }) {
  return (
    <Box>
      <SearchContext.Consumer>
        {({ search, updateSearchContext }) => (
          <Formik
            initialValues={Initial}
            validationSchema={Schema}
            onSubmit={async (values) => {
              updateSearchContext({
                ...search,
                ...values,
              })
              await getSearchResults(values)
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
                            <Field component={({ field, form, ...props }: any) => (
                              <StyledSelectInput {...field} {...props} />
                            )} />
                          }
                          id='city'
                          name='city'
                          variant='outlined'
                        >
                          /* TODO set default value as clerk location */
                          <option selected value='Victoria'>Victoria</option>
                          <option value='Nanaimo'>Nanaimo</option>
                          <option value='Courtenay'>Courtenay</option>
                          <option value='Abbotsford'>Abbotsford</option>
                          <option value='Vancouver'>Vancouver</option>
                        </StyledNativeSelect>
                        <ErrorMessage name='city' />
                      </StyledFormControl>
                    </Grid>
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
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? '...' : 'Search'}
                        </StyledButton>
                      </StyledFormControl>
                    </Grid>
                  </GridRow>
                  {search.dates.length > 0 && (
                    <>
                      <SearchDates values={props.values} />
                      <ErrorMessage name='dates' />
                    </>
                  )}
                </>
              )}
          </Formik>
        )}
      </SearchContext.Consumer>
    </Box>
  )
}
