import React from 'react'
import { Field, FieldProps} from 'formik'
import {
  Checkbox,
  Radio,
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

export function TextCheck ({ value, label, name, disabled = false }: { value: string, label: string, name: string, disabled?: boolean }) {
  return (
    <FormControlLabel
      label={label}
      labelPlacement='end'
      disabled={disabled}
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

export function SingleCheck ({ label, name }: { label: string, name: string }) {
  return (
    <FormControlLabel
      label={label}
      labelPlacement='end'
      control={
        <Field
          type='checkbox'
          name={name}
          component={({ field, form, ...props }: FieldProps) => (
            <Checkbox
              {...field}
              {...props}
              color='primary'
              checked={form.values[name]}
            />
          )}
        />
      }
    />
  )
}

export function PeriodRadio ({ value, label, name }: { value: string, label: string, name: string }) {
  return (
    <FormControlLabel
      label={label}
      labelPlacement='end'
      style={{
        display: 'block'
      }}
      control={
        <Field
          type='radio'
          name={name}
          value={value}
          component={({ field, form, ...props }: FieldProps) => (
            <Radio
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


export function ArrayPeriodRadio ({
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
          type='radio'
          name={name}
          value={value}
          component={({ field, form, ...props }: FieldProps) => (
            <Radio
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
