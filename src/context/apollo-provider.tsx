'use client'

import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'
import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react'

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
  })

  return new ApolloClient({
    link: from([httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  })
}

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => createApolloClient(), [])

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>
}