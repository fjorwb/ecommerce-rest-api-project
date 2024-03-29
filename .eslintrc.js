module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'space-before-function-paren': 0,
    camelcase: 0,
    'comma-dangle': 0,
  },
}
