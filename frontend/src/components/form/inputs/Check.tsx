import React from 'react'
import { Field, FieldProps} from 'formik'
import {
  Checkbox,
  FormControlLabel,
} from '@material-ui/core'

export default function Check ({ value }: { value: string }) {
  return (
    <FormControlLabel
      label={value}
      labelPlacement='end'
      control={
        <Field
          name='level'
          type='checkbox'
          value={value}
          component={({ field, form, ...props }: FieldProps) => (
            <Checkbox
              {...field}
              {...props}
              color='primary'
              checked={form.values.level.includes(value)}
            />
          )}
        />
      }
    />
  )
}

export function TextCheck ({ value, label, name }: { value: string, label: string, name: string }) {
  return (
    <FormControlLabel
      label={label}
      labelPlacement='end'
      control={
        <Field
          type='checkbox'
          name={name}
          value={value}
          component={({ field, form, ...props }: FieldProps) => (
            <Checkbox
              {...field}
              {...props}
              color='primary'
              checked={form.values[name]?.includes(value)}
            />
          )}
        />
      }
    />
  )
}

export function ArrayPeriodCheckbox ({
  value,
  label,
  name,
  index,
  fieldName,
}: {
  value: string,
  label: string,
  name: string,
  fieldName: string,
  index: number,
}) {
  return (
    <FormControlLabel
      label={label}
      labelPlacement='end'
      control={
        <Field
          type='checkbox'
          name={name}
          value={value}
          component={({ field, form, ...props }: FieldProps) => (
            <Checkbox
              {...field}
              {...props}
              color='primary'
              checked={form.values.dates[index][fieldName]?.includes(value)}
            />
          )}
        />
      }
    />
  )
}
