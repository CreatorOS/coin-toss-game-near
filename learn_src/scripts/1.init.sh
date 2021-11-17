
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
dir_path=$(dirname $(realpath $0))
# near deploy --accountId $OWNER --wasmFile ./build/release/cointoss.wasm
echo "creating first dev-account"
until near dev-deploy $dir_path/../build/release/cointoss.wasm 2>/dev/null; do :; done

export user1=$(cat $dir_path/../neardev/dev-account)
echo "user1: $user1"


echo "creating second dev-account"
rm -rf $dir_path/../neardev
until near dev-deploy $dir_path/../build/release/cointoss.wasm 2>/dev/null; do :; done

export user2=$(cat $dir_path/../neardev/dev-account)
echo "user2: $user2"
