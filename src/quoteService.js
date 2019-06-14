const axios = require('axios');

const localQuotes = require('./localQuotes');
const logger = require('./logger');


/**
 * @type {[{quote, author, category}]}
 */
let quotes = [];
let remainingQuotes = [];
let reset = false;

exports.initialise = () => axios
  .get('https://gimme-quote.robinmitra.now.sh/api/quote')
  .then(res => {
    quotes = res.data
      .filter(({ quote }) => quote.length < 100)
      .map(({ quote, author, category, year }) => ({ quote, author, category, year }));
    logger.info(`Quotes retrieved: ${res.data.length}, filtered quotes: ${quotes.length}`);
  })
  .catch(err => {
    logger.error('Error has occurred while fetching quotes', err);
    quotes = [...localQuotes];
  });

exports.reset = () => reset = true;

exports.getRandom = categories => {
  logger.info(`Fetching random quotes for categories: ${categories}`);
  if (!remainingQuotes.length || reset) {
    remainingQuotes = !categories.includes('all')
      ? quotes.filter(quote => categories.find(currCategory => currCategory === quote.category))
      : [...quotes];
    reset = false;
  }
  logger.log('Remaining quotes', remainingQuotes);
  const randomIndex = Math.floor(Math.random() * (remainingQuotes.length - 1));
  const randomQuote = remainingQuotes[randomIndex];
  remainingQuotes.splice(randomIndex, 1);
  logger.info('Returning random quote', randomQuote);
  return randomQuote;
};