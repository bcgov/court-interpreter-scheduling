import * as yup from 'yup';

const Initial = {
  name: '',
  language: '',
  level: [],
  city: '',
};

const Schema = yup.object({
  name: yup.string().nullable(),
  language: yup.string().nullable(),
  level: yup
    .array()
    .of(yup.string().matches(/(1|2|3|4)/))
    .nullable(),
  city: yup.string().nullable(),
});

export { Schema, Initial };
