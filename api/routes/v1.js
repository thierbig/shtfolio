const dbo = require("../db/conn");
var express = require("express");
const mongodb = require("mongodb");

//Will need to add other middlewares soon enough
const { getSessionUser } = require("./middlewares/session");
const eventController = require('../controllers/eventController');
const cryptoController = require("../controllers/cryptoController");
const authController = require("../controllers/authController");
const coingeckoController = require("../controllers/coingeckoController");
const watchlistController = require("../controllers/watchlistController");
const chatController = require("../controllers/chatController");
const authMiddleware = require('./middlewares/authMiddleware')

const router = express.Router();

//Get coins data
coingeckoController.doTrendingUniswapV3Ethereum();
setInterval(coingeckoController.doTrendingUniswapV3Ethereum, 3600000);


// Helper function to check if a string is a valid date
function isValidDate(dateString) {
  const dateObject = new Date(dateString);
  return !isNaN(dateObject);
}


//TODO: rename endpoints
router.post('/event/create', eventController.createEvent);

router.get('/events', eventController.getEvents);

router.get("/watchlist/:uid", cryptoController.getWatchlistByUid);
router.get("/coins", cryptoController.getCoins);
router.post("/auth/google-signin", authController.googleSignIn);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.login);
router.get('/auth/check-auth', authMiddleware,authController.checkAuth);
router.post("/auth/register", authController.register);
router.post('/watchlist/add', watchlistController.addToWatchlist);
router.post('/watchlist/remove', watchlistController.removeFromWatchlist);
router.get('/coingecko/coins', coingeckoController.getCoinList);
router.get('/coingecko/coins/:id', coingeckoController.getSingleCoin);
router.get('/coingecko/historical', coingeckoController.getHistoricalChart);
router.get('/coingecko/trending', coingeckoController.getTrendingCoins);
router.get('/coingecko/trending_eth', coingeckoController.getTrendingCoinsEthereum);
router.get('/coingecko/uniswap_trending_eth', coingeckoController.getLatestCoins);
router.get('/coingecko/top_50_shitcoin', coingeckoController.getTop50Shitcoins);

router.post('/chat/new_message', chatController.postNewMessage);
router.get('/chat/get_messages', chatController.getMessages);


module.exports = router;
