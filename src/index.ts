import {
  QueryClient,
  QueryObserverOptions,
  QueryObserverResult,
  UseMutateFunction,
  UseMutationOptions,
  UseMutationResult,
  useQuery as useReactQuery,
  useMutation as useReactMutation,
} from "react-query";
export { QueryClientProvider as ClientProvider } from "react-query";
import { DocumentNode, execute, GraphQLSchema, parse } from "graphql";

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
  useQuery: <GraphQLVariables, GraphQLQueryResult>(
    this: WebQLClient,
    document: DocumentNode | string,
    options?: QueryHookOptions<GraphQLQueryResult, GraphQLVariables>
  ) => QueryResult<GraphQLQueryResult>;
  useMutation: <GraphQLVariables, GraphQLQueryResult>(
    this: WebQLClient,
    document: DocumentNode | string,
    options?: MutationHookOptions<GraphQLQueryResult, GraphQLVariables>
  ) => MutationTuple<GraphQLQueryResult, GraphQLVariables>;

  constructor(schema: GraphQLSchema) {
    this.schema = schema;
    this.useQuery = useQuery;
    this.useMutation = useMutation;
    this.queryClient = new QueryClient();
  }
}

export function useQuery<GraphQLVariables, GraphQLQueryResult>(
  this: WebQLClient,
  document: DocumentNode | string,
  options?: QueryObserverOptions<GraphQLQueryResult> &
    Variables<GraphQLVariables>
) {
  const variables = options?.variables;
  delete options?.variables;
  const queryResult = useReactQuery<GraphQLQueryResult, any>({
    queryFn: () =>
      execute({
        schema: this.schema,
        document: typeof document === "string" ? parse(document) : document,
        variableValues: variables,
      }) as Promise<GraphQLQueryResult>,
    config: { ...(options as QueryObserverOptions), enabled: false },
  } as QueryObserverOptions<GraphQLQueryResult>) as QueryObserverResult<{
    data: GraphQLQueryResult;
  }>;
  return {
    ...queryResult,
    data: queryResult.data?.data,
  } as QueryResult<GraphQLQueryResult>;
}

export function useMutation<GraphQLVariables, GraphQLQueryResult>(
  this: WebQLClient,
  document: DocumentNode | string,
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
      execute({
        schema: this.schema,
        document: typeof document === "string" ? parse(document) : document,
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
