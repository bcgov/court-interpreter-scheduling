import * as yup from 'yup'

const Initial = {
  language: '',
  level: [],
  city: '',
  dates: [],
}

const Schema = yup.object({
  language: yup.string(),
  level: yup.array().of(yup.string().matches(/(1|2|3|4)/)),
  city: yup.string(),
  dates: yup.array().of(yup.object({
    date: yup.string(),
    arrival: yup.string(),
    period: yup.string().matches(/MORNING|AFTERNOON|WHOLE_DAY/)
  }))
})

export { Schema, Initial }
