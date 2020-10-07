const token = require('../lib/token')

function init(app) {
    const path = '/token'

    app.post(path + '/send', token.send)
    app.get(path + '/balance', token.balance)
}

module.exports = init;