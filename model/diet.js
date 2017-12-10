const mongoose = require('./mongoose');

const Diet = mongoose.model('Diet', {
  days: mongoose.Schema.Types.Mixed,
  caloricIntake: mongoose.Schema.Types.Mixed,
});

const getDiet = id => Diet.findOne({ _id: id });

const addDiet = diet => new Diet(diet).save();

module.exports = { getDiet, addDiet };
