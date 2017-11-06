const { app, Menu, Notification, Tray } = require('electron');
const _ = require('lodash');
const url = require('url');
const Store = require('electron-store');

const quoteService = require('./src/quoteService');
const logger = require('./src/logger');

const store = new Store();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray;
let intervalId;

const getInterval = () => Number(store.get('interval'));
const getCategory = () => store.get('category');
const isEnabled = () => store.get('enabled');
const isSilent = () => store.get('silent');

const showQuote = () => {
  const { quote, author, year } = quoteService.getRandom(getCategory());
  (new Notification({ title: author, body: quote, subtitle: year, silent: isSilent() })).show();
};

const scheduleQuote = interval => {
  logger.info(`Scheduling to repeat every ${interval} minutes`);
  intervalId = setInterval(() => showQuote(), 1000 * 60 * interval);
};

const updateSchedule = () => {
  logger.info('Updating schedule');
  if (isEnabled() && getInterval()) {
    if (intervalId) clearInterval(intervalId);
    scheduleQuote(getInterval());
    showQuote();
  } else clearSchedule();
};

const clearSchedule = () => clearInterval(intervalId);

const initialise = () => quoteService
  .initialise()
  .then(() => {
    if (!getInterval()) store.set('interval', 1);
    if (!store.has('silent')) store.set('silent', true);
    if (!store.has('category')) {
      store.set('category', ['inspiration']);
    }
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

const getCategoryByMenuId = (categoryKey) => {
  switch (categoryKey) {
    case 1:
      return 'inspiration';
    case 2:
      return 'movie';
    case 3:
      return 'programming';
    case 4:
      return 'all';
    // default:
    //   return 'all';
  }
};

const updateInterval = menuItem => {
  store.set('interval', getIntervalByMenuId(menuItem.id));
  updateSchedule();
};

const updateCategory = menuItem => {
  logger.info(`Clicked category with key ${menuItem.id}`);
  quoteService.reset();
  const clickedCategory = getCategoryByMenuId(menuItem.id);
  const existingActiveCategories = getCategory();
  let updatedActiveCategories;
  if (clickedCategory === 'all') {
    updatedActiveCategories = [clickedCategory];
  } else {
    if (!menuItem.checked) {
      // Filter out de-activated category.
      updatedActiveCategories = existingActiveCategories.filter(category => category !== clickedCategory);
    } else {
      // Activate selected category.
      updatedActiveCategories = [...existingActiveCategories, clickedCategory];
    }
    updatedActiveCategories = _.uniq(updatedActiveCategories);
  }
  store.set('category', updatedActiveCategories);
  logger.log('Updated categories', updatedActiveCategories);
  updateSchedule();
};

const isChecked = index => {
  const interval = getInterval();
  const intervalByMenuId = getIntervalByMenuId(index);
  return interval === intervalByMenuId;
};

const isCategoryChecked = index => {
  const activeCategories = getCategory();
  const categoryByMenuId = getCategoryByMenuId(index);
  return activeCategories.includes(categoryByMenuId);
};

const createTray = () => {
  return initialise()
    .then(() => {
      tray = new Tray(`${__dirname}/icon.png`);
      const contextMenu = Menu.buildFromTemplate([
        { label: 'Enabled', type: 'checkbox', click: toggleEnabled, checked: isEnabled() },
        { label: 'Silent', type: 'checkbox', click: toggleSilent, checked: isSilent() },
        {
          label: 'Interval',
          submenu: [
            { id: 1, label: '1 min', type: 'radio', click: updateInterval, checked: isChecked(1) },
            { id: 2, label: '5 min', type: 'radio', click: updateInterval, checked: isChecked(2) },
            { id: 3, label: '10 min', type: 'radio', click: updateInterval, checked: isChecked(3) },
          ],
        },
        {
          label: 'Category',
          submenu: [
            {
              id: 1,
              label: 'Inspiration',
              type: 'checkbox',
              click: updateCategory,
              checked: isCategoryChecked(1)
            },
            {
              id: 2,
              label: 'Movies',
              type: 'checkbox',
              click: updateCategory,
              checked: isCategoryChecked(2)
            },
            {
              id: 3,
              label: 'Programming',
              type: 'checkbox',
              click: updateCategory,
              checked: isCategoryChecked(3)
            },
            {
              id: 4,
              label: 'All',
              type: 'checkbox',
              click: updateCategory,
              checked: isCategoryChecked(4)
            },
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
