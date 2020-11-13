import  * as yup from 'yup'

const Initial = {
  room: '',
  registry: '',
  file: '',
  interpretFor: '',
  caseName: '',
  requestedBy: '',
  federal: undefined,
  language: '',
  reason: '',
  prosecutor: '',
  comment: '',
}

const Schema = yup.object({
  room: yup.string(),
  registry: yup.string(),
  file: yup.string(),
  interpretFor: yup.string(),
  caseName: yup.string(),
  requestedBy: yup.string(),
  federal: yup.boolean(),
  language: yup.string(),
  reason: yup.string(),
  prosecutor: yup.string(),
  comment: yup.string(),
})

export { Initial, Schema }
