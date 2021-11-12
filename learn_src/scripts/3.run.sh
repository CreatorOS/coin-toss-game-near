#!/usr/bin/env bash
set -e

echo
echo \$CONTRACT is $CONTRACT
echo \$OWNER is $OWNER
echo \1477013871 is 1477013871
echo

#Step 1: #call get player 1 details from the contract
near call $CONTRACT getPlayer1Details '{"gameId":2286108068}' --account_id $OWNER 

#Step 2: Get the gameState after game creation - should be 0

near call $CONTRACT getGameState '{"gameId":2286108068}' --account_id $OWNER

#Step 3: Get all the gameIds and deposits for games that are in created state
near call $CONTRACT getActiveGames --account_id $OWNER

near call $CONTRACT getActiveGamesDeposit --account_id $OWNER

#Step 4: Call joinGame using another account id
near call $CONTRACT joinGame '{"gameId":2286108068}' --amount 15 --account_id $user1

#Step 5: Get the game state after joining the game - should be 1
near call $CONTRACT getGameState '{"gameId":2286108068}' --account_id $OWNER

#Step 6: Call function chooseGuesser to return who has been chosen to guess
near call $CONTRACT chooseGuesser '{"gameId":2286108068}' --account_id $OWNER
