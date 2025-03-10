import { ReactNode } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloCache,
  NormalizedCacheObject,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

import { toSafeString } from "src/utils/helper";
import { appConfig } from "src/config";
import { LS_TOKEN_KEY } from "src/utils/constants";

const accessToken = toSafeString(window.localStorage.getItem(LS_TOKEN_KEY));

const createApolloClient = (
  authToken: string | null
): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    cache: new InMemoryCache() as ApolloCache<NormalizedCacheObject>,
    link: createUploadLink({
      uri: appConfig.GRAPHQL_URL,
      // fetchOptions: {
      //   mode: "no-cors",
      // },
      headers: {
        // "Access-Control-Allow-Origin": "http://localhost:8080/",
        ...(authToken && {
          authorization: `${
            authToken ? `Bearer ${toSafeString(authToken)}` : ""
          }`,
        }),
      },
    }),
  });

const ApolloContext = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={createApolloClient(accessToken)}>
    {children}
  </ApolloProvider>
);

export default ApolloContext;
