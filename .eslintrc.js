module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true,
    'jest': true
  },
  'extends': 'eslint:recommended',
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'no-console': 0,
  }
}
