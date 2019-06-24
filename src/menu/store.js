const redux = require('redux');

const reducer = require('./reducer');

module.exports = redux.createStore(reducer);
