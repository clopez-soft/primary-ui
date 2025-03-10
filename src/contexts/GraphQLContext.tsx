/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import { toSafeString } from "src/utils/helper";
import { LS_TOKEN_KEY } from "src/utils/constants";

interface GraphQLContextProps {
  children: ReactNode;
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:5050/graphql/",
    fetchOptions: {
      mode: "cors",
    },
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:8080/",
      Authorization: `Bearer ${toSafeString(
        window.localStorage.getItem(LS_TOKEN_KEY)
      )}`,
    },
  }),
});

export const GraphQLProvider = ({ children }: GraphQLContextProps) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

const GraphQLContext = createContext<ApolloClient<any> | null>(null);

export const useGraphQLClient = () => {
  const context = useContext(GraphQLContext);
  if (!context) {
    throw new Error("useGraphQLClient must be used within a GraphQLProvider");
  }
  return context;
};
