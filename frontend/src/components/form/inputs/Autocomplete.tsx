import React, { useEffect } from 'react';
import { useField } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { StyledTextField } from 'components/form/inputs/DirectoryInputs';

export default function AutocompleteInput({
  fieldName,
  options,
  initialValue,
  transform,
}: {
  fieldName: string;
  options: string[];
  initialValue?: string;
  transform?: (value: string | null) => any;
}) {
  const [field, , helpers] = useField(fieldName);
  useEffect(() => {
    if (initialValue) {
      transform
        ? helpers.setValue(transform(initialValue))
        : helpers.setValue(initialValue);
    }
  }, [initialValue]);
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option}
      size="small"
      inputValue={field.value || ''}
      onChange={(event, value) =>
        transform ? helpers.setValue(transform(value)) : helpers.setValue(value)
      }
      renderInput={(params) => (
        <StyledTextField {...params} variant="outlined" {...field} />
      )}
    />
  );
}
