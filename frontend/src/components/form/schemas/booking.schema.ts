import * as yup from 'yup';

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
