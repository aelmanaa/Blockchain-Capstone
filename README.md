# Udacity Blockchain Capstone

The capstone will build upon the knowledge you have gained in the course in order to build a decentralized housing product. 

### Dependencies
For this project, you will need to have:
1. **Node and NPM** installed - NPM is distributed with [Node.js](https://www.npmjs.com/get-npm)
```bash
# Check Node version, Project tested with version v12.22.1. you can use "nvm" to switch between node versions
node -v
# Check NPM version, Project tested with v7.15.0
npm -v
```


2. **Truffle v5.X.X** - A development framework for Ethereum. 
```bash
# Unsinstall any previous version
npm uninstall -g truffle
# Install
npm install -g truffle
# Specify a particular version. Project tested with v5.3.6
npm install -g truffle@5.3.6
# Verify the version
truffle version
```


3. **Metamask: 9.5.2** - If you need to update Metamask just delete your Metamask extension and install it again.


4. Ganache for testing. make sure it runs on port 8585

5. **Load Infura key and your metamask pass phrase  ** in `.env` file (please created within eth-contracts folder):
```
MNEMONIC="<your-metamask-pass-phrase>"
INFURA_API_KEY=<infura-rinkeby-api-key>
```

### Run the application

1. Start ganache on port 8585
2. Go to solidity project `cd eth-contracts`
3. Compile `truffle compile`
4. Run tests `truffle test` . All tests must pass
5. Migrate to rinkeby network `truffle migrate --network rinkeby --reset`
6. Run minting script in order to mint 10 tokens `truffle exec scripts/mint.js --network rinkeby`


### Compare with my results

1. contracts ABIs can be found in `build/contracts`
2. contract address is `0xc3CB908cc8506a0e5a3C9f483fF8699AF554dAe8` could be found on [Rinkeby](https://rinkeby.etherscan.io/address/0xc3CB908cc8506a0e5a3C9f483fF8699AF554dAe8)
3. collection `MIYA721` on [Opensea](https://testnets.opensea.io/collection/miya721)
4. 1st owner of every item (cfr. mint script) is `account_two` which is `0xb3996aad85a84b1fa5e451fcc0f5ba2e838609d8`.  This account can then post any of his NFT on sale on Opensea. For instance, you can see here that the owner sold tokenId `2`:
   1. First there was a transaction in order to approve Opensea to sell token on account_two behalf. [Etherscan](https://rinkeby.etherscan.io/tx/0x0b9151b0119f8ece9db0e4ab086df2254d96dcdc67bdcaf6ca551aa0f6b7b753)
   2. Then NFT was sold to another account . Transaction can be seen here [Etherscan](https://rinkeby.etherscan.io/tx/0xa6772fcfc230921612aa47fbfe699616926e8f121d44f5f62be4be9586773014)
   3. The trading history of this token can be found on [OpenSea](https://testnets.opensea.io/assets/0xc3cb908cc8506a0e5a3c9f483ff8699af554dae8/2) and shows indeeded that token `2` was transfered from `0xb3996aad85a84b1fa5e451fcc0f5ba2e838609d8` to `0x0d718cfb215e84174d2118a38cd827d8ddbb13e8`


