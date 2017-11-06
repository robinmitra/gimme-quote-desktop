const redux = require('redux');

const logger = require('./logger');
const settings = require('./settings');

const enabled = (state, action) => {
  let enabled = settings.get('enabled');
  if (action.type === 'TOGGLE_ENABLED') {
    enabled = !enabled;
    settings.set('enabled', enabled);
  }
  return enabled;
};

const silent = (state, action) => {
  let silent = settings.get('silent');
  if (action.type === 'TOGGLE_SILENT') {
    logger.info('Toggling silent -', 'current state:', state, 'action:', action);
    silent = !silent;
    settings.set('silent', silent);
  }
  return silent;
};

const interval = (state, action) => {
  let interval = settings.get('interval');
  if (action.type === 'UPDATE_INTERVAL') {
    logger.info('Updating interval -', 'current state:', state, 'action:', action);
    interval = action.interval;
    settings.set('interval', interval);
  }
  return interval;
};

const category = (state, action) => {
  let category = settings.get('category');
  if (action.type === 'UPDATE_CATEGORY') {
    logger.info('Updating category -', 'current state:', state, 'action:', action);
    category = action.category;
    settings.set('category', category);
  }
  return category;
};

const reducer = redux.combineReducers({ enabled, silent, interval, category });

module.exports = redux.createStore(reducer);
