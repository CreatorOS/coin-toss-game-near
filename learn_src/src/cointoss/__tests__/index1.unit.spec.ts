import { createGame } from "../assembly/index";

import { storage, VMContext, u128 } from "near-sdk-as";

describe("Create a Game", () => {
  it("creates a new game", () => {
    VMContext.setAttached_deposit(u128.from("10000000000000000000000"));
    const gameId = createGame();
    expect(gameId).toBeTruthy("Game Id returned was non-null");
  });
});
