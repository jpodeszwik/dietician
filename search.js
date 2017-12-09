var elasticsearch = require('elasticsearch');
var productsSettings = require('./products');
var dietsSettings = require('./diets');

var client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH
});

client.indices.exists({ index: 'products' }).then(function (exists) {
  if (false === exists) {
    console.log('creating products index');
    client.indices.create({
      index: 'products',
      body: productsSettings
    });
  }
});

client.indices.exists({ index: 'diets' }).then(function (exists) {
  if (false === exists) {
    console.log('creating diets index');
    client.indices.create({
      index: 'diets',
      body: dietsSettings
    });
  }
});

function getDiet(id) {
  return client.getSource({
    index: 'diets',
    type: 'diet',
    id: id
  });
};

function createDiet(diet) {
  return client.index({
    index: 'diets',
    type: 'diet',
    body: diet
  }).then(function (res) {
    return res['_id'];
  });
};

function listIngredients() {
  return client.search({
    index: 'products',
    type: 'product',
    size: 1000,
    body: { query: { match_all: {} } }
  }).then(function (res) {
    hits = res['hits']['hits'];
    var ingredients = [];
    for (var i = 0; i < hits.length; i++) {
      ingredients.push(hits[i]['_source']);
    }
    return ingredients;
  });
}

function searchIngredients(phrase) {
  return client.search({
    index: 'products',
    type: 'product',
    body: { query: { match: { product_name: phrase } } },
  }).then(function (res) {
    hits = res['hits']['hits'];
    var ingredients = [];
    for (var i = 0; i < hits.length; i++) {
      ingredients.push(hits[i]['_source']);
    }
    return ingredients;
  });
}

module.exports = { getDiet, createDiet, listIngredients, searchIngredients };
