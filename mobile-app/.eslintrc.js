// module.exports = {
//   root: true,
//   extends: '@react-native',
// };


module.exports = {
  root: true,
  extends: [
    '@react-native',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
  },
};
