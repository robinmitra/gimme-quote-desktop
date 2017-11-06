const { MenuItem } = require('electron');

const store = require('../../store');

exports.getMenu = () => new MenuItem({
  label: 'Silent',
  type: 'checkbox',
  click: () => store.dispatch({ type: 'TOGGLE_SILENT' }),
  checked: store.getState().silent
});
