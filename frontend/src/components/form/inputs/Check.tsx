import React from 'react'
import { Field } from 'formik'
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
          component={({ field, form, ...props }: any) => (
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
