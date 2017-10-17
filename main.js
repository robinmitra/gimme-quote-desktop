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
  (new Notification({ title: author, body: quote })).show();
};

const getInterval = () => Number(store.get('interval'));
const isEnabled = () => store.get('enabled');

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
    if (isEnabled()) showQuote();
    updateSchedule();
  });

const toggleEnabled = menuItem => {
  store.set('enabled', menuItem.checked);
  updateSchedule();
};

const updateInterval = menuItem => {
  let interval;
  switch (menuItem.id) {
    case 1:
      interval = 1;
      break;
    case 2:
      interval = 5;
      break;
    case 3:
      interval = 10;
      break;
    default:
      interval = 1;
      break;
  }
  store.set('interval', interval);
  updateSchedule();
};

const isChecked = index => {
  const interval = getInterval();
  switch (true) {
    case (index === 1 && interval === 1):
      return true;
    case (index === 2 && interval === 5):
      return true;
    case (index === 3 && interval === 10):
      return true;
    default:
      return false;
  }
};

const createTray = () => {
  return initialise()
    .then(() => {
      tray = new Tray('./icon.png');
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
