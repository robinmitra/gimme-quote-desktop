const { MenuItem } = require('electron');

const store = require('../store');
const actions = require('../actions');

exports.getMenu = () => new MenuItem({
  label: 'Launch on system startup',
  type: 'checkbox',
  click: () => store.dispatch(actions.toggleOpenAtLogin()),
  checked: store.getState().openAtLogin
});