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

export type MutationResult<
  GraphQLQueryResult,
  GraphQLVariables
> = UseMutationResult<
  GraphQLQueryResult,
  any,
  any,
  UseMutationOptions<GraphQLQueryResult, any, Variables<GraphQLVariables>, any>
>;

export type MutationHookOptions<
  GraphQLQueryResult,
  GraphQLVariables
> = UseMutationOptions<
  GraphQLQueryResult,
  any,
  Variables<GraphQLVariables>,
  any
>;

export type MutationFunction<
  GraphQLQueryResult,
  GraphQLVariables
> = UseMutateFunction<
  GraphQLQueryResult,
  any,
  Variables<GraphQLVariables>,
  any
>;

export type MutationTuple<GraphQLQueryResult, GraphQLVariables> = [
  MutationFunction<GraphQLQueryResult, GraphQLVariables>,
  MutationResult<GraphQLQueryResult, GraphQLVariables>
];

export type QueryResult<
  GraphQLQueryResult
> = QueryObserverResult<GraphQLQueryResult>;

export type QueryHookOptions<
  GraphQLQueryResult,
  GraphQLVariables
> = QueryObserverOptions<GraphQLQueryResult, any> & Variables<GraphQLVariables>;

export class WebQLClient {
  schema: GraphQLSchema;
  queryClient: QueryClient;
  useQuery: <GraphQLDocument, GraphQLVariables, GraphQLQueryResult>(
    this: WebQLClient,
    document: GraphQLDocument,
    options?: QueryHookOptions<GraphQLQueryResult, GraphQLVariables>
  ) => QueryResult<GraphQLQueryResult>;
  useMutation: <GraphQLDocument, GraphQLVariables, GraphQLQueryResult>(
    this: WebQLClient,
    document: GraphQLDocument,
    options?: MutationHookOptions<GraphQLQueryResult, GraphQLVariables>
  ) => MutationTuple<GraphQLQueryResult, GraphQLVariables>;

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
  return [mutationResult.mutate, mutationResult] as MutationTuple<
    GraphQLQueryResult,
    GraphQLVariables
  >;
}

export default WebQLClient;
