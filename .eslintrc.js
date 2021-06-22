module.exports = {
  extends: ['@nuxtjs/eslint-config-typescript', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    curly: 'off',
    'no-empty': 'off',
    'no-undef': 'off',
  },
}
