const Web3 = require('web3');
const path = require('path');
const cjson = require('cjson');
const Tx = require('ethereumjs-tx');

const abis = require('./abis');
const price = require('./price');

// contract details
const chain = process.env.CHAIN || 'rinkeby';
const infuraKey = process.env.INFURA;
const provider = `https://${chain}.infura.io/v3/${infuraKey}`;
const contractAddress = process.env.CONTRACT;
const privateKey = Buffer.from(process.env.PRIVATEKEY, 'hex');
const defaultAccount = process.env.ACCOUNT;

// initiate the web3
const web3 = new Web3(provider);

// initiate the contract with null value
let contract = null;

// convert Wei to Eth
function convertWeiToEth( stringValue ) {
  if ( typeof stringValue != 'string' ) {
    stringValue = String( stringValue );
  }
  return web3.utils.fromWei( stringValue, "ether" );
}

// Initiate the Contract
function getContract() {	
  if (contract === null) {
    const abi = abis('erc20');
    const c = new web3.eth.Contract(abi,contractAddress)
    contract = c.clone();
    console.log('Contract Initiated successfully!')
  }
  return contract;
}

// send token to Address
async function sendToken(req, res) {
  const address = req.body.address;
  const tokens = web3.utils.toWei(req.body.tokens);

  if (address && tokens) {
    // get transaction count, later will used as nonce
    try {
        const nonce = await web3.eth.getTransactionCount(defaultAccount);
        const rawTransaction = {
            "from": defaultAccount,
            "gasPrice": web3.utils.toHex(2 * 1e9),
            "gasLimit": web3.utils.toHex(210000),
            "to": contractAddress,
            "value": "0x0",
            "data": getContract().methods.transfer(address, tokens).encodeABI(),
            "nonce": web3.utils.toHex(nonce)
        }; 
        // create the transaction
        const transaction = new Tx.Transaction(rawTransaction, { chain });
        // sign it
        await transaction.sign(privateKey)
        // wait
        const result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
        return res.send(result)
    } catch (error) {
      res.status(404).send({ error: error.message })
    }
  } else {
      res.status(400).send({ error: 'Wallet address or amount of ether parameters are missing' })
  }

}

// get the balance of given address
async function getBalance(req, res) {
  var address = req.query.address
  if (address) {
    // get the Ether balance of the given address
    var ethBalance = convertWeiToEth( await web3.eth.getBalance(address)) || '0'

    // get token symbol
    var tokenSymbol = await getContract().methods.symbol().call() || ''

    // get the token balance of the given address
    var tokenBalance = convertWeiToEth(await getContract().methods.balanceOf(address).call()) || '0'

    // setup response
    const response = {
      'ETH': ethBalance
    };
    response[tokenSymbol] = tokenBalance

    // response data
    return res.send(response)
  } else {
    res.status(400).send({ error: 'address parameter not present' })
  }
}

// get the token price
async function getPrice(req, res) {
  let _price;
  try {
    _price = await price(web3);
  } catch (error) {
    res.status(404).send({ error: error.message })
  }
  // response data
  return res.send(JSON.stringify(_price))
}


module.exports = {
  send: sendToken,
  balance: getBalance,
  price: getPrice
}