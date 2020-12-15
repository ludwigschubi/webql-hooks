import {
  QueryClient,
  QueryObserverOptions,
  QueryObserverResult,
  UseMutateFunction,
  UseMutationOptions,
  UseMutationResult,
} from "react-query";
import {
  useQuery as useReactQuery,
  useMutation as useReactMutation,
} from "react-query";
import { graphql, GraphQLSchema, Source } from "webql-js";

export interface Variables<TVariables> {
  variables?: TVariables;
}

export class WebQLClient {
  schema: GraphQLSchema;
  queryClient: QueryClient;
  useQuery: <GraphQLDocument, GraphQLVariables, GraphQLQueryResult>(
    this: WebQLClient,
    document: GraphQLDocument,
    options?: QueryObserverOptions<GraphQLQueryResult, any> &
      Variables<GraphQLVariables>
  ) => QueryObserverResult<GraphQLQueryResult, any>;
  useMutation: <GraphQLDocument, GraphQLVariables, GraphQLQueryResult>(
    this: WebQLClient,
    document: GraphQLDocument,
    options?: UseMutationOptions<
      GraphQLQueryResult,
      any,
      Variables<GraphQLVariables>,
      any
    >
  ) => [
    UseMutateFunction<
      GraphQLQueryResult,
      any,
      Variables<GraphQLVariables>,
      any
    >,
    UseMutationResult<
      GraphQLQueryResult,
      any,
      any,
      UseMutationOptions<
        GraphQLQueryResult,
        any,
        Variables<GraphQLVariables>,
        any
      >
    >
  ];

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
  options?: QueryObserverOptions<GraphQLQueryResult> &
    Variables<GraphQLVariables>
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
    config: { ...(options as QueryObserverOptions), enabled: false },
  } as QueryObserverOptions<GraphQLQueryResult>);
  return queryResult;
}

export function useMutation<
  GraphQLDocument,
  GraphQLVariables,
  GraphQLQueryResult
>(
  this: WebQLClient,
  document: GraphQLDocument,
  options?: UseMutationOptions<
    GraphQLQueryResult,
    any,
    Variables<GraphQLVariables>,
    any
  >
) {
  const mutationResult = useReactMutation<
    GraphQLQueryResult,
    any,
    any,
    UseMutationOptions<
      GraphQLQueryResult,
      any,
      Variables<GraphQLVariables>,
      any
    >
  >(
    ({ variables }) =>
      graphql({
        schema: this.schema,
        source: (document as unknown) as Source | string,
        variableValues: variables,
      }) as Promise<GraphQLQueryResult>,
    options
  );
  return [mutationResult.mutate, mutationResult] as [
    UseMutateFunction<
      GraphQLQueryResult,
      any,
      Variables<GraphQLVariables>,
      any
    >,
    UseMutationResult<
      GraphQLQueryResult,
      any,
      any,
      UseMutationOptions<
        GraphQLQueryResult,
        any,
        Variables<GraphQLVariables>,
        any
      >
    >
  ];
}

export default WebQLClient;
