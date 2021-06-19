// migrating the appropriate contracts
let Verifier = artifacts.require("./Verifier.sol")
let SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol")
let usingProvable = artifacts.require("./usingProvable.sol")
let MiyaERC721Token = artifacts.require("./MiyaERC721Token.sol")

module.exports = function (deployer) {
  deployer.deploy(Verifier).then(() => {
    deployer.deploy(SolnSquareVerifier, Verifier.address)
  })
  deployer.deploy(usingProvable)
  deployer.deploy(MiyaERC721Token)
}
