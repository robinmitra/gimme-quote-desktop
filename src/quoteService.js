const axios = require('axios');

const localQuotes = [
  {
    "author": "Paula Scher",
    "quote": "Less is more and more is more. It’s the middle that’s not a good place.",
  },
  {
    "author": "Howard Aiken",
    "quote": "Don’t worry about people stealing an idea. If it’s original, you will have to ram it down their throats.",
  },
  {
    "author": "Jack Kerouac",
    "quote": "Great things are not accomplished by those who yield to trends and fads and popular opinion.",
  },
  {
    "author": "Frank Chimero",
    "quote": "To make pearls, you've got to eat dirt.",
  },
  {
    "author": "Cassie McDaniel",
    "quote": "Designers must be stewards of design rather than dictators.",
  },
  {
    "author": "Cassie McDaniel",
    "quote": "Designers must be stewards of design rather than dictators.",
  },
  {
    "author": "Cassie McDaniel",
    "quote": "Designers must be stewards of design rather than dictators.",
  },
  {
    "author": "Cassie McDaniel",
    "quote": "Designers must be stewards of design rather than dictators.",
  },
  {
    "author": "Cassie McDaniel",
    "quote": "Designers must be stewards of design rather than dictators.",
  },
  {
    "author": "Cassie McDaniel",
    "quote": "Designers must be stewards of design rather than dictators.",
  },
  {
    "author": "Cassie McDaniel",
    "quote": "Designers must be stewards of design rather than dictators.",
  },
  {
    "author": "Cassie McDaniel",
    "quote": "Designers must be stewards of design rather than dictators.",
  },
  {
    "author": "Cassie McDaniel",
    "quote": "Designers must be stewards of design rather than dictators.",
  },
  {
    "author": "Cassie McDaniel",
    "quote": "Designers must be stewards of design rather than dictators.",
  },
  {
    "author": "Cassie McDaniel",
    "quote": "Designers must be stewards of design rather than dictators.",
  },
];

let quotes = [];

exports.initialise = () => axios
  .get('https://talaikis.com/api/quotes/')
  .then(res => {
    quotes = res.data
      .filter(({ quote }) => quote.length < 100)
      .map(({ quote, author }) => ({ quote, author }));
    console.log(`Quotes retrieved: ${res.data.length}, filtered quotes: ${quotes.length}`);
  })
  .catch(err => {
    quotes = [...localQuotes];
  });

exports.getRandom = () => quotes[Math.floor(Math.random() * (quotes.length - 1))];
// exports.getRandom = () => axios
//   .get('https://talaikis.com/api/quotes/random/')
//   .then(res => ({
//     author: res.data.author,
//     quote: res.data.quote,
//   }));
