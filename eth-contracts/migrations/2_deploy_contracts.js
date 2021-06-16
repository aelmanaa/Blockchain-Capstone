// migrating the appropriate contracts
//let SquareVerifier = artifacts.require("./SquareVerifier.sol")
//let SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol")
let usingProvable = artifacts.require("./usingProvable.sol")
let MiyaERC721Token = artifacts.require("./MiyaERC721Token.sol")

module.exports = function(deployer) {
  //deployer.deploy(SquareVerifier)
  //deployer.deploy(SolnSquareVerifier)
  deployer.deploy(usingProvable)
  deployer.deploy(MiyaERC721Token)
}
