module.exports = {
  // work with TS
  // tells Jest to use ts-jest preset
  preset: 'ts-jest',
  // configures Jest to use ts-jest for .ts (or .js) files.
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.*\\.spec\\.ts$',
  // Verbose Reporting => to false in other case problems to add logs in HTML Report
  verbose: false,
 // Coverage Reporting
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  // Custom Reporters
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: 'reports/test-report.html',
      expand: true,
      // Include console log in the report
      includeFailureMsg: true,
      includeConsoleLog: true, 
    }],
  ],
};