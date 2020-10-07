## helysia-lambda-api

```sh
AWS_PROFILE=myaccount CONTRACT=<token_contract_address> ACCOUNT=<funded_account> PRIVATEKEY=<private_key> npm run dev

curl "http://127.0.0.1:8080/token/balance?address=0xcfB35Ae84f6216EcdC75c5f56C6c4C4c9CA8D761"
curl "http://127.0.0.1:8080/ether/balance?address=0xcfB35Ae84f6216EcdC75c5f56C6c4C4c9CA8D761"
curl -d "address=0xcfB35Ae84f6216EcdC75c5f56C6c4C4c9CA8D761&tokens=1" "http://127.0.0.1:8080/token/send"
curl -d "address=0xcfB35Ae84f6216EcdC75c5f56C6c4C4c9CA8D761&ether=1" "http://127.0.0.1:8080/ether/send"
```

## deployment

~/.aws/credentials
```
[myapp]
aws_access_key_id = QWERTYUIOPASDFGHJKLA
aws_secret_access_key = 1234567890qwertyuiop097hygve
```

~/.aws/config
```
[default]
region=eu-west-1
output=json
```

´´´sh
# install up
curl -sf https://up.apex.sh/install | BINDIR=. sh
# deploy
AWS_PROFILE=<myapp> up
# show logs
up logs -f
```