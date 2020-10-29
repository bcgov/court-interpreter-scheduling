import * as yup from 'yup'

const Initial = {
  arrivalTime: '09:00:00',
  dates: [],
  period: 'WHOLE_DAY',
}

const Schema = yup.object({
  dates: yup.array(yup.string()),
  arrivalTime: yup.string().required('An arrival time is required'),
  period: yup.string().required('You must select a period').matches(/MORNING|AFTERNOON|WHOLE_DAY/),
})

export { Schema, Initial }
