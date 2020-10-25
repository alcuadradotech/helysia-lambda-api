## ETH/ERC20 AWS Lambda API

Get balances and send Ether and ERC20 tokens using AWS lambda functions.

## Develop

```sh
CHAIN=<rinkeby|mainnet> CONTRACT=<token_contract_address> ACCOUNT=<funded_account> PRIVATEKEY=<private_key> npm run dev

curl "http://127.0.0.1:8080/token/balance?address=0x..."
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
        "CONTRACT": "0x...",
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

