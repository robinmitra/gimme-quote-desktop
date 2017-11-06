const store = require('../../store');

const getIntervalByMenuId = (intervalKey) => {
  switch (intervalKey) {
    case 1:
      return 1;
    case 2:
      return 5;
    case 3:
      return 10;
    default:
      return 1;
  }
};

const updateInterval = menuItem => store.dispatch({
  type: 'UPDATE_INTERVAL',
  interval: getIntervalByMenuId(menuItem.id),
});

const isChecked = index => store.getState().interval === getIntervalByMenuId(index);

exports.getMenu = () => ([
  {
    label: 'Interval',
    submenu: [
      { id: 1, label: '1 min', type: 'radio', click: updateInterval, checked: isChecked(1) },
      { id: 2, label: '5 min', type: 'radio', click: updateInterval, checked: isChecked(2) },
      { id: 3, label: '10 min', type: 'radio', click: updateInterval, checked: isChecked(3) },
    ],
  }
]);
