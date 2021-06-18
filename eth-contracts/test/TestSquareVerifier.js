let Verifier = artifacts.require('Verifier')
const fs = require('fs')
const { assert } = require('chai')


contract('TestSquareVerifier', accounts => {
    const account_one = accounts[0]
    let contract
    const proof = JSON.parse(fs.readFileSync("../zokrates/code/square/proof.json"))
    let isVerified
    beforeEach(async () => {
        contract = await Verifier.new({ from: account_one })

    })

    it('correct proof', async () => {
        isVerified = await contract.verifyTx(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs)
        assert.equal(isVerified, true, "Verification not correct")

    })


    it('incorrect proof', async () => {
        let cheat = [...proof.inputs]
        cheat[cheat.length - 1] = cheat[cheat.length - 1].replace(/[01]$/, cheat[cheat.length - 1][65] == '1' ? '0' : '1')
        isVerified = await contract.verifyTx(proof.proof.a, proof.proof.b, proof.proof.c, cheat)
        assert.equal(isVerified, false, "Verification not correct")

    })


})
