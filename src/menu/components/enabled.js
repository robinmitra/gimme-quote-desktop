const store = require('../../store');

exports.getMenu = () => ([
  {
    label: 'Enabled',
    type: 'checkbox',
    click: () => store.dispatch({ type: 'TOGGLE_ENABLED' }),
    checked: store.getState().enabled
  }
]);
