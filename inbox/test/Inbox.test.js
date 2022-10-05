// contract test code will go here
const assert = require('assert'); //testler hakkinda iddialarda bulunmak 
const ganache = require('ganache-cli');
const Web3 = require('web3'); //constructor.kurucu
const web3 = new Web3(ganache.provider()); //ornek olusturduk ve ganacheden provider olustrduk.
const {interface, bytecode} = require('../compile');


let accounts;
let inbox;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts(); //hesap oluştuduk. ganache ile mocha ile test ettik.

    inbox = await new web3.eth.Contract(JSON.parse(interface))// web3e onunla iletisim kurmak için biir arayüze sahip bir sözleşme olduğunu söyler
    .deploy({data : bytecode, arguments : ['Hi there!']})//web3e yeni bir sözelşme dağıtmak istediğimizi. data bytcode belirtir argumenets ile constructor fonksiyondur. classtan constructor gibi
    .send({from : accounts[0], gas : '1000000'});//sözleşmeyi alan ve ağa atan adres

})

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);//test ağındaki adrese sözleşmenin dağıtılıp dağıtılamadığı
        //sozlesme test agina dagitildiiktan sonra bu adres ozelligi ile sozlesmenin dagitildigi yerin adresini icerecektir.
    });

    it('has a defaulut message', async() => {
        const message = await inbox.methods.message().call() //inbox contracı içindeki methodları eriştik message() ve setMessage() metodları vardı metod ismini yazdik ve call ile cagirdik.
        assert.equal(message,'Hi there!');
    });
    
    it('can change the message', async() =>{
        await inbox.methods.setMessage('bye').send({ from: accounts[0] })

        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});