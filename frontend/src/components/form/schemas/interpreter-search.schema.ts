import * as yup from 'yup'

const Initial = {
  name: '',
  language: '',
  level: [],
  city: '',
}

const Schema = yup.object({
  name: yup.string(),
  language: yup.string(),
  level: yup.array().of(yup.string().matches(/(1|2|3|4)/)),
  city: yup.string(),
})

export { Schema, Initial }
