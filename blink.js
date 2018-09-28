var Web3 = require('web3');

var web3 = new Web3('ws://localhost:8545');

var Gpio = require('onoff').Gpio;

// set the pin for the LED light
var led = new Gpio(21,'out');
var iv; 

//Check connection
web3.eth.net.isListening().then((connected) => console.log('IS CONNECTED:', connected));

// test to see if a local coinbase is running ... we'll need this account to interact with a contract.
var coinbase;
//Async call to retrieve coinbase account
var getCoinbase = async () => {
	const accounts = await web3.eth.getAccounts();
	coinbase = accounts[0];
	return;
}

var balance;
//Async call to retrieve coinbase balance
var getBalance = async () => {
	balance = await web3.eth.getBalance(coinbase);
	return;
}

//Get coinbase then check balance and send transaction to trigger blink event
getCoinbase().then(() => {
	console.log('COINBASE:', coinbase);
	getBalance().then(() => {
		console.log('BALANCE IN ETHER:', web3.utils.fromWei(balance, 'ether'));
	});
	
	var ABIString = '[{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"data","type":"uint256"}],"name":"ItBlinks","type":"event"}]';
	
	//  Use the string and convert to a JSON object - ABI
	var ABI = JSON.parse(ABIString);
	
	// what contract are we going to interact with? (Copy from truffle deploy)
	//var ContractAddress = '0x565f0abe6f08fca4c2c704de1a270a0b678fd316';
	var ContractAddress = process.argv[2];
	console.log('CONTRACT ADDRESS:', ContractAddress);
	// now retrieve your contract object with the ABI and contract address values
	var blinker = new web3.eth.Contract(ABI, ContractAddress);
	
	if (blinker) console.log('CONTRACT INSTANTIATED SUCCESSFULLY!');
	
	/* USED FOR SENDING TRANSACTION
	blinker.methods.set(1).send({
		from: coinbase,
	});
	
	console.log('SENDING TRANSACTION...');
	*/

	// indefinite recursive loop to read the 'ItBlinks' event in the blink contract.
	var event = blinker.events.ItBlinks({}, function(error, result) {
	  if (!error) {
	    var blinkCount = result.returnValues.data;
	    // when ItBlinks event is fired, output the value 'data' from the result object and the block number
	    var msg = "\n\n*********\n";
	    msg += "Blink!\n";
	    msg += "*********";
	    
	    console.log(msg);
	    
	    //now loop the light blink on for a half second, then off for half second
	    iv = setInterval(function(){
		led.writeSync(led.readSync() === 0 ? 1 : 0)
	    }, 500);
	
	    // Stop blinking the light after 10 seconds.
	    setTimeout(function() {
	    	clearInterval(iv); // Stop blinking
		led.writeSync(0); //Turn LED off
	    }, blinkCount+1*500);
	
	  }
	});
});
