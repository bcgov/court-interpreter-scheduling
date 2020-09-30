import * as yup from 'yup'

const Initial = {
  language: '',
  level: [],
  location: '',
}

const Schema = yup.object({
  language: yup.string(),
  level: yup.array().of(yup.string().matches(/(1|2|3|4)/)),
  location: yup.string(),
})

export { Schema, Initial }
