const { app, Tray } = require('electron');

const menu = require('./src/menu/menu');
const quoteService = require('./src/quoteService');
const logger = require('./src/logger');

// Keep a global reference of the tray object, if you don't, it will be closed automatically when
// the JavaScript object is garbage collected.
let tray;

const initialise = () => quoteService.initialise().then(menu.initialise);

const createTray = () => {
  return initialise()
    .then(() => {
      tray = new Tray(`${__dirname}/resources/icon/iconTemplate.png`);
      tray.setToolTip('Gimme Quote - get your daily dose of famous quotes');
      tray.setContextMenu(menu.getContextMenu());
    })
    .catch((err) => {
      logger.error(err);
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createTray);