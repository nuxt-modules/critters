module.exports = {
  extends: ['@nuxtjs/eslint-config-typescript', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    curly: 'off',
    'no-empty': 'off',
    'no-undef': 'off',
    'vue/multi-word-component-names': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',
    'prettier/prettier': 'error',
    'vue/no-v-for-template-key': 'off',
    'vue/no-v-for-template-key-on-child': 'off',
    'vue/no-v-html': 'off',
  },
  ignorePatterns: ['buildModules', 'libs', '.nuxt/**', 'dist/**'],
}
