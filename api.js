const express = require('express');
const bodyParser = require('body-parser');
const { listIngredients, searchIngredients, addIngredient } = require('./model/ingredient');
const { getDiet, addDiet } = require('./model/diet');


const api = express();
api.use(bodyParser.json());

api.get('/diets/:id', (req, res) => {
  getDiet(req.params.id).then((source) => {
    res.send(source);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

api.post('/diets', (req, res) => {
  addDiet(req.body).then((diet) => {
    res.send({ id: diet._id }); // eslint-disable-line no-underscore-dangle
  }).catch((err) => {
    res.status(500).send(err);
  });
});

api.get('/ingredients', (req, res) => {
  listIngredients().then((ingredients) => {
    res.send(ingredients);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

api.post('/ingredients/_search', (req, res) => {
  searchIngredients(req.body.phrase).then((ingredients) => {
    res.send(ingredients);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

api.post('/ingredients', (req, res) => {
  addIngredient(req.body).then((ingredient) => {
    res.send(ingredient);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

module.exports = api;
