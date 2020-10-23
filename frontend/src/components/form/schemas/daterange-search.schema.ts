import * as yup from 'yup'

const Initial = {
  arrivalTime: '09:00:00',
  dates: {
    startDate: '',
    endDate: '',
  },
  period: 'WHOLE_DAY',
}

const Schema = yup.object({
  dates: yup.object({
    startDate: yup.string().required(),
    endDate: yup.string().required(),
  }),
  arrivalTime: yup.string().required('An arrival time is required'),
  period: yup.string().required('You must select a period').matches(/MORNING|AFTERNOON|WHOLE_DAY/),
})

export { Schema, Initial }
