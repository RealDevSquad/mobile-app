// jest.config.js
module.exports = {
  // Use the Jest preset provided by Expo for React Native projects
  preset: 'jest-expo',

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'], // Recognized file extensions for modules
  rootDir: '.', // Root directory for resolving all relative paths
  testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx,js,jsx}'], // Pattern Jest uses to detect test files

  moduleNameMapper: {
    // Support for path aliasing (e.g., @/components/Button)
    '^@/(.*)$': '<rootDir>/$1',

    // Mock static asset imports (images, fonts, media, etc.)
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__tests__/mocks/fileMock.js',
  },

  // Ensure certain node_modules are not ignored during transformation
  // These are packages that ship untranspiled code that Jest needs to process
  // Added 'expo-constants', 'expo-image', and 'expo-asset' for compatibility
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native' +
      '|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*' +
      '|@expo-google-fonts/.*|react-navigation|@react-navigation/.*' +
      '|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg' +
      '|expo-modules-core|expo-image|expo-asset|expo-constants|expo-font|@expo/vector-icons' +
      '|toastify-react-native|react-native-date-picker|expo-camera|expo-device)/)',
  ],
  collectCoverage: true,
  coverageReporters: ['text'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
