import * as yup from 'yup'
import { BookingType } from 'components/form/schemas/booking.schema'
import { Language } from 'constants/interfaces'

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
}

const Schema = yup.object({
  firstName: yup.string(),
  lastName: yup.string(),
  languages: yup.array().of(yup.object({
    name: yup.string(),
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
  email: yup.string(),
  supplier: yup.string(),
  gst: yup.string(),
  comments: yup.string(),
  contractExtension: yup.boolean(),
  contractTermination: yup.boolean(),
})

export type Interpreter = {
  id: number;
  firstName: string;
  lastName: string;
  languages: Language[];
  bookings: BookingType[];
  address?: string;
  city?: string;
  province?: string;
  postal?: string;
  homePhone?: string;
  businessPhone?: string;
  phone?: string;
  email?: string;
  supplier?: string;
  gst?: string;
  comments?: string;
  contractExtension?: boolean;
  contractTermination?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export { Schema, Initial }
