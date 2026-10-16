// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = defineConfig([
  {
    ignores: [
      'dist/**',
      'script/**',
      'scripts/**',
      '.vscode/**',
      'metro.config.js',
      'babel.config.js',
      'tailwind.config.js',
    ],
  },
  expoConfig,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    // React-Atomic: components/ presentasional — fetch & navigasi milik container/hook.
    files: ['components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='useApi']",
          message: 'Atomic: panggil useApi di container/hook, oper data via props.',
        },
        {
          selector: 'CallExpression[callee.object.name=/^(Api|queryClient)$/]',
          message: 'Atomic: akses data langsung hanya di container/hook.',
        },
        {
          selector: 'CallExpression[callee.name=/^(useQuery|useInfiniteQuery|useMutation|fetch)$/]',
          message: 'Atomic: fetching hanya di container/hook.',
        },
        {
          selector:
            'CallExpression[callee.property.name=/^(push|replace|back)$/][callee.object.name="router"]',
          message: 'Atomic: navigasi milik container, oper handler via props.',
        },
      ],
    },
  },
]);
