var Web3 = require('web3');
var web3 = new Web3('ws://localhost:8545');

var ContractAddress = process.argv[2];

console.log('CONTRACT ADDRESS:', ContractAddress);

var ABIString = '[{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"data","type":"uint256"}],"name":"ItBlinks","type":"event"}]';
	
//  Use the string and convert to a JSON object - ABI
var ABI = JSON.parse(ABIString);

// now retrieve your contract object with the ABI and contract address values
var blinker = new web3.eth.Contract(ABI, ContractAddress);

if (blinker) console.log('CONTRACT INSTANTIATED SUCCESSFULLY!');

var coinbase;
//Async call to retrieve coinbase account
var getCoinbase = async () => {
	const accounts = await web3.eth.getAccounts();
	coinbase = accounts[0];
	return;
}

getCoinbase().then(() => {
	blinker.methods.set(1).send({
		from: coinbase,
	});
	
	console.log('SENDING TRANSACTION...');
})

