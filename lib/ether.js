const Web3 = require('web3')
const Tx = require('ethereumjs-tx')

// contract details
const chain = 'rinkeby';
const provider = 'https://rinkeby.infura.io/v3/67449edb906d410187d9312098bd83f6'
const privateKey = Buffer.from(process.env.PRIVATEKEY, 'hex')
const defaultAccount = process.env.ACCOUNT;

// initiate the web3
const web3 = new Web3(provider)

// convert Wei to Eth
function convertWeiToEth( stringValue ) {
  if ( typeof stringValue != 'string' ) {
    stringValue = String( stringValue );
  }
  return web3.utils.fromWei( stringValue, "ether" );
}

// send token to Address
async function sendEther(req, res) {
  const address = req.body.address;
  const ether = req.body.ether;

  if (address && ether) {    
    try {
      const wei = web3.utils.toWei(req.body.ether);
      const balance = convertWeiToEth( await web3.eth.getBalance(defaultAccount)) || '0';       
      
      if(parseFloat(balance) < parseFloat(ether)) {
        console.log('insufficient funds');
        return res.send(`insufficient-funds`);
      }
      
      // get transaction count, later will used as nonce
      const nonce = await web3.eth.getTransactionCount(defaultAccount);
      const rawTransaction = {
          "gasPrice": web3.utils.toHex(2 * 1e9),
          "gasLimit": web3.utils.toHex(210000),
          "to": address,
          "value": web3.utils.toHex(wei),
          "nonce": web3.utils.toHex(nonce),
          "chainId": chain === 'rinkeby' ? 4 : 1
      }; 
      // create the transaction
      const transaction = new Tx.Transaction(rawTransaction, { chain });
      // sign it
      await transaction.sign(privateKey);
      // wait
      const result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
      return res.send(result);
    } catch (error) {
        console.error(error);
        res.send(`ERROR: ${error.message}`)
    }
  } else {
    res.send({
      'message':'Wallet address or no. of ether is missing.'
    })
  }

}

// get the balance of given address
async function getBalance(req, res) {
  const address = req.query.address
  if (address) {
    // get the Ether balance of the given address
    const ethBalance = convertWeiToEth( await web3.eth.getBalance(address)) || '0';

    // response data back to requestor
    return res.send({
      'ETH': ethBalance,
    })
  } 
}


module.exports = {
  send: sendEther,
  balance: getBalance
}