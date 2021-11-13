import { createGame, joinGame, getDeposit } from "../assembly/index";

import { storage, VMContext, u128 } from "near-sdk-as";

describe("Sad paths - failures", () => {
  it("same player joins the game", () => {
    VMContext.setAttached_deposit(u128.from("5000000000000000000000"));
    VMContext.setSigner_account_id(process.env.get("user1"));
    const gameId = createGame();

    VMContext.setAttached_deposit(u128.from("5000000000000000000000"));
    VMContext.setSigner_account_id(process.env.get("user1"));
    const gameJoined = joinGame(gameId);
    expect(gameJoined).toBeFalsy;
  });

  it("game deposit is returned 0", () => {
    //VMContext.setAttached_deposit(u128.from('5000000000000000000000'));
    VMContext.setSigner_account_id(process.env.get("user1"));
    const gameId = createGame();
    const getDeposit1 = getDeposit(gameId);
    expect(getDeposit1).toBeFalsy;
  });

  // it('making the choice and finishing the game', () => {
  //   VMContext.setAttached_deposit(u128.from('5000000000000000000000'));
  //   VMContext.setSigner_account_id(process.env.get('user1'));
  //   const gameId = createGame();

  //   VMContext.setAttached_deposit(u128.from('5000000000000000000000'));
  //   VMContext.setSigner_account_id(process.env.get('OWNER'));
  //   joinGame(gameId);

  //   const guesser = chooseGuesser(gameId);
  //   VMContext.setSigner_account_id(guesser);
  //   const guessValue = makeAGuess(gameId, false);
  //   const gameFinish = finishGame(gameId);
  //   //expect(guessValue).toStrictEqual("Done");

  // });
});
