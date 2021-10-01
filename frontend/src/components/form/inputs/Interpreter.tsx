import React from 'react';
import { Field, useFormikContext, FieldArray } from 'formik';
import moment from 'moment';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useKeycloak } from '@react-keycloak/web';
import { KeycloakInstance } from 'keycloak-js';

import {
  StyledFormControl,
  StyledTextField,
  StyledLabel,
} from 'components/form/inputs/DirectoryInputs';
import FieldError from 'components/form/inputs/FieldError';
import { SingleCheck } from 'components/form/inputs/Check';
import { StyledFormDatePicker } from 'components/form/inputs/StyledDateAndTimeInput';

import { Interpreter, Language } from 'constants/interfaces';

type GridItemInputProps = {
  name: string;
  label: string;
  rows?: any;
  initialValue?: any;
  disabled?: boolean;
  placeholder?: string;
};

// TODO: Create more effective check
const showNotDateData = (data?: string): boolean => {
  const regx = /^\d{1,2}-\w{3}-\d{2}$/gi;
  return !regx.test(data || '');
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
    </StyledFormControl>
    <FieldError name={name} />
  </Grid>
);

const StyledDateField = ({
  name,
  label,
  rows = { xs: 6 },
  initialValue,
}: GridItemInputProps) => {
  return (
    <Grid item {...rows}>
      <StyledFormControl>
        <StyledLabel htmlFor={name}>{label}</StyledLabel>
        <Field name={name}>
          {({ field, form, ...props }: any) => (
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
      </StyledFormControl>
      <FieldError name={name} />
    </Grid>
  );
};

export default function InterpreterInputs() {
  const { values } = useFormikContext<Interpreter>();
  const { keycloak } = useKeycloak<KeycloakInstance>();
  return (
    <Grid container spacing={6}>
      <StyledField
        name="firstName"
        label="First Name"
        rows={{ xs: 6, lg: 5 }}
      />
      <Hidden mdDown>
        <Grid item xs={1} />
      </Hidden>
      <StyledField name="lastName" label="Last Name" rows={{ xs: 6, lg: 5 }} />

      <Grid item xs={12}>
        <Typography variant="h6" color="primary">
          Languages
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <FieldArray name="languages">
          {(arrayHelpers) =>
            values.languages && values.languages.length > 0
              ? values.languages.map((language: Language, index: number) => (
                  <Grid
                    container
                    spacing={4}
                    key={`interpreter_language_${index}`}
                  >
                    <StyledField
                      name={`languages[${index}].languageName`}
                      label="Language"
                      rows={{ xs: 10, lg: 4 }}
                    />
                    <StyledField
                      name={`languages[${index}].level`}
                      label="Level"
                      rows={{ xs: 2, lg: 2 }}
                    />
                    <StyledField
                      name={`languages[${index}].commentOnLevel`}
                      label="Comment"
                      rows={{ xs: 11, lg: 5 }}
                    />
                    {index === values.languages.length - 1 ? (
                      <Grid
                        className="pointer"
                        style={{ display: 'flex', alignItems: 'flex-end' }}
                        item
                        xs={1}
                        onClick={() =>
                          arrayHelpers.push({
                            name: '',
                            level: null,
                            commentOnLevel: '',
                          })
                        }
                      >
                        <IconButton color="primary">
                          <AddIcon />
                        </IconButton>
                      </Grid>
                    ) : (
                      <Grid
                        className="pointer"
                        style={{ display: 'flex', alignItems: 'flex-end' }}
                        item
                        xs={1}
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        <IconButton color="primary">
                          <CloseIcon />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                ))
              : null
          }
        </FieldArray>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" color="primary">
          Contact
        </Typography>
      </Grid>

      <StyledField name="address" label="Address" rows={{ xs: 12, lg: 5 }} />
      <StyledField name="city" label="City" rows={{ xs: 12, lg: 3 }} />
      <StyledField name="postal" label="Postal Code" rows={{ xs: 10, lg: 3 }} />
      <StyledField name="province" label="Province" rows={{ xs: 2, lg: 1 }} />

      <StyledField name="phone" label="Phone" rows={{ xs: 12, lg: 3 }} />
      <StyledField
        name="homePhone"
        label="Home Phone"
        rows={{ xs: 12, lg: 3 }}
      />
      <StyledField
        name="businessPhone"
        label="Business Phone"
        rows={{ xs: 10, lg: 3 }}
      />
      <StyledField name="email" label="Email" rows={{ xs: 12, lg: 3 }} />

      <Grid item xs={12}>
        <Typography variant="h6" color="primary">
          Details
        </Typography>
      </Grid>

      <StyledField name="supplier" label="Supplier #" rows={{ xs: 12, lg: 4 }} />
      <StyledField name="siteCode" label="Site Code" rows={{ xs: 12, lg: 4 }} placeholder="001" />
      <StyledField name="gst" label="GST" rows={{ xs: 12, lg: 4 }}  />

      <StyledDateField
        name="criminalRecordCheckDate"
        label="Criminal Record Check Date"
        initialValue={values.criminalRecordCheckDate}
      />
      {showNotDateData(values.criminalRecordCheck) || !values.criminalRecordCheckDate ? (
        <StyledField
          name="criminalRecordCheck"
          label="Comment On Criminal Record Check"
          rows={{ xs: 4 }}
        />
      ) : null}
      <Grid item xs={2}>
        <SingleCheck name="contractExtension" label="Contract Active" />
      </Grid>

      <Grid item xs={12} lg={8}>
        <StyledFormControl>
          <StyledLabel htmlFor="comments">Comment</StyledLabel>
          <Field name="comments">
            {({ field, form, ...props }: any) => (
              <StyledTextField
                id="comments"
                variant="outlined"
                multiline
                rows={3}
                {...field}
                {...props}
              />
            )}
          </Field>
        </StyledFormControl>
      </Grid>
      {keycloak?.hasRealmRole('cis-admin') ? (
        <Grid item xs={8} lg={8}>
          <StyledFormControl>
            <StyledLabel htmlFor="adminComments">Admin Comment</StyledLabel>
            <Field name="adminComments">
              {({ field, form, ...props }: any) => (
                <StyledTextField
                  id="adminComments"
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
      ) : null}
    </Grid>
  );
}
