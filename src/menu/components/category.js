const _ = require('lodash');
const quoteService = require('../../quoteService');
const logger = require('../../logger');
const store = require('../../store');

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

const isChecked = index => store.getState().category.includes(getCategoryByMenuId(index));

const updateCategory = menuItem => {
  logger.info(`Clicked category with key ${menuItem.id}`);
  quoteService.reset();
  const clickedCategory = getCategoryByMenuId(menuItem.id);
  const existingActiveCategories = store.getState().category;
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
  store.dispatch({ type: 'UPDATE_CATEGORY', category: updatedActiveCategories });
};

exports.getMenu = () => ([
  {
    label: 'Category',
    submenu: [
      { id: 1, label: 'Inspiration', type: 'checkbox', click: updateCategory, checked: isChecked(1) },
      { id: 2, label: 'Movies', type: 'checkbox', click: updateCategory, checked: isChecked(2) },
      { id: 3, label: 'Programming', type: 'checkbox', click: updateCategory, checked: isChecked(3) },
      { id: 4, label: 'All', type: 'checkbox', click: updateCategory, checked: isChecked(4) },
    ],
  }
]);
