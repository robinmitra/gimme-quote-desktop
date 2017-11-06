const store = require('../../store');

exports.getMenu = () => ([
  {
    label: 'Silent',
    type: 'checkbox',
    click: () => store.dispatch({ type: 'TOGGLE_SILENT' }),
    checked: store.getState().silent
  }
]);
