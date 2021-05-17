import * as yup from 'yup'

const Initial = {
  firstName: '',
  lastName: '',
  languages: [{
    languageName: '',
    level: '',
    commentOnLevel: ''
  }],
  address: '',
  city: '',
  province: 'BC',
  postal: '',
  homePhone: '',
  businessPhone: '',
  phone: '',
  email: '',
  supplier: '',
  gst: '',
  comments: '',
  contractExtension: false,
  contractTermination: false,
  siteCode: '',
}

const Schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  languages: yup.array().of(yup.object({
    languageName: yup.string(),
    level: yup.string().matches(/(1|2|3|4)/, 'Level must be a number from 1-4'),
    comment: yup.string(),
  })),
  address: yup.string(),
  city: yup.string(),
  province: yup.string(),
  postal: yup.string(),
  homePhone: yup.string(),
  businessPhone: yup.string(),
  phone: yup.string(),
  email: yup.string().email('Please provide a valid email'),
  supplier: yup.string(),
  gst: yup.string(),
  comments: yup.string(),
  contractExtension: yup.boolean(),
  contractTermination: yup.boolean(),
  siteCode: yup.string().matches(/^\d{3}$/, 'Site Code must be 3 digits with leading zeros'),
})

export { Schema, Initial }
