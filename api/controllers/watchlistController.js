const Watchlist = require('../models/watchlistModel');

exports.addToWatchlist = async (req, res) => {
  try {
    const { userId, coinId } = req.body;
    
    let watchlist = await Watchlist.findOne({ userId });
    
    if (!watchlist) {
      watchlist = await Watchlist.create({ userId, coins: [coinId] });
    } else {
      watchlist.coins.push(coinId);
      await watchlist.save();
    }

    res.status(200).json({
      status: 'success',
      data: watchlist
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message
    });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const { userId, coinId } = req.body;
    
    const watchlist = await Watchlist.findOne({ userId });
    
    if (!watchlist) {
      return res.status(404).json({
        status: 'fail',
        error: 'Watchlist not found'
      });
    }

    watchlist.coins = watchlist.coins.filter(id => id !== coinId);
    await watchlist.save();

    res.status(200).json({
      status: 'success',
      data: watchlist
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message
    });
  }
};
