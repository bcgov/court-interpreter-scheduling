import React, { useEffect } from 'react'
import { useField } from 'formik'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { StyledTextField } from 'components/form/inputs/DirectoryInputs'

export default function AutocompleteInput ({
  fieldName,
  options,
  initialValue,
}: {
  fieldName: string;
  options: string[];
  initialValue?: string;
}) {
  const [field, , helpers] = useField(fieldName)
  const transformToBoolean = (value: string | null) => {
    return value ? ((value === 'Active') ? true : false) : undefined;
  }; 
  useEffect(() => {
    if (initialValue) helpers.setValue(initialValue)
  }, [initialValue])
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option}
      size='small'
      inputValue={field.value}
      onChange={(event, value) => helpers.setValue(transformToBoolean(value))}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          variant='outlined'
          {...field}
        />
      )}
    />
  )
}
