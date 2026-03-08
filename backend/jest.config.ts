import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.ts', '!src/__tests__/**', '!src/types/**'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: { branches: 70, functions: 70, lines: 80, statements: 80 },
  },
};

export default config;
