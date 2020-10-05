import * as yup from 'yup'

const Initial = {
  dates: {
    startDate: '',
    endDate: '',
  },
  interpreter: '',
  location: '',
  file: '',
}

const Schema = yup.object({
  dates: yup.object({
    startDate: yup.string(),
    endDate: yup.string(),
  }),
  interpreter: yup.string(),
  location: yup.string(),
  file: yup.string(),
})

export { Schema, Initial }
