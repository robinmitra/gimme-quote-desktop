const electron = require('electron');
const { app, Menu, Notification } = require('electron');
const _ = require('lodash');

const quoteService = require('../common/quoteService');
const logger = require('../common/logger');
const store = require('./store');

const enabled = require('./components/enabled');
const silent = require('./components/silent');
const interval = require('./components/interval');
const category = require('./components/category');
const openAtLogin = require('./components/openAtLogin');
const quit = require('./components/quit');

let intervalId;
const clearSchedule = () => {
  logger.info('Clearing schedule');
  clearInterval(intervalId);
};

const showQuote = () => {
  const { quote, author, year } = quoteService.getRandom(store.getState().category);
  if (!quote) return;
  (new Notification({
    title: author,
    body: quote,
    subtitle: year,
    silent: store.getState().silent,
  })).show();
};

const scheduleQuote = interval => {
  logger.info(`Scheduling to repeat every ${interval} minutes`);
  intervalId = setInterval(() => showQuote(), 1000 * 60 * interval);
};

const updateSchedule = () => {
  logger.info('Updating schedule');
  const state = store.getState();
  logger.log('Current state:', state);
  if (state.enabled && state.interval) {
    if (intervalId) clearInterval(intervalId);
    scheduleQuote(state.interval);
    showQuote();
  } else clearSchedule();
};

const updateLoginItemSettings = () => {
  app.setLoginItemSettings({ openAtLogin: store.getState().openAtLogin });
};

const setupListeners = () => {
  store.subscribe(updateSchedule);
  store.subscribe(updateLoginItemSettings);
  electron.powerMonitor.on('lock-screen', clearSchedule);
  electron.powerMonitor.on('unlock-screen', updateSchedule);
};

exports.initialise = () => {
  setupListeners();
  updateSchedule();
};

exports.getContextMenu = () => {
  const menu = new Menu();
  menu.append(enabled.getMenu());
  menu.append(silent.getMenu());
  menu.append(interval.getMenu());
  menu.append(category.getMenu());
  menu.append(openAtLogin.getMenu());
  menu.append(quit.getMenu());
  return menu;
};
