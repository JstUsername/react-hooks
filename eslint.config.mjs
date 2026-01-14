import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import { configs as tseslintConfigs } from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import("eslint").Linter.Config} */
export default defineConfig([
  js.configs.recommended,
  ...tseslintConfigs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    },
  },
  eslintConfigPrettier,
  globalIgnores(['./node_modules/*', './dist/*']),
]);
