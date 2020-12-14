jest.mock("webql-client", () => ({
  Graphs: jest.fn(),
}));
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { QueryClientProvider } from "react-query";
import { Graphs } from "webql-client";
import { act } from "react-dom/test-utils";
import { TestComponent, webqlClient } from "./TestComponent";

const getProfileSuccess = {
  load: () => {
    return new Promise((resolve, reject) => {
      resolve({
        ["#me"]: {
          id: "https://bejow.owntech.de/profile/card#me",
          "foaf#name": "Ben Wetzel",
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
    Graphs.mockImplementation(() => getProfileSuccess);
    act(() => {
      render(
        <QueryClientProvider client={webqlClient.queryClient}>
          <TestComponent />
        </QueryClientProvider>,
        container
      );
    });
    expect(container.textContent).toBe("Loading...");
    await act(() => sleep(500));
    expect(container.textContent).toBe("Done fetching");
  });
});
