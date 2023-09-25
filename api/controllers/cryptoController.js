const Watchlist = require("../models/watchlistModel");

exports.getWatchlistByUid = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ uid: req.params.uid });
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.getCoins = (req, res) => {
  const { currency } = req.query;
  // Fetch coins based on currency
  // For now, sending a dummy response
  res.json([{ id: 1, name: "Bitcoin", currency }]);
};