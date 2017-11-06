const { Menu, Notification } = require('electron');
const _ = require('lodash');

const quoteService = require('../quoteService');
const logger = require('../logger');
const store = require('../store');

const enabled = require('./components/enabled');
const silent = require('./components/silent');
const interval = require('./components/interval');
const category = require('./components/category');
const quit = require('./components/quit');

let intervalId;
const clearSchedule = () => clearInterval(intervalId);

const showQuote = () => {
  const { quote, author, year } = quoteService.getRandom(store.getState().category);
  (new Notification({
    title: author,
    body: quote,
    subtitle: year,
    silent: store.getState().silent
  })).show();
};

const scheduleQuote = interval => {
  logger.info(`Scheduling to repeat every ${interval} minutes`);
  intervalId = setInterval(() => showQuote(), 1000 * 60 * interval);
};

const updateSchedule = () => {
  logger.info('Updating schedule');
  const state = store.getState();
  logger.info('Current state:', state);
  if (state.enabled && state.interval) {
    if (intervalId) clearInterval(intervalId);
    scheduleQuote(state.interval);
    showQuote();
  } else clearSchedule();
};

exports.initialise = () => {
  const state = store.getState();

  if (!state.interval) store.dispatch({ type: 'UPDATE_INTERVAL', interval: 1 });
  if (typeof state.silent !== 'boolean') store.dispatch({ type: 'TOGGLE_SILENT' });
  if (!state.category) store.dispatch({ type: 'UPDATE_CATEGORY', category: ['inspiration'] });
  // if (state.enabled) showQuote();

  store.subscribe(updateSchedule);
  updateSchedule();
};

exports.getContextMenu = () => {
  const menu = new Menu();
  menu.append(enabled.getMenu());
  menu.append(silent.getMenu());
  menu.append(interval.getMenu());
  menu.append(category.getMenu());
  menu.append(quit.getMenu());
  return menu;
};
