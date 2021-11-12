import {
  createGame,
  joinGame,
  chooseGuesser,
  makeAGuess,
  getPlayer2Details,
  getGameState,
} from "../assembly/index";

import { storage, VMContext, u128 } from "near-sdk-as";

describe("A Player 2 joining an existing game", () => {
  it("another player joins the game", () => {
    VMContext.setAttached_deposit(u128.from("5000000000000000000000"));
    VMContext.setSigner_account_id(process.env.get("user1"));
    const gameId = createGame();

    VMContext.setAttached_deposit(u128.from("5000000000000000000000"));
    VMContext.setSigner_account_id(process.env.get("user2"));
    const gameJoined = joinGame(gameId);
    expect(gameJoined).toBeTruthy;
  });

  it("now the game state changes to 1", () => {
    VMContext.setAttached_deposit(u128.from("5000000000000000000000"));
    VMContext.setSigner_account_id(process.env.get("user1"));
    const gameId = createGame();

    VMContext.setAttached_deposit(u128.from("5000000000000000000000"));
    VMContext.setSigner_account_id(process.env.get("user2"));
    joinGame(gameId);
    const gameState = getGameState(gameId);
    const player2 = getPlayer2Details(gameId);
    expect(gameState).toStrictEqual(1);
    expect(player2).toStrictEqual(process.env.get("user2"));
  });

  it("making the choice and finishing the game", () => {
    VMContext.setAttached_deposit(u128.from("5000000000000000000000"));
    VMContext.setSigner_account_id(process.env.get("user1"));
    const gameId = createGame();

    VMContext.setAttached_deposit(u128.from("5000000000000000000000"));
    VMContext.setSigner_account_id(process.env.get("user2"));
    joinGame(gameId);

    const guesser = chooseGuesser(gameId);
    VMContext.setSigner_account_id(guesser);
    const guessValue = makeAGuess(gameId, false);

    expect(guessValue).toStrictEqual("Done");
  });
});
