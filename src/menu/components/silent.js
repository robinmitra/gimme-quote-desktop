const { MenuItem } = require('electron');

const store = require('../../store');
const actions = require('../../actions');

exports.getMenu = () => new MenuItem({
  label: 'Silent',
  type: 'checkbox',
  click: () => store.dispatch(actions.toggleSilent()),
  checked: store.getState().silent
});
