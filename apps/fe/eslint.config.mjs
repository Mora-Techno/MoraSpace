import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    // React-Atomic: components/ presentasional — fetch & navigasi milik container/hook.
    files: ['src/components/**/*.{ts,tsx}'],
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
          selector: "CallExpression[callee.name='useRouter']",
          message: 'Atomic: navigasi milik container, oper handler via props.',
        },
        {
          selector:
            'CallExpression[callee.property.name=/^(push|replace|back)$/][callee.object.name="router"]',
          message: 'Atomic: navigasi milik container, oper handler via props.',
        },
      ],
    },
  },
];

export default eslintConfig;
