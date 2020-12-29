import React from "react";

import WebQLClient from "../lib";
import { schema } from "./api/schema";
import { NexusGenInputs } from "./api/index";

export const webqlClient = new WebQLClient(schema);

const webId = "https://lalatest.solidcommunity.net/profile/card#me";

const querySource = `
query getPerson($webId: String!) {
  person(webId: $webId) {
    id
    foaf#name
  }
}
`;

const mutationSource = `
mutation updateProfile($webId: String!, $data: UpdatePersonInput!){
  updatePerson(webId: $webId, data: $data){
    id
    foaf#name
  }
}
`;

export const QueryTestComponent: React.FC = () => {
  const { data, isLoading } = webqlClient.useQuery<
    { webId: string },
    { person: { id: string; name: string } }
  >(querySource, {
    variables: { webId },
  });
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    data && <div>{data.person.name}</div>
  );
};

export const MutationTestComponent: React.FC = () => {
  const [testMutation, { data: testMutationResult }] = webqlClient.useMutation<
    { webId: string; data: NexusGenInputs["UpdatePersonInput"] },
    { data: { updatePerson: { id: string; name: string } }; errors: any }
  >(mutationSource);
  return (
    <>
      <button
        onClick={() =>
          testMutation({
            variables: { webId, data: { name: "Lala Sepp" } },
          })
        }
      >
        Change name
      </button>
      {testMutationResult?.data ? (
        <div data-test-id="name">
          {testMutationResult.data.updatePerson.name}
        </div>
      ) : (
        <div data-test-id="name">Loading...</div>
      )}
    </>
  );
};
