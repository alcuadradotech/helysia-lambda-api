
##  ETH/ERC20 AWS Lambda API

Get balances and send Ether and ERC20 tokens using AWS lambda functions.

## Develop

Start the app
```sh
INFURA=<infura_key> CHAIN=<rinkeby|mainnet> CONTRACT=<token_contract_address> DAI=<dai_contract_address> MARKET=<market_contract_address> AGENT=<agent_contract_address> ACCOUNT=<funded_account> PRIVATEKEY=<private_key> npm start
```

Test using curl

**GET balances**
```sh
curl "http://127.0.0.1:8080/token/balance?address=0x..."
{"ETH":"4.3612494807","3LY":"15288.76281131092142627"}
```

**GET token price**
```sh
curl "http://127.0.0.1:8080/token/price"
{"EUR":1.1274,"USD":1.3221}
```

**GET transaction receipt**
```sh
curl "http://127.0.0.1:8080/ether/tx?tx=0x..."
{
  "tx": {"blockHash":"0x72ca0cca04a8b2b3d0101efd444a21de0dbacfaa11754a35993f57c98925709a",
    ...},
  "value": "10000"
}
```

**Send ETH and Tokens using POST**
```sh
curl -d "address=0x...&tokens=1" "http://127.0.0.1:8080/token/send"
curl -d "address=0x...&ether=0.01" "http://127.0.0.1:8080/ether/send"
```

## Deployment

Setup an `.aws` home dir with a `credentials` file (name the app as configured in AWS):

~/.aws/credentials
```
[myapp]
aws_access_key_id = QWERTYUIOPASDFGHJKLA
aws_secret_access_key = 1234567890qwertyuiop097hygve
```

Setup an AWS config file:

~/.aws/config
```
[default]
region=eu-west-1
output=json
```

Setup an `up.json` file. You can use the `up.example.json` file.

```json
{
    "name":"myapp",
    "profile":"myapp",
    "regions":["eu-west-1"],
    "lambda": {
      "memory": 512,
      "timeout": 0,
      "role": "arn:aws:iam::123456789012:role/myapp-role",
      "runtime": "nodejs12.x"
    },
    "environment": {
        "INFURA": "01234...",
        "CONTRACT": "0x...",
        "DAI": "0x...",
        "MARKET": "0x...",
        "AGENT": "0X...",
        "ACCOUNT": "0x...",
        "PRIVATEKEY": "abc...",
        "CHAIN": "mainnet"
    }
}
```

Checkout setting up enviroment variuables: https://apex.sh/docs/up/configuration/#environment_variables

Install up (in current project), deploy and show logs:

```sh
# install up
curl -sf https://up.apex.sh/install | BINDIR=. sh
# stage deployment
AWS_PROFILE=<myapp> up
# production deployment
AWS_PROFILE=<myapp> up deploy production
# show logs
up logs -f
```

## References

https://medium.com/coinmonks/deploying-ethereum-dapp-rest-api-on-aws-lambda-using-node-js-web3-beta-and-infura-513cc92a9de5

