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

module.exports = {getDiet, createDiet};
