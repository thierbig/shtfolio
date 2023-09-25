const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  // Accept any type of data
  data: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now // Automatically set to the current date and time
  }
});

module.exports = mongoose.model('Coin', coinSchema);