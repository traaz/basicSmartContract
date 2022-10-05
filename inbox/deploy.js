const HDWalletProvider = require("@truffle/hdwallet-provider")

// deploy code will go here
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider (
    'MY KEYWRODS',
    'https://goerli.infura.io/v3/ebb095f0e95f4082a63af72b4c4d90e0'
  
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('My address',accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data : bytecode, arguments : ['Hi there!']})
    .send({gas: '1000000', from: accounts[0]});

    console.log('Contract deployed to ', result.options.address); //sozlesme(contract) adresi
    provider.engine.stop()
}
deploy();
