const { MenuItem } = require('electron');

const store = require('../store');
const actions = require('../actions');

exports.getMenu = () => new MenuItem({
  label: 'Enabled',
  type: 'checkbox',
  click: () => store.dispatch(actions.toggleEnabled()),
  checked: store.getState().enabled
});
