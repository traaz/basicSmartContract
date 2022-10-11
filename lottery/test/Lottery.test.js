const assert = require('assert'); 
const { Console } = require('console');
const ganache = require('ganache-cli');
const Web3 = require('web3'); 
const web3 = new Web3(ganache.provider()); 
const {interface, bytecode} = require('../compile.js');



let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery= await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from : accounts[0], gas:'1000000'});
});

describe('Lottery Contract', () => {
    //sozlesmeyi dagitmak icin
    it('deploys a contract', () =>{
        assert.ok(lottery.options.address)//sozlesmenin yerel test agina konuslandirildigi adres
    })
    //hesabın girmesi icin. tek kisi
    it('allows one account to enter', async ()=> {

        await lottery.methods.enter().send({
            from: accounts[0],
            //kimin cekilise girmeye calistigini test ettik.
            value: web3.utils.toWei('0.02','ether')
           
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]//bu islevi  kim cagiriyor? birinci hesap cagiriyor
        });

        assert.equal(accounts[0], players[0]); //hesaplarin icinde adresler vardi. hesabin birinci elemeni(Adres) playerstaki adrese esit mi
        assert.equal(1, players.length); // adres icerde var mi yani uzunlugu 1 mi



    });

    it('allows multiply account to enter', async ()=> {

        await lottery.methods.enter().send({
            from: accounts[0],
            //kimin cekilise girmeye calistigini test ettik.
            value: web3.utils.toWei('0.02','ether')
           
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            //kimin cekilise girmeye calistigini test ettik.
            value: web3.utils.toWei('0.02','ether')
           
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            //kimin cekilise girmeye calistigini test ettik.
            value: web3.utils.toWei('0.02','ether')
           
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]//bu islevi  kim cagiriyor? birinci hesap cagiriyor
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]); 
        assert.equal(3, players.length); 
    });

    it('requires a minimum amount of ether to enter', async () =>{
        try{
        await lottery.methods.enter().send({
            from : accounts[0],//metodu gonderen
            value: 0

        });
        assert(false);//try icindeki kod hata vermezse bu calisir ve test basarisiz olur
    }catch(err){
        assert(err);
    }
    });

    it('only manager can call pickWinner', async () =>{
        try{
        await lottery.methods.pickWinner().send({
            from : accounts[1],
        });
        assert(false);//try icindeki kod hata vermezse bu calisir ve test basarisiz olur
    }catch(err){
        assert(err);
    }
    });

    //sozlesmeye sadece bir oyuncu eklicez. kestirme icin. rastgele olayiyla ugrasmmicaz
    it('sends money to the winner and resets the players array', async() =>{

        await lottery.methods.enter().send({
            from: accounts[0],                               //50-2,1 =47,9. 0.1 gas olsun dedik.
            value: web3.utils.toWei('2','ether')
        });
        const initialBalance = await web3.eth.getBalance(accounts[0]);//adresteki ether miktarini dondurur. kasa 47.9
        await lottery.methods.pickWinner().send({from:accounts[0]});   //kasa 49.9
        const finalBalance = await web3.eth.getBalance(accounts[0]);   //kasa 49.9
//gas maliyeti oldugu icin alinan miktardan sonra kasa iki etherden biraz az olacak
       const difference = finalBalance - initialBalance;  //49.9-47.9=2
       assert(difference > web3.utils.toWei('1.8','ether'));
     
    });

    it('checks there are no players after pick winner', async() =>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2','ether')
        });
        await lottery.methods.pickWinner().send({
            from: accounts[0]
    });
        const players= await lottery.methods.getPlayers().call();
        assert(players.length ==0);
    });

    it('checks the lottery balance is empty after pick winner is called', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2','ether')
        });
        await lottery.methods.pickWinner().send({
            from:accounts[0]
        })
        const balance =  await web3.eth.getBalance(lottery.options.address); //contractin dagitildigi adresteki bakiyeyi aldik
        assert(balance ==0 );
    })

    
});