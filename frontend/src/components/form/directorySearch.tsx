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

import Range from './DateRangePicker'
import Check from './inputs/Check'

import { StyledButton } from 'vaping-regulation-shared-components'
import { Field, Formik, FormikProps } from 'formik'

export default function Search({ handleSearch }: { handleSearch: Function }) {

  return (
    <Box>
      <Formik
        initialValues={{
          language: '',
          level: [],
          location: 'Abbotsford',
          dates: {}
        }}
        onSubmit={(values) => handleSearch(values)}>
          {({ handleSubmit }: FormikProps<any>) => (
            <GridRow container spacing={4}>
              <Grid item xs={4}>
                <StyledFormControl>
                  <StyledLabel htmlFor='language'>
                    Language
                  </StyledLabel>
                  <Field
                    name='language'
                    component={({ field, form, ...props }: any) => (
                      <StyledTextField
                        id='language'
                        variant='outlined'
                        size='small'
                        {...field}
                        {...props}
                      />
                    )}
                  />
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
                  <StyledFormLabel htmlFor='location'>
                    Court Location
                  </StyledFormLabel>
                  <StyledNativeSelect
                    input={
                      <Field component={({ field, form, ...props }: any) => (
                        <StyledSelectInput
                          {...field}
                          {...props}
                        />
                      )} />
                    }
                    id='location'
                    name='location'
                    variant='outlined'
                  >
                    <option value='abbotsford'>Abbotsford</option>
                    <option value='vancouver'>Vancouver</option>
                    <option value='victoria'>Victoria</option>
                  </StyledNativeSelect>
                </StyledFormControl>
              </Grid>
              <Grid item xs={8}>
                <Range />
              </Grid>
              <Grid item xs={4}>
                <StyledFormControl>
                  <StyledFormLabel htmlFor='submit' />
                  <StyledButton style={{ marginTop: '1rem' }} type='submit' variant='contained' onClick={handleSubmit}>Search</StyledButton>
                </StyledFormControl>
              </Grid>
            </GridRow>
          )}
      </Formik>
    </Box>
  )
}
