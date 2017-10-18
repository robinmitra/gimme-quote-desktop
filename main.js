const { app, Menu, Notification, Tray } = require('electron');
const url = require('url');
const Store = require('electron-store');

const quoteService = require('./src/quoteService');

const store = new Store();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray;
let intervalId;

const showQuote = () => {
  const { quote, author } = quoteService.getRandom();
  (new Notification({ title: author, body: quote, silent: store.get('silent') })).show();
};

const getInterval = () => Number(store.get('interval'));
const isEnabled = () => store.get('enabled');
const isSilent = () => store.get('silent');

const scheduleQuote = interval => {
  console.log(`Interval in ${interval} minutes`);
  intervalId = setInterval(() => showQuote(), 1000 * 60 * interval);
};

const updateSchedule = () => {
  if (isEnabled() && getInterval()) {
    if (intervalId) clearInterval(intervalId);
    scheduleQuote(getInterval());
  } else clearSchedule();
};

const clearSchedule = () => clearInterval(intervalId);

const initialise = () => quoteService
  .initialise()
  .then(() => {
    if (!getInterval()) store.set('interval', 1);
    if (!store.has('silent')) store.set('silent', true);
    if (isEnabled()) showQuote();
    updateSchedule();
  });

const toggleEnabled = menuItem => {
  store.set('enabled', menuItem.checked);
  updateSchedule();
};

const toggleSilent = menuItem => {
  store.set('silent', menuItem.checked);
  updateSchedule();
};

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

const updateInterval = menuItem => {
  store.set('interval', getIntervalByMenuId(menuItem.id));
  updateSchedule();
};

const isChecked = index => {
  const interval = getInterval();
  const intervalByMenuId = getIntervalByMenuId(index);
  return interval === intervalByMenuId;
};

const createTray = () => {
  return initialise()
    .then(() => {
      tray = new Tray(`${__dirname}/icon.png`);
      const contextMenu = Menu.buildFromTemplate([
        { label: 'Enabled', type: 'checkbox', click: toggleEnabled, checked: isEnabled() },
        {
          label: 'Interval',
          submenu: [
            { id: 1, label: '1 min', type: 'radio', click: updateInterval, checked: isChecked(1) },
            { id: 2, label: '5 min', type: 'radio', click: updateInterval, checked: isChecked(2) },
            { id: 3, label: '10 min', type: 'radio', click: updateInterval, checked: isChecked(3) },
          ],
        },
        { label: 'Silent', type: 'checkbox', click: toggleSilent, checked: isSilent() },
        { label: 'Quit', role: 'quit' },
      ]);
      tray.setToolTip('Quote Factory - Your daily dose of inspiration quotes');
      tray.setContextMenu(contextMenu);
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
