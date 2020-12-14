import React from "react";
import {
  QueryClient,
  QueryClientProviderProps,
  QueryObserverResult,
  UseMutationOptions,
} from "react-query";
import {
  useQuery as useReactQuery,
  useMutation as useReactMutation,
  QueryOptions,
} from "react-query";
import { graphql, GraphQLSchema, Source } from "webql-js";
export class WebQLClient {
  schema: GraphQLSchema;
  queryClient: QueryClient;
  useQuery: <GraphQLDocument, GraphQLVariables, GraphQLQueryResult>(
    this: WebQLClient,
    document: GraphQLDocument,
    options?: QueryOptions & { variables: GraphQLVariables }
  ) => QueryObserverResult<GraphQLQueryResult, any>;
  useMutation: <GraphQLDocument, GraphQLVariables, GraphQLQueryResult>(
    this: WebQLClient,
    document: GraphQLDocument,
    options?: UseMutationOptions<GraphQLQueryResult, any, GraphQLVariables, any>
  ) => void;

  constructor(schema: GraphQLSchema) {
    this.schema = schema;
    this.useQuery = useQuery;
    this.useMutation = useMutation;
    this.queryClient = new QueryClient();
  }
}

export function useQuery<GraphQLDocument, GraphQLVariables, GraphQLQueryResult>(
  this: WebQLClient,
  document: GraphQLDocument,
  options?: QueryOptions & { variables?: GraphQLVariables }
) {
  const variables = options?.variables;
  delete options?.variables;
  const queryResult = useReactQuery<GraphQLQueryResult, any>({
    queryFn: () =>
      graphql({
        schema: this.schema,
        source: (document as unknown) as Source | string,
        variableValues: variables,
      }) as Promise<GraphQLQueryResult>,
    config: { ...(options as QueryOptions), enabled: false },
  } as QueryOptions<GraphQLQueryResult>);
  return queryResult;
}

export function useMutation<
  GraphQLDocument,
  GraphQLVariables,
  GraphQLQueryResult
>(this: WebQLClient, document: GraphQLDocument, options?: QueryOptions) {
  return useReactMutation<
    GraphQLQueryResult,
    any,
    any,
    UseMutationOptions<GraphQLQueryResult, any, GraphQLVariables, any>
  >(
    ({ variables }) =>
      graphql({
        schema: this.schema,
        source: (document as unknown) as Source | string,
        variableValues: variables,
      }) as Promise<GraphQLQueryResult>,
    options
  );
}

export default WebQLClient;
