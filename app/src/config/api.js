export const CoinList = (currency) => `/api/v1/coingecko/coins?currency=${currency}`;
export const Top50Shitcoin = (currency) => `/api/v1/coingecko/top_50_shitcoin?currency=${currency}`;
export const SingleCoin = (id) => `/api/v1/coingecko/coins/${id}`;
export const HistoricalChart = (id, days = 365, currency) => `/api/v1/coingecko/historical?id=${id}&days=${days}&currency=${currency}`;
export const TrendingCoins = (currency) => `/api/v1/coingecko/trending?currency=${currency}`; 
export const TrendingCoinsEthereum = (currency) => `/api/v1/coingecko/trending_eth?currency=${currency}`; 
export const TrendingCoinsUniswapEthereum = (currency) => `/api/v1/coingecko/uniswap_trending_eth?currency=${currency}`; 