var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH
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
  }).then(function(res) {
    return res['_id'];
  });
};

function listIngredients() {
  return client.search({
    index: 'products',
    type: 'product',
    size: 1000,
    query: { match_all: {} }
  }).then(function(res) {
    hits = res['hits']['hits'];
    var ingredients = [];
    for (var i = 0; i < hits.length; i++) {
      ingredients.push(hits[i]['_source']);
    }
    return ingredients;
  });
}

module.exports = {getDiet, createDiet, listIngredients};
