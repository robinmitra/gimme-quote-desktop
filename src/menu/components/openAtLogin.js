const { MenuItem } = require('electron');

const store = require('../../store');

exports.getMenu = () => new MenuItem({
  label: 'Launch on system startup',
  type: 'checkbox',
  click: () => store.dispatch({ type: 'TOGGLE_OPEN_AT_LOGIN' }),
  checked: store.getState().openAtLogin
});