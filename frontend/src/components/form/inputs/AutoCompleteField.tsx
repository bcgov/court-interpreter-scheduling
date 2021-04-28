import React from 'react';
import {
  StyledFormControl,
  StyledTextField,
  StyledFormLabel,
} from 'components/form/inputs/DirectoryInputs';
import { ErrorMessage, Field, FieldProps, FormikProps } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';

interface IProps<T> {
  name: string;
  label: string;
  defaultValue?: T | null;
  options: T[];
  getOptionLabel: (option: T) => string;
  onChange: (
    form: FormikProps<any>
  ) => (event: React.ChangeEvent<{}>, value: T) => void;
}
export type ACFC<T = any> = React.FC<IProps<T>>;

export const AutoCompleteField: ACFC = ({
  name,
  label,
  defaultValue,
  options,
  getOptionLabel,
  onChange,
}) => (
  <StyledFormControl>
    <StyledFormLabel htmlFor={name}>{label}</StyledFormLabel>
    <Field name={name}>
      {({ field, form, ...props }: FieldProps) => (
        <Autocomplete
          options={options}
          getOptionLabel={getOptionLabel}
          id={name}
          size="small"
          onChange={onChange(form)}
          defaultValue={defaultValue}
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
    <ErrorMessage name={name} />
  </StyledFormControl>
);
