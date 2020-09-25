import React from 'react'

import {
  Box,
  FormControl,
  FormGroup,
  Grid,
} from '@material-ui/core'

import {
  StyledLabel,
  StyledTextField,
  StyledFormLabel,
  StyledNativeSelect,
  StyledSelectInput,
  FlexBox,
} from './inputs/directory'

import Range from './dateRangePicker'
import Check from './inputs/check'

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
        onSubmit={(values) => {
          console.dir(values)
          handleSearch(values)
        }}>
          {({ handleSubmit }: FormikProps<any>) => (
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <FormControl>
                  <StyledLabel htmlFor='language'>
                    Language
                  </StyledLabel>
                  <Field name='language' component={({ field, form, ...props }: any) => (
                    <StyledTextField
                      id='language'
                      variant='outlined'
                      size='small'
                      {...field}
                      {...props}
                      />
                    )} />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl component='fieldset' style={{ marginTop: '1.75rem' }}>
                  <StyledFormLabel>
                    Level
                  </StyledFormLabel>
                  <FormGroup aria-label='level' row style={{ marginTop: '4px' }}>
                    <Check value='1' />
                    <Check value='2' />
                    <Check value='3' />
                    <Check value='4' />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl style={{ marginTop: '1.75rem' }}>
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
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <Range />
              </Grid>
              <Grid item xs={4}>
                <FlexBox>
                  <StyledButton type='submit' variant='contained' onClick={handleSubmit}>Search</StyledButton>
                </FlexBox>
              </Grid>
            </Grid>
          )}
      </Formik>
    </Box>
  )
}
