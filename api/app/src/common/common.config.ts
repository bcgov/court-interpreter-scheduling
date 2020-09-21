export const CONFIG = {
  applicationPort: process.env.APPLICATION_PORT || 4000,
  version: {
    major: 0,
    minor: 0,
    patch: 1,
  },
  general: {
    title: 'Vape Regulation Backend',
    description: 'NodeJS/NextJS API for Vaping regulation in BC',
  },
  pagination: {
    size: 24,
  },
};
