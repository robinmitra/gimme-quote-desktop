const { Tray } = require('electron');

const menu = require('./menu/menu');
const quoteService = require('./common/quoteService');
const logger = require('./common/logger');

// Keep a global reference of the tray object, if you don't, it will be closed automatically when
// the JavaScript object is garbage collected.
let tray;

const createTray = async () => {
  try {
    tray = new Tray(`${__dirname}/../resources/icon/iconTemplate.png`);
    tray.setToolTip('Gimme Quote - get your daily dose of famous quotes');
    tray.setContextMenu(menu.getContextMenu());
  } catch (err) {
    logger.error(err);
  }
};

exports.startApp = async () => {
  await createTray();
  await quoteService.initialise();
  await menu.initialise();
};
