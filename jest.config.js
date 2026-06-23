module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs/toolkit|redux-mock-store|immer|@react-navigation|@react-native-async-storage)/)',
  ],
};