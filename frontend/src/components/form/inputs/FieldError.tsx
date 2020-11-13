import React from 'react'
import { Field, getIn, FieldProps } from 'formik'

const FieldError = ({ name }: { name: string }) => (
  <Field name={name}>
    {({ form }: FieldProps) => {
      const error = getIn(form.errors, name)
      const touch = getIn(form.touched, name)
      return touch && error ? <span className='errorSpan'>{error}</span> : null
    }}
  </Field>
);

export default FieldError
