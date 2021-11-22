# Build a Coin-Toss game using NEAR
In this quest, you will learn to build a simple coin-toss game using the NEAR Protocol. 

By the end of this quest you will have a fair understanding of how smart contracts are written on top of Near protocol and you will be able to read other people’s contracts and understand the code very well.

NEAR protocol supports two languages for writing smart contracts: Rust and Assembly Script (A TypeScript-like language). We will be starting with Assembly Script since AssemblyScript is easier to understand and get started with.

How does the game work?
- Anyone interested in playing coin-toss can create a game using this contract, for another player to join and play.
- Any player interested in playing, can join an existing game that is created and has only 1 player in it.
- Both players put in equal amount of money to play the game and the winner gets it all.
- The toss and choice are made by generating random numbers in Assembly Script.

## Create your first Enum

In this quest, we will import all the required libraries and functionalities from the Assembly Script sdk provided by near. 


```
import { context, u128, PersistentVector, PersistentMap, logging, ContractPromiseBatch, RNG} from "near-sdk-as";
```

Next, we will create an enum called "GameState" which would be used to change the state of the game as we progress through the game.

To write an enumerator, you can use the keyword **enum** followed by the name of the enum and then write the states(Created, InProgress, Completed, NotFound) within curly braces. This the first piece of code you would be writing. You can go ahead and write the code to create an enumerator, below the import statement.

```
// You can write your code here
```

<!-- Solution:
 enum GameState {
    Created,
    InProgress,
    Completed,
    NotFound
} -->

## Create your first Class

Let us progress further and write our first and only class that we would be using in the contract. Classes in Assembly Script are used to provide an object oriented functionality, which you might have heard/read about in the traditional web2 world. They encapsulate all the variables related to the game and also have a constructor to initialise the default values if required.

We need to use the @nearBindgen tag in order to that serializes the class so it's compatible with the Near blockchain. We can export the class, so it can be used outside this file.

We will create a class named "Game" for this contract. You can copy the class code written below and write it on your editor. For every class, there needs to be a constructor, which would initialize the variables. You would have to fill up the contsructor body by initializing the variables.

HINTS:
1. Use the "this" keyword to assign values to the variables within the constructor.
2. For id: A unique game id is generated for each game using the u32 Random Number Generator library called RNG. We will initialize the default values of the variables in the constructor.
3. For the deposit1 and player1, you would have to populate the deposits and the address from the "context" library.
4. The deposit2(deposit by player2) can be set as "this.deposit2 = u128.Zero;"

```
/** 
 * Exporting a new class Game so it can be used outside of this file.
 */
@nearBindgen
export class Game {
    id: u32;
    gameState: GameState;
    deposit1: u128;
    deposit2: u128;
    player1: string;
    player2: string;
    player1Guess: boolean;
    player2Guess: boolean;
    winner: string;

    
   constructor() {
      //Initialize the variables here.
        
    } 

}
```

<!-- Solution
/*
        Generates a random number for the gameId.
        Need to change this to counter eventually.
        */
        const rng = new RNG<u32>(1, u32.MAX_VALUE);
        const roll = rng.next();
        this.id = roll;
        this.deposit1 = context.attachedDeposit;
        this.deposit2 = u128.Zero;
        this.player1 = context.sender;
        this.gameState = GameState.Created; -->
 
## Create a Game

In order to create a game and store the game details on the blockchain, we would need a data structure that can store data persistenly on the NEAR Blockchain. This is where a PersistentMap data structure comes into the picture.

Implements a map / persistent unordered map built on top of the ***Storage*** class in NEAR.
It uses the following syntax: let map = new PersistentMap<T, T>("m") where "m" is a "unique storage prefix" and T is the generic type parameter(a valid type supported by AssemblyScript).

Here is more information about the Persistent Map:
https://github.com/near/near-sdk-as/blob/master/sdk-core/assembly/collections/persistentMap.ts

***Why do we need the unique storage prefix?***
Since all data stored on the blockchain is kept in a single key-value store under the contract account, you must always use a *unique storage prefix* for different collections to avoid data collision. You can keep it a single letter if possible, in order to access it easily.

You can now create a constant called ***games*** , which would be a persistent map of the ***id*** and ***Game*** type and a function to create a game and set the newly created gameId to the game into the games map. 
Return the game ID generated in this game. 
Create a function called "createGame()".

 ```
//You can write the code here
```
 
<!--
export const games = new PersistentMap<u32, Game>("g");
export function createGame(): u32 {
  logging.log("Attached Deposit with this account " + context.attachedDeposit.toString());
  logging.log("In contract");
  const game = new Game();
  games.set(game.id, game);
  return game.id;
} -->


You can now run the test case, to check if your code is right.

## Join a Game

The next step is to create a function where a player can join the game. The first requirement would be to send a game ID, which would refer to the game that a player wants to join. Using the game Id, we can retrieve the game object. We will check for the validity of the game object and then, go ahead and add the second player's details to the game object.

You need to ensure that a few basic checks are implemented when a player wants to join the game:

1. Check if the player has attached the amount of NEAR required to play this game.
2. Check the state of the game
3. Check if player1 is not equal to the current player.

You can use logging.log to print the values from the contract on the terminal.
Here is an example syntax for ***logging.log***:
***logging.log("Attached Deposit with this account " + context.attachedDeposit.toString()); ***

Ensure to fill up the checks in the empty space.
    
```
export function joinGame(gameId: u32): boolean {
  //Loop through game Ids to check the game
  const game = games.getSome(gameId);
  if (game != null) {
    if (
      //FILL UP THE CHECKS HERE
    ) {
      game.deposit2 = context.attachedDeposit;
      game.gameState = GameState.InProgress;
      game.player2 = context.sender;
      games.set(game.id, game);
      return true;
    } else {
      return false;
    }
  }
  return false;
}
```
                                  
You can now run the test case to check the correctness of your code.

## Make The Guess

In a coin toss game, generally one of the players makes a guess before the toss happens. In our contract, we have written a function that would choose a guesser based on some mathematical operations. 

***How will we do it?***
We will generate a random number using the RNG command and use a modular function to determine if the random number is odd/even, a multiple of 3/5/7 or any condition that has only two outcomes - true/false.
Based on the outcome of this condition, we will choose either player1 to guess or player2 to guess.

Before we do the calculation, we need to retrieve the game matching the given game ID and verify the game state.

Fill in the missing code snippet and click on next.

```
export function chooseGuesser(gameId: u32): string {
  const randomNumber = new RNG<u32>(1, u32.MAX_VALUE);
  const randomNum = randomNumber.next();
  const game = games.getSome(gameId);
  if (game != null) {
    //FILL IN THIS SEGMENT WITH CODE TO CHOOSE A GUESSER
  }
  return "Game Not Found";
}
```
 
<!-- Solution:

if (game.gameState == GameState.InProgress) {
      if (randomNum % 3 == 0) {
        return game.player1;
      } else return game.player2;
    } -->
                                  
The next step is to make a guess. The guess would be made by the player who was selected as a guesser. In this code snippet, we are not checking for the same but if you want, you can store the selected guesser for each game as well. 

We store the chosen player's guess and update the Game structure.
Fill in the missing code snippet that assigns the "guess".

```
export function makeAGuess(gameId: u32, guess: boolean): string {
  const game = games.getSome(gameId);
  if (game != null) {
    if (game.gameState == GameState.InProgress) {
      if (context.sender == game.player1) {
        //MISSING CODE SNIPPET - FILL THIS
      } else {
        //MISSING CODE SNIPPET - FILL THIS
      }
      games.set(game.id, game);
      return "Done";
    }
  }
  return "Game Not Found";
}
```

Here are some static functions, which are get calls that can be used to check the values of the variables in your contract. You can copy them as it is.

```
//Get the first player details
export function getPlayer1Details(gameId: i32): string {
    for(let i =0; i< games.length; i++){
        if(games[i].id == gameId){
            return games[i].player1;
        }
    }
    return "None";
}


//Get the second player details
export function getPlayer2Details(gameId: i32): string {
    for(let i =0; i< games.length; i++){
        if(games[i].id == gameId){
            return games[i].player2;
        }
    }
    return "None";
}

//Get the deposit details
export function getDeposit(gameId: i32): u128 {
    for(let i =0; i< games.length; i++){
        if(games[i].id == gameId){
            return games[i].deposit1;
        }
    }
    return u128.Zero;
}

//Get the Game State
export function getGameState(gameId: i32): GameState {
    for(let i =0; i< games.length; i++){
        if(games[i].id == gameId){
            return games[i].gameState;
        }
    }
    return GameState.NotFound;
}

```
<!-- Solution:
 
  if (context.sender == game.player1) {
        game.player1Guess = guess;
      } else {
        game.player2Guess = guess;
      } -->
Run the test cases to check the correctness of your code.

## Finish The Game

The last step is to do the toss and declare the winner. In this step, we will simulate a toss by generating a Random Number again!(By now, you should be a pro in this :P). You can use any condition of your choice that returns true/false to check against the random number and declare the winner.

It is very important before declaring the winner and transferring the amount that all the game related checks are in place.

As a last step, the winner will get all the amount that was bet by both the players in the game. For this, we would use a cross-contract call.
You might have observed that we imported a class called "ContractPromiseBatch" from the near assembly script sdk. This class contains code to perform batch actions from within an Assembly Script contract. 

*** How does it work?***
1. We will use the .create method to get the account ID of the beneficiary.
2. We will then use the .transfer method to transfer the amount to the beneficiary.
Reference Link: https://near.github.io/near-sdk-as/classes/_sdk_core_assembly_promise_.contractpromisebatch.html

The code may look a little lengtheir, but it is really just a collection of possibilities. Fill up the missing code snippets to complete the function.

 ```
export function finishGame(gameId: u32): string {
  const randomNumber = new RNG<u32>(1, u32.MAX_VALUE);
  const randomNum = randomNumber.next();
  const game = games.getSome(gameId);
  if (game != null && game.id == GameState.InProgress) {
    if (randomNum % 3 == 0) {
      if (game.player2Guess == true) {
        game.gameState = GameState.Completed;
        game.winner = game.player2;
        games.set(game.id, game);
        //Send 2*deposit to the winning player
        const to_beneficiary = ContractPromiseBatch.create(game.winner);
        to_beneficiary.transfer(u128.add(game.deposit1, game.deposit2));
        return game.winner;
      } else {
        game.gameState = GameState.Completed;
        game.winner = game.player1;
        games.set(game.id, game);
        //Send 2*deposit to the winning player
        //MISSING CODE SNIPPET
        to_beneficiary.transfer(u128.add(game.deposit1, game.deposit2));
        return game.winner;
      }
    } else {
      if (game.player2Guess == false) {
        game.gameState = GameState.Completed;
        game.winner = game.player2;
        games.set(game.id, game);
        //Send 2*deposit to the winning player
        const to_beneficiary = ContractPromiseBatch.create(game.winner);
        to_beneficiary.transfer(u128.add(game.deposit1, game.deposit2));
        return game.winner;
      } else {
        game.gameState = GameState.Completed;
        game.winner = game.player1;
        games.set(game.id, game);
        //Send 2*deposit to the winning player
        const to_beneficiary = ContractPromiseBatch.create(game.winner);
        //MISSING CODE SNIPPET
        return game.winner;
      }
    }
  }
  return "None";
}

//Get the winner of the game
export function getWinner(gameId: i32): string {
    for(let i =0; i< games.length; i++){
        if(games[i].id == gameId){
            if(games[i].gameState == GameState.Completed){
                return games[i].winner;
            }
        }
    }    
    return "None";
}
```
                                  
Run the test cases to see if you got it right!
