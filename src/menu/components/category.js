const _ = require('lodash');
const { MenuItem } = require('electron');

const quoteService = require('../../quoteService');
const logger = require('../../logger');
const store = require('../../store');

const isChecked = key => store.getState().category.includes(key);

const getSelectedCategories = () => menuItem.submenu.items.filter(item => item.checked).map(item => item.label.toLowerCase());

const selectAll = () => menuItem.submenu.items.forEach(item => item.checked = item.label.toLowerCase() === 'all');

const deselectAll = () => menuItem.submenu.items.find(item => item.label.toLowerCase() === 'all').checked = false;

const updateCategory = clickedMenuItem => {
  logger.log(`Clicked menu item ${clickedMenuItem.label}`);
  quoteService.reset();
  const selectedCategories = getSelectedCategories();
  if (!selectedCategories.length || clickedMenuItem.label.toLowerCase() === 'all') selectAll();
  else deselectAll();
  const updatedSelectedCategories = getSelectedCategories();
  logger.info(`Updated selected categories: ${updatedSelectedCategories}`);
  store.dispatch({ type: 'UPDATE_CATEGORY', category: updatedSelectedCategories });
};

const menuItem = new MenuItem({
  label: 'Category',
  submenu: [
    {
      id: 'inspiration',
      label: 'Inspiration',
      type: 'checkbox',
      click: updateCategory,
      checked: isChecked('inspiration')
    },
    {
      id: 'movies',
      label: 'Movies',
      type: 'checkbox',
      click: updateCategory,
      checked: isChecked('movies')
    },
    {
      id: 'programming',
      label: 'Programming',
      type: 'checkbox',
      click: updateCategory,
      checked: isChecked('programming')
    },
    { id: 'all', label: 'All', type: 'checkbox', click: updateCategory, checked: isChecked('all') },
  ],
});

exports.getMenu = () => menuItem;
