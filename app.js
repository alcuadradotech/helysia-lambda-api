const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Defining the port number. 
// It is important to set to process.env.PORT 
// since Lambda will define the PORT explicitly
const PORT = process.env.PORT || 8080;
const CHAIN = process.env.CHAIN || 'rinkeby';
if (CHAIN === 'mainnet') {
    console.log(`WARNING: running on ${CHAIN}`);
}
// check contract address
const contractAddress = process.env.CONTRACT;
if (!contractAddress) {
    console.error("ERROR: no contract address in env");
}
// check account
const defaultAccount = process.env.ACCOUNT;
if (!defaultAccount) {
    console.error("ERROR: no account in env");
}
// check private key
const privateKey = process.env.PRIVATEKEY;
if (!privateKey) {
    console.error("ERROR: no private key in env");
}

// Supporting every type of body content type
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Use below codes to automatically add your routing files (endpoints)
const routes = fs.readdirSync(path.join(__dirname, '/route'));
routes.forEach(routesFile => {
    if (routesFile.match(/\.js$/)) {
        const route = require(path.join(__dirname, '/route/', routesFile));
        route(app);
    }
})

// show the running port on console
app.listen(PORT, function() {
    console.log('server started on port', PORT, 'using', CHAIN)
})