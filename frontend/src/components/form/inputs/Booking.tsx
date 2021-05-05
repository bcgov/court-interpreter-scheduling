import React, { useEffect, useState } from 'react';
import moment from 'moment';

import CalendarIcon from '@material-ui/icons/CalendarToday';
import ClockIcon from '@material-ui/icons/Schedule';

import { styled } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { getLocations } from 'util/locationFetch';
import { Location } from 'constants/interfaces';

import {
  StyledFormControl,
  StyledNativeSelect,
  StyledSelectInput,
  StyledTextField,
  StyledLabel,
} from 'components/form/inputs/DirectoryInputs';
import EditBookingDates from 'components/form/inputs/EditBookingDates';

import { Booking, BookingDate, SearchParams } from 'constants/interfaces';
import { ErrorMessage, Field, useFormikContext, FieldProps } from 'formik';
import { fixLanguageName } from 'constants/languages';
import { AutoCompleteField, ACFC } from './AutoCompleteField';

const ACField = AutoCompleteField as ACFC<Location>;

type GridItemInputProps = {
  name: string;
  label: string;
  rows?: any;
  placeholder?: string;
};

const StyledField = ({ name, label, rows = { xs: 6 }, placeholder }: GridItemInputProps) => (
  <Grid item {...rows}>
    <StyledFormControl>
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
      <Field name={name}>
        {({ field, form, ...props }: any) => (
          <StyledTextField
            id={name}
            variant="outlined"
            size="small"
            placeholder={placeholder}
            {...field}
            {...props}
          />
        )}
      </Field>
      <ErrorMessage name={name}>
        { msg => <div style={{ color: '#D0454C' }}>{msg}</div> }
      </ErrorMessage>
    </StyledFormControl>
  </Grid>
);

const StyledRadios = () => {
  const { values } = useFormikContext<Booking>();
  return (
    <Grid item xs={6}>
      <StyledFormControl>
        <StyledLabel htmlFor="federal">Federal</StyledLabel>
        <Field name="federal" value={values.federal}>
          {({ form }: FieldProps) => (
            <React.Fragment>
              <RadioGroup
                row
                name="federal"
                onChange={(e) =>
                  form.setFieldValue('federal', e.target.value === 'yes')
                }
              >
                <FormControlLabel
                  value="yes"
                  control={
                    <Radio color="primary" checked={values.federal === true} />
                  }
                  label="Yes"
                />
                <FormControlLabel
                  value="no"
                  control={
                    <Radio color="primary" checked={values.federal === false} />
                  }
                  label="No"
                />
              </RadioGroup>
            </React.Fragment>
          )}
        </Field>
      </StyledFormControl>
    </Grid>
  );
};

const StyledSelect = ({
  options = [],
  name,
  rows = { xs: 6 },
  label,
}: {
  options: string[];
  name: string;
  rows?: GridItemInputProps['rows'];
  label?: string;
}) => (
  <Grid item {...rows}>
    <StyledFormControl>
      <StyledLabel htmlFor={label || name}>{label || name}</StyledLabel>
      <StyledNativeSelect
        input={
          <Field
            component={({ field, form, ...props }: any) => (
              <StyledSelectInput {...field} {...props} />
            )}
          />
        }
        id={name}
        name={name}
        variant="outlined"
      >
        {options.map((option, index) => (
          <option key={`${option}-${index}`} value={option}>
            {option}
          </option>
        ))}
      </StyledNativeSelect>
    </StyledFormControl>
  </Grid>
);

const StyledGridItem = styled(Grid)({
  border: 'solid 1px #979797',
  borderRadius: '4px',
  padding: '8px',
});

export const Dates = ({ dates = [] }: { dates?: SearchParams['dates'] }) => (
  <Grid container spacing={4}>
    {dates.map((bookingDate: BookingDate, index: number) => (
      <Grid item xs={12} sm={6} md={4} key={`bookingDate_${index}`}>
        <StyledGridItem justify="space-evenly" alignItems="center" container>
          <Grid item container alignItems="center" xs={6}>
            <CalendarIcon />
            <Box component="span" pl={1}>
              {moment(bookingDate.date).format('ddd, MMM D')}
            </Box>
          </Grid>
          <Grid item container alignItems="center" xs={6}>
            <ClockIcon />
            <Box component="span" pl={1}>
              {moment(bookingDate.arrivalTime, 'HH:mm').format('hh:mmA')}
            </Box>
          </Grid>
        </StyledGridItem>
      </Grid>
    ))}
  </Grid>
);

export default function BookingInputs({
  interpreter,
  search,
  booking,
  edit,
}: {
  interpreter?: any;
  search?: SearchParams;
  booking?: Booking;
  edit?: boolean;
}) {
  const [locations, setLocations] = useState<Location[]>([]);
  useEffect(() => {
    async function fetchLocation() {
      const fetchedLocations = await getLocations();
      setLocations(fetchedLocations);
    }
    fetchLocation();
  }, []);

  return (
    <Grid container spacing={4}>
      <StyledSelect
        rows={{ md: 3, sm: 6, xs: 12 }}
        name="status"
        options={['Pending', 'Booked', 'Cancelled']}
      />
      <Hidden only="xs">
        <Grid item sm={6} md={9} />
      </Hidden>

      <Grid item xs={12}>
        {edit ? (
          <EditBookingDates dates={booking?.dates} />
        ) : (
          <Dates dates={search?.dates} />
        )}
      </Grid>

      <StyledField name="room" label="Court Room" rows={{ xs: 6, lg: 3 }} />
      <Hidden mdDown>
        <Grid item xs={3} />
      </Hidden>

      {/* location */}
      <Grid item xs={6}>
        <ACField
          name="locationId"
          label="Registry Location"
          options={locations}
          getOptionLabel={(option) => option.name}
          defaultValue={booking?.location || search?.location}
          onChange={(form) => (event, value) =>
            form.setFieldValue('locationId', value?.id)}
        />
      </Grid>

      <StyledField
        name="file"
        label="Court File Number"
        rows={{ xs: 6, lg: 3 }}
      />
      <Hidden mdDown>
        <Grid item xs={3} />
      </Hidden>
      <StyledField
        name="interpretFor"
        label="Interpret For"
        rows={{ xs: 6, lg: 3 }}
      />

      <StyledField name="caseName" label="Case Name" />
      <StyledField
        name="requestedBy"
        label="Requested By"
        rows={{ xs: 6, lg: 3 }}
      />

      {edit ? (
        <StyledField name="language" label="Language" />
      ) : (
        <StyledSelect
          name="language"
          options={interpreter?.languages
            .map(fixLanguageName)
            .map((l: { languageName: string }) => l.languageName)}
        />
      )}

      <StyledRadios />

      <StyledField name="reason" label="Reason Code" placeholder="FA, HR"/>
      <StyledField name="prosecutor" label="Federal Prosecutor Name" />

      <Grid item xs={6}>
        <StyledFormControl>
          <StyledLabel htmlFor="comment">Comment</StyledLabel>
          <Field name="comment">
            {({ field, form, ...props }: any) => (
              <StyledTextField
                id="comment"
                variant="outlined"
                multiline
                rows={4}
                {...field}
                {...props}
              />
            )}
          </Field>
        </StyledFormControl>
      </Grid>
    </Grid>
  );
}
