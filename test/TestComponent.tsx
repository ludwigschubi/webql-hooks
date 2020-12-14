import React from "react";
import { Source } from "webql-js";

import WebQLClient from "../lib";
import { schema } from "./api/schema";

export const webqlClient = new WebQLClient(schema);

export const TestComponent: React.FC = () => {
  const source = new Source(`
  query getPerson($webId: String!) {
    person(webId: $webId) {
      id
      foaf#name
    }
  }
  `);
  const { data, isLoading } = webqlClient.useQuery<
    typeof source,
    { webId: string },
    { data: { person: { id: string; "foaf#name": string } } }
  >(source, {
    variables: { webId: "https://lalatest.solidcommunity.net/profile/card#me" },
  });
  return isLoading ? <div>Loading...</div> : data && <div>Done fetching</div>;
};

export default TestComponent;
