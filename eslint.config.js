import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Disable react-refresh component exports restriction to allow hooks and providers in same file
      'react-refresh/only-export-components': 'off',
      // Treat unused variables as warnings to prevent build blockages during development
      'no-unused-vars': 'warn',
      // Disable strict set-state-in-effect analysis to allow standard telemetry fetching on mount
      'react-hooks/set-state-in-effect': 'off'
    }
  },
])
