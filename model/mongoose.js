const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.MONGO}/dietician`);

module.exports = mongoose;