import React, { useContext } from 'react';
import moment from 'moment';

import { Box, FormGroup, Grid, Hidden } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AutocompleteInput from 'components/form/inputs/Autocomplete';
import { AutoCompleteLanguage } from 'components/form/inputs/AutocompleteLanguage';

import {
  StyledFormControl,
  StyledLabel,
  StyledTextField,
  StyledFormLabel,
  GridRow,
} from 'components/form/inputs/DirectoryInputs';

import { StyledFormDatePicker } from 'components/form/inputs/StyledDateAndTimeInput';

import {
  Schema,
  Initial,
} from 'components/form/schemas/interpreter-search.schema';
import Check from 'components/form/inputs/Check';
import { StyledButton } from 'components/Buttons';

import InterpreterSearchContext from 'contexts/InterpreterSearchContext';
import { courtLocations } from 'constants/courtLocations';
import { InterpreterSearchParams } from 'constants/interfaces';
import { ErrorMessage, Field, Formik, FormikProps, FieldProps } from 'formik';

const transformToBoolean = (value: string | null) => {
  return value ? (value === 'Active' ? true : false) : undefined;
};

export default function Search({
  getSearchResults,
}: {
  getSearchResults: Function;
}) {
  const { search } = useContext(InterpreterSearchContext);
  const activeStatusString = () => {
    if (search.active !== undefined) {
      return search.active ? 'Active' : 'Inactive';
    }
  };
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
        onSubmit={async (values) => getSearchResults(values)}
      >
        {({
          handleSubmit,
          isSubmitting,
        }: FormikProps<InterpreterSearchParams>) => (
          <>
            <GridRow container spacing={4}>
              <Grid item xs={4}>
                <StyledFormControl>
                  <StyledLabel htmlFor="name">Name</StyledLabel>
                  <Field name="name">
                    {({ field, form, ...props }: FieldProps) => (
                      <StyledTextField
                        id="name"
                        variant="outlined"
                        size="small"
                        placeholder="First, last or both"
                        {...field}
                        {...props}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="name" />
                </StyledFormControl>
              </Grid>
              <Grid item xs={4}>
                <Hidden xsUp>
                  <StyledFormControl>
                    <StyledFormLabel htmlFor="city">
                      Court Location
                    </StyledFormLabel>
                    <Field name="city">
                      {({ field, form, ...props }: FieldProps) => (
                        <Autocomplete
                          options={courtLocations}
                          getOptionLabel={(option) => option.name}
                          id="city"
                          size="small"
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              variant="outlined"
                              {...field}
                              {...props}
                            />
                          )}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="city" />
                  </StyledFormControl>
                </Hidden>
              </Grid>
              <Grid item xs={4}>
                <StyledFormControl>
                  <StyledLabel htmlFor="keywords">Keywords</StyledLabel>
                  <Field name="keywords">
                    {({ field, form, ...props }: FieldProps) => (
                      <StyledTextField
                        id="keywords"
                        variant="outlined"
                        size="small"
                        placeholder="Email, phone etc"
                        {...field}
                        {...props}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="keywords" />
                </StyledFormControl>
              </Grid>
            </GridRow>
            <GridRow container spacing={4} mt={2}>
              <Grid item xs={4}>
                <StyledFormControl>
                  <StyledLabel htmlFor="language">Language</StyledLabel>
                  <AutoCompleteLanguage
                    name="language"
                    initialValue={search?.language}
                  />
                  <ErrorMessage name="language" />
                </StyledFormControl>
              </Grid>
              <Grid item xs={4}>
                <StyledFormControl>
                  <StyledFormLabel>Level</StyledFormLabel>
                  <FormGroup aria-label="level" row>
                    <Check value="1" />
                    <Check value="2" />
                    <Check value="3" />
                    <Check value="4" />
                  </FormGroup>
                </StyledFormControl>
                <ErrorMessage name="level" />
              </Grid>
              <Grid item xs={4}>
                <StyledFormControl>
                  <StyledLabel htmlFor="active">Active/Inactive</StyledLabel>
                  <AutocompleteInput
                    fieldName="active"
                    options={['Active', 'Inactive']}
                    initialValue={activeStatusString()}
                    transform={transformToBoolean}
                  />
                  <ErrorMessage name="active" />
                </StyledFormControl>
              </Grid>
            </GridRow>
            <GridRow container spacing={4} mt={2}>
              <Grid item xs={4}>
                <StyledFormControl>
                  <StyledLabel htmlFor="criminalRecordCheck">
                    Criminal Record Check Expiry
                  </StyledLabel>
                  <Field name="criminalRecordCheck">
                    {({ field, form, ...props }: FieldProps) => (
                      <StyledFormDatePicker
                        {...field}
                        form={form}
                        inputVariant="outlined"
                        size="small"
                        clearable={true}
                        label="Input date"
                        placeholder="Select Date"
                        labelFunc={(date: any, invalidLabel: string) => {
                          if (field.value) {
                            return moment(date).format('YYYY-MM-DD');
                          } else {
                            return '';
                          }
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="criminalRecordCheck" />
                </StyledFormControl>
              </Grid>
              <Grid item xs={4}>
                <StyledFormControl>
                  <StyledFormLabel htmlFor="submit" />
                  <StyledButton
                    style={{ marginTop: '1.25rem' }}
                    type="submit"
                    variant="contained"
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
  );
}
