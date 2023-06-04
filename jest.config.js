module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  transform: {
    '.*\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      }
    ]
  }
}