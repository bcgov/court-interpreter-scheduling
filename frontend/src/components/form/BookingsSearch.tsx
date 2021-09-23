import React, { useState, useEffect, useContext } from 'react';

import moment from 'moment';

import { Box, Grid, Button } from '@material-ui/core';

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
import {
  AutoCompleteField,
  ACFC,
} from 'components/form/inputs/AutoCompleteField';
import { Location } from 'constants/interfaces';
import { useAlert } from 'hooks/useAlert';
import BookingSearchContext from 'contexts/BookingSearchContext';

const dateFormat = 'MMM D, YYYY';

const ACField = AutoCompleteField as ACFC<Location>;

export default function Search({
  getSearchResults,
}: {
  getSearchResults: Function;
}) {
  const { updateSearchContext: setSearchContext } = useContext(BookingSearchContext);

  const [locations, setLocations] = useState<Location[]>([] as Location[]);
  const [userLocation, setUserLocation] = useState<Location | null | undefined>(
    null
  );
  useEffect(() => {
    (async function () {
      const fetchedLocations: Location[] = await getLocations();
      setLocations(fetchedLocations);
      const fetchedUserLocation: Location = await getUserLocation();
      if (fetchedUserLocation) {
        setUserLocation(
          fetchedLocations.find((l) => l.id === fetchedUserLocation?.id)
        );
        setSearchContext({ locationId: fetchedUserLocation?.id })
        getSearchResults({
          url: '/booking',
          method: 'GET',
          params: { locationId: fetchedUserLocation?.id },
        });
      } else {
        setUserLocation(null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLocations, setUserLocation]);

  const { addAlert } = useAlert();

  return (
    <Box>
      <Formik
        initialValues={{ ...Initial, locationId: userLocation?.id }}
        enableReinitialize
        validationSchema={Schema}
        onSubmit={async (values) => {
            const data = {
              ...values,
              dates: values?.dates?.startDate ? [values.dates] : []
            };
            data.isStartFromToday = data.dates.length === 0 ? true : data.isStartFromToday;
            setSearchContext(data);
            getSearchResults({
              url: '/booking/search',
              method: 'POST',
              data,
            })
          }
        }
      >
        {({ handleSubmit, isSubmitting, values }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            <GridRow container spacing={4}>
              <Grid item xs={6} md={3}>
                <ACField
                  name="locationId"
                  label="Court Location"
                  options={locations}
                  getOptionLabel={(option) => option.name}
                  value={userLocation}
                  onChange={(form) => (event, value) => {
                    setUserLocation(value);
                    form.setFieldValue('locationId', value?.id);
                  }}
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
                  onClick={async () => {
                    try {
                      await updateUserLocation(values.locationId);
                      addAlert('Your preferred location was saved');
                    } catch (err) {
                      addAlert(
                        'Fail to Update User Default Location: ',
                        err.message
                      );
                    }
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
                  <StyledLabel htmlFor="file">Court File Number</StyledLabel>
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
