const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  coins: {
    type: [String],
    default: []
  }
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;
