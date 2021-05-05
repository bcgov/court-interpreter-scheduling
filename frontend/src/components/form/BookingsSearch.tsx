import React, { useState, useEffect } from 'react';

import moment from 'moment';

import { Box, Grid, Button, Icon } from '@material-ui/core';

import {
  StyledFormControl,
  StyledLabel,
  StyledTextField,
  StyledFormLabel,
  GridRow,
} from './inputs/DirectoryInputs';

import { Schema, Initial } from 'components/form/schemas/booking-search.schema';
import { ButtonPrimary } from 'components/Buttons';
import BookingsRange from 'components/form/BookingsRange';
import SaveIcon from '@material-ui/icons/Save';

import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import {
  getLocations,
  getUserLocation,
  updateUserLocation,
} from 'util/apiHelper';
import { AutoCompleteField, ACFC } from './inputs/AutoCompleteField';
import { Location } from 'constants/interfaces';

const dateFormat = 'MMM D, YYYY';

const ACField = AutoCompleteField as ACFC<Location>;

export default function Search({
  getSearchResults,
}: {
  getSearchResults: Function;
}) {
  const [locations, setLocations] = useState<Location[]>([] as Location[]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  useEffect(() => {
    async function fetchLocation() {
      const fetchedLocations: Location[] = await getLocations();
      setLocations(fetchedLocations);
      const fetchedUserLocation: Location = await getUserLocation();
      console.dir(fetchedUserLocation);
      setUserLocation(fetchedUserLocation);
    }
    fetchLocation();
  }, [setLocations, setUserLocation]);
  return (
    <Box>
      <Formik
        initialValues={Initial}
        validationSchema={Schema}
        onSubmit={async (values) =>
          getSearchResults({
            url: '/booking/search',
            method: 'POST',
            data: {
              ...values,
              dates: values?.dates?.startDate ? [values.dates] : [],
            },
          })
        }
      >
        {({ handleSubmit, isSubmitting, values }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            <GridRow container spacing={4}>
              <Grid item xs={6} md={3}>
                <ACField
                  name="locationId"
                  label="Registry Location"
                  options={locations}
                  getOptionLabel={(option) => option.name}
                  defaultValue={userLocation}
                  onChange={(form) => (event, value) =>
                    form.setFieldValue('locationId', value?.id)}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledLabel htmlFor="save">Save Location</StyledLabel>
                <Button
                  disabled={!values.locationId}
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={() => {
                    updateUserLocation(values.locationId);
                  }}
                >
                  Save
                </Button>
              </Grid>
            </GridRow>
            <GridRow container spacing={4}>
              <Grid item xs={6} md={3}>
                <BookingsRange
                  text={
                    values.dates.startDate && values.dates.endDate
                      ? `${moment(values.dates.startDate).format(
                          dateFormat
                        )} to ${moment(values.dates.endDate).format(
                          dateFormat
                        )}`
                      : `${moment().format(dateFormat)} to ${moment()
                          .add(30, 'days')
                          .format(dateFormat)}`
                  }
                />
                <ErrorMessage name="dates" render={(msg) => <div>{msg}</div>} />
              </Grid>

              <Grid item xs={6} md={3}>
                <StyledFormControl>
                  <StyledLabel htmlFor="interpreter">Interpreter</StyledLabel>
                  <Field name="interpreter">
                    {({ field, form, ...props }: any) => (
                      <StyledTextField
                        id="interpreter"
                        variant="outlined"
                        size="small"
                        {...field}
                        {...props}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="interpreter" />
                </StyledFormControl>
              </Grid>

              <Grid item xs={6} md={3}>
                <StyledFormControl>
                  <StyledLabel htmlFor="file">Case Number</StyledLabel>
                  <Field name="file">
                    {({ field, form, ...props }: any) => (
                      <StyledTextField
                        id="file"
                        variant="outlined"
                        size="small"
                        {...field}
                        {...props}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="file" />
                </StyledFormControl>
              </Grid>
            </GridRow>
            <GridRow container spacing={4}>
              <Grid item xs={12} md={3}>
                <StyledFormControl>
                  <StyledFormLabel htmlFor="submit" />
                  <ButtonPrimary
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={isSubmitting}
                  >
                    Search
                  </ButtonPrimary>
                </StyledFormControl>
              </Grid>
            </GridRow>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
