# Build a Coin-Toss game using NEAR
In this quest, you will learn to build a simple coin-toss game using the NEAR Protocol. 

By the end of this quest you will have a fair understanding of how smart contracts are written on top of Near protocol and you will be able to read other people’s contracts and understand the code very well.

Near protocol supports two languages for writing smart contracts: Rust and AssemblyScript (A TypeScript-like language). We will be starting with AssemblyScript since AssemblyScript is easier to understand and get started with.

How does the game work?
- Anyone interested in playing coin-toss can create a game using this contract, for another player to join and play.
- Any player interested in playing, can join an existing game that is created and has only 1 player in it.
- Both players put in equal amount of money to play the game and the winner gets it all.
- The toss and choice are made by generating random numbers in Assembly Script.

## Create your first Enum

In this quest, we will import all the required libraries and functionalities from the assembly script sdk provided by near. 


```
import { context, u128, PersistentVector, PersistentMap, logging, ContractPromiseBatch, RNG} from "near-sdk-as";
```

Next, we create an enum called "GameState" which would be used to change the state of the game as we progress through the game.

To write an enumerator, you can use the keyword **enum** followed by the name of the enum and then write the states(Created, InProgress, Completed, NotFound) within curly braces. Write the code to create an enumerator.

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

Now, let us progress further and write our first and only class that we would be using in the contract. Classes in assembly script are used to provide an object oriented functionality, which you might have heard/read about in the traditional web2 world. They encapsulate all the variables related to the game and also have a constructor to initialise the default values if required.

We need to use the @nearBindgen tag in order to that serializes the class so it's compatible with the Near blockchain. We can export the class, so it can be used outside this file.

We will create a class named "Game" for this contract.

A unique game id is generated for each game using the u32 Random Number Generator library called RNG. We will initialiize the default values of the variables in the constructor.

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

In order to create a game and store the game details on the blockchain, we would need a data structure that can store data persistenly on the NEAR Blockchain. This is where a PersistentVector data structure comes into the picture.

Implements a vector / persistent array built on top of the ***Storage*** class in NEAR.
It uses the following map: index -> element and can be written as PersistentVector<T>("unique storage prefix"), where T is the generic type parameter(a valid type supported by AssemblyScript).

***Why do we need the unique storage prefix?***
Since all data stored on the blockchain is kept in a single key-value store under the contract account, you must always use a *unique storage prefix* for different collections to avoid data collision. You can keep it a single letter if possible, in order to access it easily.

You can now create a constant called ***games*** , which would be a persistent vector of ***Game*** type and a function to create a game and push the newly created game into the games vector. 
Return the game ID generated in this game.

 ```
//You can write the code here
```
 
<!--
export const games = new PersistentVector<Game>("g");

export function createGame(): u32 {
    const game = new Game();
    games.push(game);
    return game.id;
} -->


You can now run the test case, to check if your code is right.

## Join a Game

The next step is to create a function where a player can join the game. The first requirement would be to send a game ID, which would refer to the game that a player wants to join. You need to ensure that a few basic checks are implemented when a player wants to join the game:

1. Check if the player has attached the amount of NEAR required to play this game.
2. Check the state of the game
3. Check if player1 is not equal to the current player.

You can use logging.log to print the values from the contract on the terminal.

We will loop through the persisten vector to match the game ID with the id sent by the user. Ensure to fill up the checks in the empty space.
    
```
export function joinGame(gameId: u32): boolean {
    //Loop through game Ids to check the game
    for(let i =0; i< games.length; i++){
        if(games[i].id == gameId){
            const newGame = new Game();
            /*
            Check if the game corresponds to a created game
            and if the same amount of deposit is attached.
            Also check if the same player is calling the 
            game or not.
            */
            logging.log("Attached Deposit with this account " + context.attachedDeposit.toString());
            logging.log("Game Deposit: " + games[i].deposit1.toString());
            logging.log("Game State is: "+ games[i].gameState.toString());
            logging.log("Context Sender is: "+ context.sender);
            logging.log("Player1 is: "+ games[i].player1);
            logging.log("Account Balance for this account is: "+ context.accountBalance);

            if(//USER TO FILL UP CODE HERE){
                newGame.deposit1 = games[i].deposit1;
                newGame.deposit2 = context.attachedDeposit;
                newGame.gameState = GameState.InProgress;
                newGame.player1 = games[i].player1;
                newGame.player2 = context.sender;
                newGame.id = games[i].id;

                games.replace(i,newGame);
                
                return true;
            }
            else {
                return false;
            }
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

Before we do the calculation, we need to retrieve the game id matching our game and verify the game state.

Fill in the missing code snippet and click on next.

```
export function chooseGuesser(gameId: u32): string {
    const randomNumber = new RNG<u32>(1, u32.MAX_VALUE);
    const randomNum = randomNumber.next();
 
    for(let i =0; i< games.length; i++){

        //Write a code snippet here
    } 
   
    return "Game Not Found";
    
}
```
 
<!-- Solution:

if(games[i].id == gameId && games[i].gameState == GameState.InProgress){
            if(randomNum % 3== 0){
                return games[i].player1; 
            }
            else
                return games[i].player2;
            } -->
                                  
The next step is to make a guess. The guess would be made by the player who was selected as a guesser. In this code snippet, we are not checking for the same but if you want, you can store the selected guesser for each game as well. 
We store the chosen player's guess and update the Game structure.
Fill in the missing code snippet and click next.

```
export function makeAGuess(gameId: u32, guess: boolean): string {
    const newGame = new Game();
    for(let i =0; i< games.length; i++){
        if(games[i].id == gameId && games[i].gameState == GameState.InProgress) {
            newGame.id = games[i].id;
            newGame.deposit1 = games[i].deposit1;
            newGame.deposit2 = games[i].deposit2;
            newGame.player1 = games[i].player1;
            newGame.player2 = games[i].player2;
            newGame.gameState = games[i].gameState;
            //Missing code snippet
            games.replace(i,newGame);
            return "Done"
        }
    }
    return "Game Not Found";
}

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
 
 if(context.sender == games[i].player1){
                newGame.player1Guess = guess;
            }
            else {
                newGame.player2Guess = guess;
            } -->
Run the test cases to check the correctness of your code.

## Finish The Game

The last step is to do the toss and declare the winner. In this step, we will simulate a toss by generating a Random Number again!(By now, you should be a pro in this :P). You can use any condition of your choice that returns true/false to check against the random number and declare the winner.

It is very important before declaring the winner and transferring the amount that all the game related checks are in place.

As a last step, the winner will get all the amount that was bet by both the players in the game. For this, we would use a cross-contract call.
You might have observed that we imported a class called "ContractPromiseBatch" from the near assembly script sdk. This class contains code to perform batch actions from within an AssemblyScript contract. 

*** How does it work?***
1. We will use the .create method to get the account ID of the beneficiary.
2. We will then use the .transfer method to transfer the amount to the beneficiary.
Reference Link: https://near.github.io/near-sdk-as/classes/_sdk_core_assembly_promise_.contractpromisebatch.html

Fill up the missing code snippets to complete the function.

 ```
export function finishGame(gameId: u32) : string {

  const randomNumber = new RNG<u32>(1, u32.MAX_VALUE);
  const randomNum = randomNumber.next();
  for(let i =0; i< games.length; i++)
  { 
    logging.log("In the for loop - finishGame function");
    logging.log("gameIs id: " + gameId.toString());
      if(games[i].id == gameId && 
        games[i].gameState == GameState.InProgress)
      {
        logging.log("Found a game in progress with is:" + games[i].id.toString());
        logging.log("Random number generated is: "+ randomNum.toString());
        logging.log("Player 1 address is: "+ games[i].player1);
        logging.log("Player 2 address is: "+ games[i].player2);

        if(randomNum %3 == 0){
          if(games[i].player2Guess == true) {
          logging.log("Game Winner is: "+ games[i].player2);
          const updateGame = new Game();
          updateGame.gameState = GameState.Completed;
          updateGame.player1 = games[i].player1;
          updateGame.player2 = games[i].player2;
          updateGame.deposit1 = games[i].deposit1;
          updateGame.deposit2 = games[i].deposit2;
          updateGame.id = games[i].id;
          updateGame.winner = games[i].player2;
          games.replace(i, updateGame);

          //Send 2*deposit to the winning player

          //Missing code snippet
          to_beneficiary.transfer(u128.add(updateGame.deposit1, updateGame.deposit2));
          return updateGame.winner;

          }
          else {
            logging.log("Game Winner is: "+ games[i].player1);
            const updateGame = new Game();
            updateGame.gameState = GameState.Completed;
            updateGame.player1 = games[i].player1;
            updateGame.player2 = games[i].player2;
            updateGame.deposit1 = games[i].deposit1;
            updateGame.deposit2 = games[i].deposit2;
            updateGame.id = games[i].id;
            updateGame.winner = games[i].player1;
            games.replace(i, updateGame);
  
            //Send 2*deposit to the winning player
            const to_beneficiary = ContractPromiseBatch.create(updateGame.winner);
            //Missing code snippet
            return updateGame.winner;
          }
        }
        else {
          if(games[i].player2Guess == false){
          logging.log("Game Winner is: "+ games[i].player2);
          const updateGame = new Game();
          updateGame.gameState = GameState.Completed;
          updateGame.player1 = games[i].player1;
          updateGame.player2 = games[i].player2;
          updateGame.deposit1 = games[i].deposit1;
          updateGame.deposit2 = games[i].deposit2;
          updateGame.id = games[i].id;
          updateGame.winner = games[i].player2;
          games.replace(i, updateGame);

          //Send 2*deposit to the winning player
          const to_beneficiary = ContractPromiseBatch.create(updateGame.winner);

          to_beneficiary.transfer(u128.add(updateGame.deposit1, updateGame.deposit2));
          return updateGame.winner;
        }
        else {
          logging.log("Game Winner is: "+ games[i].player1);
          const updateGame = new Game();
          updateGame.gameState = GameState.Completed;
          updateGame.player1 = games[i].player1;
          updateGame.player2 = games[i].player2;
          updateGame.deposit1 = games[i].deposit1;
          updateGame.deposit2 = games[i].deposit2;
          updateGame.id = games[i].id;
          updateGame.winner = games[i].player1;
          games.replace(i, updateGame);

          //Send 2*deposit to the winning player
          const to_beneficiary = ContractPromiseBatch.create(updateGame.winner);
          to_beneficiary.transfer(u128.add(updateGame.deposit1, updateGame.deposit2));
          return updateGame.winner;
        }
    }
    }
  }
return 'None';
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
