const token = require('../lib/token');

function init(app) {
    const path = '/token';

    app.post(path + '/send', token.send);
    app.get(path + '/balance', token.balance);
    app.get(path + '/price', token.price);
}

module.exports = init;