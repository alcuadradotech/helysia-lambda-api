const ether = require('../lib/ether')

function init(app) {
    const path = '/ether'

    app.post(path + '/send', ether.send)
    app.get(path + '/balance', ether.balance)
    app.get(path + '/tx', ether.tx); 
}

module.exports = init;