const { MenuItem } = require('electron');

const store = require('../../store');

exports.getMenu = () => new MenuItem({
  label: 'Enabled',
  type: 'checkbox',
  click: () => store.dispatch({ type: 'TOGGLE_ENABLED' }),
  checked: store.getState().enabled
});
