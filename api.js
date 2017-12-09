const express = require('express');
const bodyParser = require('body-parser');

const {
  getDiet, createDiet, listIngredients, searchIngredients,
} = require('./search.js');

const api = express();
api.use(bodyParser.json());

api.get('/diets/:id', (req, res) => {
  getDiet(req.params.id).then((source) => {
    res.send(source);
  }, (err) => {
    res.status(500).send(err);
  });
});

api.post('/diets', (req, res) => {
  createDiet(req.body).then((id) => {
    res.send({ id });
  }, (err) => {
    res.status(500).send(err);
  });
});

api.get('/ingredients', (req, res) => {
  listIngredients().then((ingredients) => {
    res.send(ingredients);
  }, (err) => {
    res.status(500).send(err);
  });
});

api.post('/ingredients/_search', (req, res) => {
  searchIngredients(req.body.phrase).then((ingredients) => {
    res.send(ingredients);
  }, (err) => {
    res.status(500).send(err);
  });
});

module.exports = api;
