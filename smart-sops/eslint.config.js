import react from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'

export default [
  react.configs.recommended,
  {
    files: ['**/*.jsx'],
    plugins: { react: reactPlugin },
    languageOptions: {
      parserOptions: { ecmaVersion: 2021, sourceType: 'module' }
    }
  }
]
