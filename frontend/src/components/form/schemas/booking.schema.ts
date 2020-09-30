import  * as yup from 'yup'

const Initial = {
  name: '',
  registry: '',
  file: '',
  interpretFor: '',
  caseName: '',
  requestedBy: '',
  federal: '',
  language: '',
  reason: '',
  prosecutor: '',
  comment: '',
}

const Schema = yup.object({
  name: yup.string(),
  registry: yup.string(),
  file: yup.string(),
  interpretFor: yup.string(),
  caseName: yup.string(),
  requestedBy: yup.string(),
  federal: yup.string().matches(/(yes|no)/),
  language: yup.string(),
  reason: yup.string(),
  prosecutor: yup.string(),
  comment: yup.string(),
})

export { Initial, Schema }
