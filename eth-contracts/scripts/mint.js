// truffle exec scripts/mint.js --network rinkeby

const solnSquareVerifier = require('../build/contracts/SolnSquareVerifier.json')
const { initialize } = require('zokrates-js/node')
const fs = require('fs')

let provingKey, artifacts, zokratesProvider
const setup = async () => {

    let accounts = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId()
    const deployedNetwork = solnSquareVerifier.networks[networkId]
    const meta = new web3.eth.Contract(
        solnSquareVerifier.abi,
        deployedNetwork.address,
    )
    const codeBuff = fs.readFileSync("../zokrates/code/square/square.code")
    const code = codeBuff.toString('utf8')
    provingKey = fs.readFileSync("../zokrates/code/square/proving.key")
    zokratesProvider = await initialize()
    artifacts = zokratesProvider.compile(code)

    return {
        account_one: accounts[0],
        account_two: accounts[1],
        meta: meta
    }


}



module.exports = async callback => {
    console.log('******************START MINTING SCRIPT **********************')
    try {
        const { account_one, account_two, meta } = await setup()
        const methods = meta.methods
        let witness, proof, result

        // mint tokens 1 , 4, 9 ...etc
        for (let i = 1; i < 11; i++) {
            console.log(`Adding solution for token ${i}`)
            witness = (zokratesProvider.computeWitness(artifacts, [i.toString(), (i * i).toString()])).witness
            proof = zokratesProvider.generateProof(artifacts.program, witness, provingKey)
            result = await methods.addSolution(proof.proof.a, proof.proof.b, proof.proof.c, i).send({ from: account_two })
            console.log('Solution added ', result)
            console.log(`Minting token ${i}`)
            result = await methods.mint(account_two, i).send({ from: account_one })
            console.log('Token Minted ', result)

        }
    } catch (error) {
        console.log(error)
    }
    console.log('******************END **********************')
    callback()
}