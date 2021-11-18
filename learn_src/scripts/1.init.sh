
# [ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable"
# [ -z "$OWNER" ] && echo "Missing \$OWNER environment variable"

# echo "deleting $CONTRACT and setting $OWNER as beneficiary"
# echo
# near delete $CONTRACT $OWNER

echo --------------------------------------------
echo
echo "cleaning up the /neardev folder"
echo
rm -rf ./neardev

# exit on first error after this point to avoid redeploying with successful build
# set -e

echo --------------------------------------------
echo
echo "rebuilding the contract (release build)"
echo
yarn build:release

echo --------------------------------------------
echo
echo "redeploying the contract"
echo
contract_file=cointoss.wasm
dir_path=$(dirname $(realpath $0))
# near deploy --accountId $OWNER --wasmFile ./build/release/$contract_file
echo "creating first dev-account"
until yes | near dev-deploy ./build/release/$contract_file; do :; done

export user1=$(cat ./neardev/dev-account)
echo "user1: $user1"


echo "creating second dev-account"
rm -rf ./neardev
until yes | near dev-deploy ./build/release/$contract_file; do :; done

export user2=$(cat ./neardev/dev-account)
echo "user2: $user2"
