const { app, Tray } = require('electron');

const menu = require('./src/menu/menu');
const quoteService = require('./src/quoteService');
const logger = require('./src/logger');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray;

const initialise = () => quoteService.initialise().then(menu.initialise);

const createTray = () => {
  return initialise()
    .then(() => {
      tray = new Tray(`${__dirname}/icon.png`);
      tray.setToolTip('Quote Factory - Your daily dose of inspiration quotes');
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

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createTray();
  }
});
