module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        module: 'commonjs',
        resolveJsonModule: true,
        experimentalDecorators: true,
        baseUrl: '.',
        paths: { '@/*': ['src/*'] }
      },
      diagnostics: false
    }]
  }
};
