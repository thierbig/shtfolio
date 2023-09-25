import axios from 'axios';
import * as Bitquery from './bitquery';

//let axios="";
const lastBarsCache = new Map();
const configurationData = {
    supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M']
};

export default {
    onReady: (callback) => {
        console.log('[onReady]: Method called!!');
        setTimeout(() => callback(configurationData));
    },
    resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        console.log('[resolveSymbol]: Method called!!');
        try {
            const response = await axios.post(
                Bitquery.endpoint,
                {
                    query: Bitquery.GET_COIN_INFO,
                    variables: {
                        "tokenAddress": symbolName
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-KEY": "BQYJXOgdWwQlra853Ge8qPK8G8l1FCdN"
                    }
                }
            );

            const coin = response.data.data.ethereum.dexTrades[0].baseCurrency;

            if (!coin) {
                onResolveErrorCallback();
                return;
            }

            const symbol = {
                ticker: symbolName,
                name: `${coin.symbol}/USD`,
                session: '24x7',
                timezone: 'Etc/UTC',
                minmov: 1,
                pricescale: 10000000,
                has_intraday: true,
                intraday_multipliers: ['1', '5', '15', '30', '60'],
                has_empty_bars: true,
                has_weekly_and_monthly: false,
                supported_resolutions: configurationData.supported_resolutions,
                volume_precision: 1,
                data_status: 'streaming',
            };

            onSymbolResolvedCallback(symbol);
        } catch (error) {
            console.error('Error in resolveSymbol:', error);
            onResolveErrorCallback();
        }
    },
    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback, first) => {
        console.log('getBars called with:', {
            symbolInfo,
            resolution,
            periodParams,
            onHistoryCallback: typeof onHistoryCallback,
            onErrorCallback: typeof onErrorCallback,
            first
        });
    
        try {
            if (resolution === '1D') {
                resolution = 1440;
            }
    
            const from = new Date(periodParams.from * 1000).toISOString();
            const to = new Date(periodParams.to * 1000).toISOString();
    
            const response = await axios.post(
                Bitquery.endpoint,
                {
                    query: Bitquery.GET_COIN_BARS,
                    variables: {
                        from,
                        to,
                        interval: Number(resolution),
                        tokenAddress: symbolInfo.ticker
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-KEY": "BQYJXOgdWwQlra853Ge8qPK8G8l1FCdN"
                    }
                }
            );
    
            const bars = response.data.data.ethereum.dexTrades.map(el => ({
                time: new Date(el.timeInterval.minute).getTime(),
                low: el.low,
                high: el.high,
                open: Number(el.open),
                close: Number(el.close),
                volume: el.volume
            }));
    
            if (typeof onHistoryCallback === 'function') {
                if (bars.length) {
                    onHistoryCallback(bars, { noData: false });
                } else {
                    onHistoryCallback([], { noData: true });
                }
            } else {
                console.error('onHistoryCallback is not a function');
            }
    
        } catch (error) {
            console.error('Error in getBars:', error);
            if (typeof onErrorCallback === 'function') {
                onErrorCallback(error);
            }
        }
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeID, onResetCacheNeededCallback) => { },
    unsubscribeBars: (subscribeID) => { }
};
