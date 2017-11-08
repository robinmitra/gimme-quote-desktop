const redux = require('redux');

const logger = require('./logger');
const settings = require('./settings');

const enabled = (state, action) => {
  if (!settings.has('enabled')) settings.set('enabled', true);
  let enabled = settings.get('enabled');
  if (action.type === 'TOGGLE_ENABLED') {
    enabled = !enabled;
    settings.set('enabled', enabled);
  }
  return enabled;
};

const silent = (state, action) => {
  if (!settings.has('silent')) settings.set('silent', false);
  let silent = settings.get('silent');
  if (action.type === 'TOGGLE_SILENT') {
    logger.info('Toggling silent -', 'current state:', state, 'action:', action);
    silent = !silent;
    settings.set('silent', silent);
  }
  return silent;
};

const openAtLogin = (state, action) => {
  if (!settings.has('openAtLogin')) settings.set('openAtLogin', false);
  let openAtLogin = settings.get('openAtLogin');
  if (action.type === 'TOGGLE_OPEN_AT_LOGIN') {
    logger.info('Toggling open at login -', 'current state:', state, 'action:', action);
    openAtLogin = !openAtLogin;
    settings.set('openAtLogin', openAtLogin);
  }
  return openAtLogin;
};

const interval = (state, action) => {
  if (!settings.has('interval')) settings.set('interval', 10);
  let interval = settings.get('interval');
  if (action.type === 'UPDATE_INTERVAL') {
    logger.info('Updating interval -', 'current state:', state, 'action:', action);
    interval = action.interval;
    settings.set('interval', interval);
  }
  return interval;
};

const category = (state, action) => {
  if (!settings.has('category')) settings.set('category', ['inspiration']);
  let category = settings.get('category');
  if (action.type === 'UPDATE_CATEGORY') {
    logger.info('Updating category -', 'current state:', state, 'action:', action);
    category = action.category;
    settings.set('category', category);
  }
  return category;
};

module.exports = redux.combineReducers({ enabled, silent, openAtLogin, interval, category });