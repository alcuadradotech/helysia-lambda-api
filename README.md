# helysia-lambda-api

```sh
CONTRACT=0xa9ecdac4ab883a20477d41ceec71231e2a8f9038 ACCOUNT=0x29532a9898cFBEF5DFa9F8f1D98a714D2d550b65 PRIVATEKEY=<private_key> npm run dev

curl "http://127.0.0.1:8080/token/balance?address=0xcfB35Ae84f6216EcdC75c5f56C6c4C4c9CA8D761"
curl "http://127.0.0.1:8080/ether/balance?address=0xcfB35Ae84f6216EcdC75c5f56C6c4C4c9CA8D761"
curl -d "address=0xcfB35Ae84f6216EcdC75c5f56C6c4C4c9CA8D761&tokens=1" "http://127.0.0.1:8080/token/send"
curl -d "address=0xcfB35Ae84f6216EcdC75c5f56C6c4C4c9CA8D761&ether=1" "http://127.0.0.1:8080/ether/send"
```