const elasticsearch = require('elasticsearch');
const productsSettings = require('./products');
const dietsSettings = require('./diets');

const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH,
});

client.indices.exists({ index: 'products' }).then((exists) => {
  if (exists === false) {
    console.log('creating products index'); // eslint-disable-line no-console
    client.indices.create({
      index: 'products',
      body: productsSettings,
    });
  }
});

client.indices.exists({ index: 'diets' }).then((exists) => {
  if (exists === false) {
    console.log('creating diets index'); // eslint-disable-line no-console
    client.indices.create({
      index: 'diets',
      body: dietsSettings,
    });
  }
});

function getDiet(id) {
  return client.getSource({
    index: 'diets',
    type: 'diet',
    id,
  });
}

function createDiet(diet) {
  return client.index({
    index: 'diets',
    type: 'diet',
    body: diet,
  }).then(res => res._id); // eslint-disable-line no-underscore-dangle
}

function listIngredients() {
  return client.search({
    index: 'products',
    type: 'product',
    size: 1000,
    body: { query: { match_all: {} } },
  }).then((res) => {
    const hits = res.hits.hits; // eslint-disable-line prefer-destructuring
    const ingredients = [];
    for (let i = 0; i < hits.length; i += 1) {
      ingredients.push(hits[i]._source); // eslint-disable-line no-underscore-dangle
    }
    return ingredients;
  });
}

function searchIngredients(phrase) {
  return client.search({
    index: 'products',
    type: 'product',
    body: { query: { match: { product_name: phrase } } },
  }).then((res) => {
    const hits = res.hits.hits; // eslint-disable-line prefer-destructuring
    const ingredients = [];
    for (let i = 0; i < hits.length; i += 1) {
      ingredients.push(hits[i]._source); // eslint-disable-line no-underscore-dangle
    }
    return ingredients;
  });
}

module.exports = {
  getDiet, createDiet, listIngredients, searchIngredients,
};
