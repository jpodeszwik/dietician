const mongoose = require('./mongoose');

const Ingredient = mongoose.model('Ingredient', {
  name: String,
  carbohydrates: Number,
  cellulose: Number,
  fats: Number,
  nutritiveValue: Number,
  proteins: Number,
});

const listIngredients = () => Ingredient.find({});

const searchIngredients = phrase => Ingredient.find({ name: new RegExp(`.*${phrase}.*`, 'i') });

const addIngredient = ingredient => new Ingredient(ingredient).save();

module.exports = { listIngredients, searchIngredients, addIngredient };
