'use client';

import { makeApolloClient } from '@/services/gql';
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support';

const API_URL = process.env.GRAPHQL_SCHEMA_PATH ?? '';

const makeClient = () =>
  makeApolloClient({
    apolloUri: API_URL,
  });

export const ApolloWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
};
