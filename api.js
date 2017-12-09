var express = require('express');
var bodyParser = require('body-parser');

var { getDiet, createDiet, listIngredients, searchIngredients } = require('./search.js')

var api = express();
api.use(bodyParser.json());

api.get('/diets/:id', function (req, res) {
  getDiet(req.params.id).then(function (source) {
    res.send(source);
  }, function (err) {
    res.status(500).send(err);
  });
});

api.post('/diets', function (req, res) {
  createDiet(req.body).then(function (id) {
    res.send({ id });
  }, function (err) {
    res.status(500).send(err);
  });
});

api.get('/ingredients', function (req, res) {
  listIngredients().then(function (ingredients) {
    res.send(ingredients);
  }, function (err) {
    res.status(500).send(err);
  });
});

api.post('/ingredients/_search', function (req, res) {
  searchIngredients(req.body.phrase).then(function (ingredients) {
    res.send(ingredients);
  }, function (err) {
    res.status(500).send(err);
  });
});

module.exports = api;
