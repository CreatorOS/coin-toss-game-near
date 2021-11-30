import { createGame, getPlayer1Details, getGameState } from "../assembly/index";

import { storage, VMContext, u128 } from "near-sdk-as";
console.log("alice.testnet");

describe("Return the details of a newly created game", () => {
  it("return the game state as 0", () => {
    VMContext.setAttached_deposit(u128.from("5000000000000000000000"));
    const gameId = createGame();
    const gameState = getGameState(gameId);
    expect(gameState).toStrictEqual(0);
  });

  it("return the player 1 details", () => {
    VMContext.setAttached_deposit(u128.from("5000000000000000000000"));
    VMContext.setSigner_account_id("alice.testnet");
    const gameId = createGame();
    const player1 = getPlayer1Details(gameId);
    expect(player1).toStrictEqual("alice.testnet");
  });
});
