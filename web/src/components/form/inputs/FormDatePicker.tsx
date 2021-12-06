import * as React from 'react';
import { DatePicker, DatePickerProps } from '@material-ui/pickers';

interface InputProp extends DatePickerProps {
  name: string;
  label?: string;
  format?: string;
  form: { setFieldValue: Function };
  value: any;
}

export default function (props: InputProp) {
  return (
    <DatePicker
      label={props.label}
      format={props.format || 'yyyy-MM-dd'}
      {...props}
      onChange={(value) => props.form.setFieldValue(props.name, value)}
    />
  );
}
