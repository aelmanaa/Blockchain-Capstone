// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
const Verifier = artifacts.require('Verifier')
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier')
const { initialize } = require('zokrates-js/node')
const fs = require('fs')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { expectEvent } = require('@openzeppelin/test-helpers')
const { assert } = require('chai')
chai.use(chaiAsPromised)
const { expect } = chai
chai.should()


contract('TestSolnSquareVerifier', async accounts => {

    const account_one = accounts[0]
    const account_two = accounts[1]
    const account_three = accounts[2]
    let contract, verifier

    const codeBuff = fs.readFileSync("../zokrates/code/square/square.code")
    const code = codeBuff.toString('utf8')
    const provingKey = fs.readFileSync("../zokrates/code/square/proving.key")
    const zokratesProvider = await initialize()
    const artifacts = zokratesProvider.compile(code)

    describe('add new solution', () => {
        beforeEach(async () => {
            verifier = await Verifier.new({ from: account_one })
            contract = await SolnSquareVerifier.new(verifier.address, { from: account_one })

        })


        it('verify instatiation', async () => {
            let contractName = await contract.getName()
            let contractSymbol = await contract.getSymbol()
            let contractBaseTokenURI = await contract.getBaseTokenURI()
            //verify

            assert.equal(contractName, 'MIYA721', "Name not correct")
            assert.equal(contractSymbol, 'MIYA', "Symbol not correct")
            assert.equal(contractBaseTokenURI, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/', "Base URI not correct")

        })

        it('can add solution if proves ownership of token ', async () => {
            // verify ownership of tokenID 25 , must know 5         
            const { witness } = zokratesProvider.computeWitness(artifacts, ["5", "25"])
            const proof = zokratesProvider.generateProof(artifacts.program, witness, provingKey)
            let result = await contract.addSolution(proof.proof.a, proof.proof.b, proof.proof.c, 25, { from: account_two })
            expectEvent(result, 'NEW_SOLUTION', { _prover: account_two, _tokenId: web3.utils.toBN(25) })

        })

        it('cannot add same solution ', async () => {
            // verify ownership of tokenID 25 , must know 5         
            const { witness } = zokratesProvider.computeWitness(artifacts, ["5", "25"])
            const proof = zokratesProvider.generateProof(artifacts.program, witness, provingKey)
            await contract.addSolution(proof.proof.a, proof.proof.b, proof.proof.c, 25, { from: account_two })
            await contract.addSolution(proof.proof.a, proof.proof.b, proof.proof.c, 25, { from: account_two }).should.be.rejectedWith('Solution was already provided')

        })

        it('proof must be correct ', async () => {
            const { witness } = zokratesProvider.computeWitness(artifacts, ["5", "25"])
            const proof = zokratesProvider.generateProof(artifacts.program, witness, provingKey)
            // corrupt proof , change token from 25 to 26
            await contract.addSolution(proof.proof.a, proof.proof.b, proof.proof.c, 26, { from: account_two }).should.be.rejectedWith('Provided proof is wrong')

        })
    })

    describe('Test minting', () => {
        beforeEach(async () => {
            verifier = await Verifier.new({ from: account_one })
            contract = await SolnSquareVerifier.new(verifier.address, { from: account_one })
            // add solution
            const { witness } = zokratesProvider.computeWitness(artifacts, ["5", "25"])
            const proof = zokratesProvider.generateProof(artifacts.program, witness, provingKey)
            await contract.addSolution(proof.proof.a, proof.proof.b, proof.proof.c, 25, { from: account_two })
        })

        it('cannot mint a token which was not verified ', async () => {
            await contract.mint(account_two, 1, { from: account_one }).should.be.rejectedWith('Token ownership was not verified')

        })
        it('cannot mint a token which was verified by another account ', async () => {
            await contract.mint(account_three, 25, { from: account_one }).should.be.rejectedWith('Token owner is wrong')

        })

        it('can mint token already verified by right owner ', async () => {
            // beginning total supply is 0
            let totalSupply = await contract.totalSupply()
            assert.equal(totalSupply.toString(), '0', "TotalSupply not Correct")
            // check we will be able to mint
            assert.equal(await contract.mint.call(account_two, 25, { from: account_one }), true, "Token not mintable")
            let result = await contract.mint(account_two, 25, { from: account_one })
            expectEvent(result, 'Transfer', { _from: account_one, _to: account_two, _tokenId: web3.utils.toBN(25) })
            // token total supply is one
            totalSupply = await contract.totalSupply()
            assert.equal(totalSupply.toString(), '1', "TotalSupply not Correct")
            // check balance
            assert.equal((await contract.balanceOf(account_two)).toString(), '1', "Balance not Correct")
            // check URI of token
            assert.equal(await contract.tokenURI(25), 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/25', "URI not correct")
            // check ownership
            assert.equal(await contract.ownerOf(25), account_two, "Owner not correct")


        })

    })

})