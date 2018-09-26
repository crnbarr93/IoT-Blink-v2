# IoT-Blink (blink.js)
Simple Blink Example using Raspberry Pi, LED Light and Ethereum (web3 1.0.0)

## Versions and Dependencies

* `ganache-cli v6.1.8`
* `Node v8.9.0`
* `npm v5.5.1`
* `web3 v1.0.0-beta.36`
* `onoff v1.1.2`
* `truffle v4.1.13`

## Installation & Starting

### Installation
Before doing anything make sure the breadboard and LED are correctly connected to the Raspberry Pi. Make note of the GPIO pin being used.
Once you have cloned the repo make sure to install the `package.json` dependencies. From inside the IoT-Blink directory run:

	`npm i`

1. In one terminal window initialise ganache-cli:

	`ganache-cli`

2. In another terminal window change directory to IoT-Blink
3. Navigate to the truffle directory

	`cd truffle`

4. Compile the solidity contracts

	`truffle compile`

5. Migrate the solidity contracts

	`truffle migrate`

6. Copy the contract address, the line printed in the terminal should read:

	`Blink: ...<contract adddress>`

7. Open `blink.js` in any text editor and replace the following line with the LEDs GPIO pin number:

	`var led = new Gpio(<PIN NUMBER>, 'out')`


### Running
 
1. Run blink.js, passing the contract address with the address from step 6 in the previous section in place of ADDRESS:

       node blink.js ADDRESS

2. In another terminal window run `transaction.js`, replacing the contract address as in the previous step:

	`node transaction.js ADDRESS`

3. The LED should begin to blink!