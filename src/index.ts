import {
  useQuery as useReactQuery,
  useMutation as useReactMutation,
} from "react-query";
import { GraphQLSchema } from "webql-js";

export class WebQLClient {
  schema: GraphQLSchema;

  constructor(schema: GraphQLSchema) {
    this.schema = schema;
  }
}

export const useQuery = ({ schema, doc }) => "HELLO WORLD";

export const useMutation = () => "HELLO WORLD";
