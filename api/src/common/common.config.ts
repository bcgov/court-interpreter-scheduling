export const CONFIG = {
  applicationPort: process.env.APPLICATION_PORT || 4000,
  version: {
    major: 0,
    minor: 0,
    patch: 1,
  },
  general: {
    title: 'Court Scheduling Api',
    description: 'NodeJS/NextJS API for Court Schduling in BC',
  },
  pagination: {
    size: 24,
  },
};
