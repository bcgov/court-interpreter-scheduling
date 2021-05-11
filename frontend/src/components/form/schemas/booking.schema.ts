import * as yup from 'yup';

import { RequestedByOptions, InterpretForOptions } from 'constants/booking';

const Initial = {
  room: '',
  registry: '',
  file: '',
  interpretFor: InterpretForOptions[0],
  caseName: '',
  requestedBy: RequestedByOptions[0],
  federal: undefined,
  language: '',
  reason: '',
  prosecutor: '',
  comment: '',
  locationName: '',
};

const Schema = yup.object({
  room: yup.string(),
  registry: yup.string(),
  file: yup.string(),
  interpretFor: yup.string(),
  caseName: yup.string(),
  requestedBy: yup.string(),
  federal: yup.boolean(),
  language: yup.string(),
  reason: yup.string().max(6, 'max limit 6 characters'),
  prosecutor: yup.string(),
  comment: yup.string(),
  locationName: yup.string(),
});

export { Initial, Schema };
