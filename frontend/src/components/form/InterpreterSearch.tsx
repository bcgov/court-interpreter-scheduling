import React, { useContext, useEffect, useState } from 'react';

import { Box, FormGroup, Grid } from '@material-ui/core';

import {
  StyledFormControl,
  StyledLabel,
  StyledFormLabel,
  GridRow,
} from 'components/form/inputs/DirectoryInputs';
import AutocompleteInput from 'components/form/inputs/Autocomplete';
import SearchDates from 'components/form/SearchDates';
import { Schema, Initial } from 'components/form/schemas/search.schema';
import Range from 'components/form/Range';
import Check, { SingleCheck } from 'components/form/inputs/Check';
import { StyledButton } from 'components/Buttons';

import { languages } from 'constants/languages';
import SearchContext from 'contexts/SearchContext';
import { ErrorMessage, Formik, FormikProps, Form } from 'formik';
import { withFlag } from 'components/reusable/withFlag';
import { getLocations } from 'util/locationFetch';
import { Location } from 'constants/interfaces';
import { AutoCompleteField, ACFC } from './inputs/AutoCompleteField';

const WithFlagRange = withFlag(Range);

const ACField = AutoCompleteField as ACFC<Location>;

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
        }}
        enableReinitialize={true}
        validationSchema={Schema}
        onSubmit={async (values) => getSearchResults(values)}
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
                <ACField
                  name="courtAddr"
                  label="Court Location"
                  options={locations}
                  getOptionLabel={(option) => option.name}
                  onChange={(form) => (event, value) => {
                    form.setFieldValue('courtAddr', value?.addressLine1 || '');
                    form.setFieldValue('location', value);
                  }
                }
                />
                <SingleCheck
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
