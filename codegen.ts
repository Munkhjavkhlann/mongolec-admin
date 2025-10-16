import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  // Point to your GraphQL API endpoint
  // Make sure backend server is running on http://localhost:4000/graphql
  schema: 'http://localhost:4000/graphql',
  documents: [
    'src/**/*.{ts,tsx}',
    '!src/lib/graphql.old/**/*', // Exclude old GraphQL files
    '!src/__generated__/**/*',    // Exclude generated files
  ],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      plugins: [],
    },
    './src/__generated__/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
  ignoreNoDocuments: true, // Allow codegen without GraphQL operations
}

export default config
