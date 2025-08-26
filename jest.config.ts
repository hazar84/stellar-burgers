import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv:  ['<rootDir>/src/setupTests.ts'],

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  preset: 'ts-jest',
  transform: {
  '^.+\\.tsx?$': ['ts-jest', {}]
  },

  moduleNameMapper: {
  '^@api$': '<rootDir>/src/utils/burger-api.ts',
  '^@pages$': '<rootDir>/src/pages',
  '^@components$': '<rootDir>/src/components',
  '^@ui$': '<rootDir>/src/components/ui',
  '^@ui-pages$': '<rootDir>/src/components/ui/pages',
  '^@utils-types$': '<rootDir>/src/utils/types',
  '^@slices$': '<rootDir>/src/services/slices',
  '^@selectors$': '<rootDir>/src/services/selectors',
  '^@utils$': '<rootDir>/src/utils'
  }
};

export default config;
