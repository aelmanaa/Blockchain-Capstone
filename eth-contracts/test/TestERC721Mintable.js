let MiyaERC721Token = artifacts.require('MiyaERC721Token')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { expectEvent } = require('@openzeppelin/test-helpers')
const { assert } = require('chai')
chai.use(chaiAsPromised)
const { expect } = chai
chai.should()

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0]
    const account_two = accounts[1]
    const account_three = accounts[2]
    let contract
    let res1, res2, res3, res4

    describe('match erc721 spec', () => {
        beforeEach(async () => {
            contract = await MiyaERC721Token.new({ from: account_one })

            // simulate minting of several tokens
            assert.equal(await contract.mint.call(account_two, 1), true, "Token not mintable")
            assert.equal(await contract.mint.call(account_two, 2), true, "Token not mintable")
            assert.equal(await contract.mint.call(account_two, 3), true, "Token not mintable")
            assert.equal(await contract.mint.call(account_three, 4), true, "Token not mintable")

            // mint multiple tokens
            res1 = await contract.mint(account_two, 1)
            res2 = await contract.mint(account_two, 2)
            res3 = await contract.mint(account_two, 3)
            res4 = await contract.mint(account_three, 4)

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
        it('verrification events', async () => {

            expectEvent(res1, 'Transfer', { _from: account_one, _to: account_two, _tokenId: web3.utils.toBN(1) })
            expectEvent(res2, 'Transfer', { _from: account_one, _to: account_two, _tokenId: web3.utils.toBN(2) })
            expectEvent(res3, 'Transfer', { _from: account_one, _to: account_two, _tokenId: web3.utils.toBN(3) })
            expectEvent(res4, 'Transfer', { _from: account_one, _to: account_three, _tokenId: web3.utils.toBN(4) })

        })

        it('should return total supply', async () => {

            let totalSupply = await contract.totalSupply()
            assert.equal(totalSupply.toString(), '4', "TotalSupply not Correct")

        })

        it('should get token balance', async () => {

            let balanceOfAccount1 = await contract.balanceOf(account_one)
            let balanceOfAccount2 = await contract.balanceOf(account_two)
            let balanceOfAccount3 = await contract.balanceOf(account_three)
            assert.equal(balanceOfAccount1.toString(), '0', "Balance not Correct")
            assert.equal(balanceOfAccount2.toString(), '3', "Balance not Correct")
            assert.equal(balanceOfAccount3.toString(), '1', "Balance not Correct")
        })

        it('should return token uri', async () => {
            let tokenURI1 = await contract.tokenURI(1)
            let tokenURI2 = await contract.tokenURI(2)
            let tokenURI3 = await contract.tokenURI(3)
            let tokenURI4 = await contract.tokenURI(4)

            assert.equal(tokenURI1, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1', "URI not correct")
            assert.equal(tokenURI2, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2', "URI not correct")
            assert.equal(tokenURI3, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3', "URI not correct")
            assert.equal(tokenURI4, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/4', "URI not correct")

        })

        it('should transfer token from one owner to another', async () => {

            assert.equal(await contract.ownerOf(1), account_two, "Owner not correct")

            let resTransfer = await contract.transferFrom(account_two, account_three, 1, { from: account_two })
            expectEvent(resTransfer, 'Transfer', { _from: account_two, _to: account_three, _tokenId: web3.utils.toBN(1) })

            let balanceOfAccount2 = await contract.balanceOf(account_two)
            let balanceOfAccount3 = await contract.balanceOf(account_three)
            assert.equal(balanceOfAccount2.toString(), '2', "Balance not Correct")
            assert.equal(balanceOfAccount3.toString(), '2', "Balance not Correct")

            assert.equal(await contract.ownerOf(1), account_three, "Owner not correct")

        })

        it('can transfer token if approval for a given token', async () => {

            await contract.transferFrom(account_two, account_three, 1, { from: account_one }).should.be.rejectedWith('Account not approved or owner')
            await contract.approve(account_one, 1, { from: account_two })

            await contract.transferFrom(account_two, account_three, 1, { from: account_one })
            assert.equal(await contract.ownerOf(1), account_three, "Owner not correct")

        })

        it('can transfer token if approval for all', async () => {

            await contract.transferFrom(account_two, account_three, 1, { from: account_one }).should.be.rejectedWith('Account not approved or owner')
            await contract.setApprovalForAll(account_one, true, { from: account_two })

            await contract.transferFrom(account_two, account_three, 1, { from: account_one })
            assert.equal(await contract.ownerOf(1), account_three, "Owner not correct")

        })
    })

    describe('have ownership properties', () => {
        beforeEach(async () => {
            contract = await MiyaERC721Token.new({ from: account_one })
        })

        it('should fail when minting when address is not contract owner', async () => {
            await contract.mint(account_two, 1, { from: account_two }).should.be.rejectedWith('Caller must be owner of the contract')
        })

        it('should return contract owner', async () => {
            assert.equal(await contract.getOwner(), account_one, "Contract owner not correct")
        })

    })
})