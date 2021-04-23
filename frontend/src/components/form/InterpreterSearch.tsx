import React, { useContext, useEffect, useState } from 'react';

import { Box, FormGroup, Grid, Hidden } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {
  StyledFormControl,
  StyledLabel,
  StyledTextField,
  StyledFormLabel,
  GridRow,
} from 'components/form/inputs/DirectoryInputs';
import AutocompleteInput from 'components/form/inputs/Autocomplete';
import SearchDates from 'components/form/SearchDates';
import { Schema, Initial } from 'components/form/schemas/search.schema';
import Range from 'components/form/Range';
import Check, { TextCheck } from 'components/form/inputs/Check';
import { StyledButton } from 'components/Buttons';

import { languages } from 'constants/languages';
import SearchContext from 'contexts/SearchContext';
import {
  ErrorMessage,
  Field,
  FieldProps,
  Formik,
  FormikProps,
  Form,
} from 'formik';
import { withFlag } from 'components/reusable/withFlag';
import { getLocations, Location } from 'util/locationFetch';

const WithFlagRange = withFlag(Range);

export default function Search({
  getSearchResults,
}: {
  getSearchResults: Function;
}) {
  const { search } = useContext(SearchContext);

  const [locations, setLocations] = useState<Location[]>([]);
  useEffect(() => {
    async function fetchLocation() {
      const fetchedLocations = await getLocations();
      setLocations(fetchedLocations);
    }
    fetchLocation();
  }, []);

  return (
    <Box>
      <Formik
        /* TODO set default value as clerk location */
        initialValues={{
          ...Initial,
          ...search,
          city: '',
          courtAddr: '',
          distanceLimit: [],
        }}
        enableReinitialize={true}
        validationSchema={Schema}
        onSubmit={async (values) => {
          const payload:any = {...values};
          if(payload.distanceLimit.length > 0) {
            payload.distanceLimit = payload.distanceLimit[0]
          }else {
            payload.distanceLimit = null;
          }
          getSearchResults(payload)}}
      >
        {({
          handleSubmit,
          errors,
          isSubmitting,
          ...props
        }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            <GridRow container spacing={4}>
              <Grid item xs={4}>
                <StyledFormControl>
                  <StyledLabel htmlFor="language">Language</StyledLabel>
                  <AutocompleteInput
                    fieldName="language"
                    options={languages}
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
                  <StyledFormLabel htmlFor="courtAddr">
                    Court Location
                  </StyledFormLabel>
                  <Field name="courtAddr">
                    {({ field, form, ...props }: FieldProps) => (
                      <Autocomplete
                        options={locations}
                        getOptionLabel={(option) => option.name}
                        id="courtAddr"
                        size="small"
                        onChange={(event, value) =>
                          form.setFieldValue(
                            'courtAddr',
                            value?.addressLine1 || ''
                          )
                        }
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
                <TextCheck
                  value={'32'}
                  label="Limit Search to 32KM"
                  name="distanceLimit"
                  disabled={!props.values.courtAddr}
                />
              </Grid>
            </GridRow>
            <GridRow container spacing={4} mt={2}>
              <Grid item xs={6}>
                <WithFlagRange />
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={4}>
                <StyledFormControl>
                  <StyledFormLabel htmlFor="submit" />
                  <StyledButton
                    style={{ marginTop: '1.25rem' }}
                    type="submit"
                    variant="contained"
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
  );
}
