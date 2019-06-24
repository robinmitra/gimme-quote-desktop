const Store = require('electron-store');

const store = new Store();

exports.set = (key, value) => store.set(key, value);

exports.get = key => store.get(key);

exports.has = key => store.has(key);