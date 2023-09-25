const axios = require("axios");
const Coin = require("../models/coinModel");

exports.getCoinList = async (req, res) => {
  try {
    const { currency } = req.query;
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSingleCoin = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getHistoricalChart = async (req, res) => {
  try {
    const { id, days, currency } = req.query;
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTrendingCoins = async (req, res) => {
  try {
    const { currency } = req.query;
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTrendingCoinsEthereum = async (req, res) => {
  try {
    const { currency } = req.query;
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets`,
      {
        params: {
          vs_currency: currency || "usd", // Default currency is USD
          order: "volume_desc", // Sorting by trading volume to get "trending" coins
          platform: "ethereum", // Filtering by Ethereum platform
          per_page: 10, // Limiting to top 10 coins
          page: 1,
        },
      }
    );

    const topVolumeCoins = response.data;

    res.status(200).json(topVolumeCoins);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ... (other imports and functions)

exports.getLatestCoins = async (req, res) => {
  try {
    let { currency } = req.query; // Assuming currency is passed as a query parameter
    currency = currency.toLowerCase(); // Convert to lowercase

    // Create a projection object dynamically
    const projection = {
      "data.market_data.price_change_percentage_24h": 1,
      "data.id": 1,
      "data.image.large": 1,
      "data.name": 1,
      "data.symbol": 1,
      [`data.market_data.current_price.${currency}`]: 1,
    };

    const latestCoins = await Coin.find({}, projection)
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Rename fields and remove 'market_data' in each document
    const renamedCoins = latestCoins.map((coin) => {
      if (coin.data) {
        // Rename 'image.large' to 'image'
        if (coin.data.image && coin.data.image.large) {
          coin.image = coin.data.image.large;
        }
        // Rename 'image.large' to 'image'
        if (coin.data.image) {
          coin.id = coin.data.id;
        }
        // Rename 'image.large' to 'image'
        if (coin.data.image) {
          coin.name = coin.data.name;
        }
        // Rename 'image.large' to 'image'
        if (coin.data.image) {
          coin.symbol = coin.data.symbol;
        }

        // Rename 'market_data.current_price.CURRENCY_NAME' to 'current_price'
        if (coin.data.market_data && coin.data.market_data.current_price) {
          coin.current_price = coin.data.market_data.current_price[currency];
        }

        // Rename 'market_data.price_change_percentage_24h' to 'price_change_percentage_24h'
        if (
          coin.data.market_data &&
          coin.data.market_data.price_change_percentage_24h !== undefined
        ) {
          coin.price_change_percentage_24h =
            coin.data.market_data.price_change_percentage_24h;
        }

        // Remove 'market_data'
        delete coin.data.market_data;
        delete coin.data;
      }
      return coin;
    });

    res
      .status(200)
      .json( renamedCoins );
  } catch (error) {
    res.status(400).json({
      message: `Failed to fetch latest coins from database: ${error.message}`,
    });
  }
};

exports.getTop50Shitcoins = async (req, res) => {
  try {
    let { currency } = req.query; // Assuming currency is passed as a query parameter
    currency = currency.toLowerCase(); // Convert to lowercase

    // Aggregation pipeline
    const pipeline = [
      {
        $sort: { "data.market_data.market_cap.usd": -1 } // Sort by market cap in descending order
      },
      {
        $group: { // Group by name and keep the document with the highest market cap
          _id: "$data.name",
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" } // Replace the root to the document
      },
      {
        $limit: 50 // Limit to top 50
      }
    ];

    // Execute the aggregation pipeline
    const latestCoins = await Coin.aggregate(pipeline).allowDiskUse(true);

    // Rename fields and remove 'market_data' in each document
    const renamedCoins = latestCoins.map((coin) => {
      const renamed = {};

      if (coin.data) {
        renamed.image = coin.data.image?.large;
        renamed.id = coin.data.id;
        renamed.name = coin.data.name;
        renamed.symbol = coin.data.symbol;
        renamed.current_price = coin.data.market_data?.current_price?.[currency];
        renamed.price_change_percentage_24h = coin.data.market_data?.price_change_percentage_24h;
        renamed.market_cap = coin.data.market_data?.market_cap?.[currency];
      }

      return renamed;
    });

    res.status(200).json(renamedCoins );
  } catch (error) {
    res.status(400).json({ message: `Failed to fetch latest coins from database: ${error.message}` });
  }
};


exports.doTrendingUniswapV3Ethereum = async () => {
  try {
    // Fetch data from Uniswap V3 endpoint
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/exchanges/uniswap_v3"
    );

    // Filter tickers based on is_stale and is_anomaly
    const filteredTickers = data.tickers.filter(
      (ticker) => !ticker.is_stale && !ticker.is_anomaly
    );

    // Sort tickers by volume in descending order
    const sortedTickers = filteredTickers.sort((a, b) => b.volume - a.volume);

    // Initialize variables
    let successfulRequests = 0;

    // Fetch additional coin information and save to database
    for (const ticker of sortedTickers) {
      if (successfulRequests >= 10) {
        break; // Exit loop after 10 successful requests
      }

      const coinId = ticker.coin_id;
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}`
        );

        // Check for successful status code
        if (response.status === 200) {
          // Save to MongoDB using Mongoose
          const newCoin = new Coin({ data: response.data });
          await newCoin.save();

          // Add to successful data array

          // Increment successful request count
          successfulRequests++;
        }
      } catch (innerError) {
        return;
      }
    }
  } catch (error) {
    return;
  }
};
