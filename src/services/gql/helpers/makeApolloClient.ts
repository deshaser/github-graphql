import {
  ApolloClient,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support';
import { from } from '@apollo/client';
import { ContextSetter, setContext } from '@apollo/client/link/context';
import { onError as makeErrorLink } from '@apollo/client/link/error';
import { HttpLink } from '@apollo/client/link/http';
import fragmentMatcher from '../__generated__/fragment-matcher.json';
import { typePolicies } from './typePolicies';

/**
 * Returns header context for Apollo
 */
const makeGetHeadersContext =
  (): ContextSetter =>
  (gqlRequest, { headers = {} }) => {
    return {
      headers: {
        Authorization: `bearer ${process.env.NEXT_PUBLIC_GRAPHQL_SCHEMA_TOKEN}`,
        ...headers,
      },
    };
  };

interface MakeMainLinkProps {
  apolloUri: string;
}

const makeMainLink = ({ apolloUri }: MakeMainLinkProps) => {
  const authLink = setContext(makeGetHeadersContext());

  const httpLink = new HttpLink({ uri: apolloUri });

  return from([makeErrorLink(res => console.error(res)), authLink, httpLink]);
};

/**
 * Creates apollo client
 */
export const makeApolloClient = (props: MakeMainLinkProps) => {
  return new ApolloClient({
    connectToDevTools: true,
    link: makeMainLink(props),
    cache: new InMemoryCache({
      addTypename: false,
      resultCaching: true,
      typePolicies,
      possibleTypes: fragmentMatcher.possibleTypes,
    }),
  });
};
