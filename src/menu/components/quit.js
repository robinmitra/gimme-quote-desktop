const { MenuItem } = require('electron');

exports.getMenu = () => new MenuItem({ label: 'Quit', role: 'quit' });