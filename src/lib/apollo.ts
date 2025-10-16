import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";

// Modern HTTP link for Apollo Client v4
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include", // Include cookies in requests
});

// Modern error handling for Apollo Client v4
const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    // Handle GraphQL errors
    error.errors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Operation: ${operation.operationName}`
      );
    });
  } else if (error) {
    // Handle network/other errors
    console.error(`[Network error]: ${error.message}`, {
      operation: operation.operationName,
    });
  }

  // Note: Auth error handling is managed by AuthProvider context
});

// Chain links using ApolloLink.from (modern v4 approach)
const link = ApolloLink.from([errorLink, httpLink]);

// Create Apollo Client with secure cookie-based auth (v4)
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all", // Return partial data and errors
    },
    query: {
      errorPolicy: "all",
    },
  },
});
