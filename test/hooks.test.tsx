jest.mock("webql-client", () => ({
  Graphs: jest.fn(),
}));
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { QueryClientProvider } from "react-query";
import { Graphs } from "webql-client";
import { act } from "react-dom/test-utils";
import {
  MutationTestComponent,
  QueryTestComponent,
  webqlClient,
} from "./TestComponent";

const profileSuccess = {
  load: () => {
    return new Promise((resolve, reject) => {
      resolve({
        ["#me"]: {
          id: "https://bejow.owntech.de/profile/card#me",
          "foaf#name": "Lala Test",
        },
      });
    });
  },
  patch: () => {
    return new Promise((resolve, reject) => {
      resolve({
        ["#me"]: {
          id: "https://bejow.owntech.de/profile/card#me",
          "foaf#name": "Lala Sepp",
        },
      });
    });
  },
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe("Hooks", () => {
  let container = null;

  beforeEach(() => {
    // set up a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("should be able to render query hook", async () => {
    Graphs.mockImplementation(() => profileSuccess);
    act(() => {
      render(
        <QueryClientProvider client={webqlClient.queryClient}>
          <QueryTestComponent />
        </QueryClientProvider>,
        container
      );
    });
    expect(container.textContent).toBe("Loading...");
    await act(async () => await sleep(500));
    expect(container.textContent).toBe("Lala Test");
  });

  it("should be able to render mutation hook", async () => {
    Graphs.mockImplementation(() => profileSuccess);
    act(() => {
      render(
        <QueryClientProvider client={webqlClient.queryClient}>
          <MutationTestComponent />
        </QueryClientProvider>,
        container
      );
    });
    expect(document.querySelector('[data-test-id="name"]').innerHTML).toBe(
      "Loading..."
    );
    await act(async () => {
      document.querySelector("button").click();
      await sleep(500);
    });
    expect(document.querySelector('[data-test-id="name"]').innerHTML).toBe(
      "Lala Sepp"
    );
  });
});
