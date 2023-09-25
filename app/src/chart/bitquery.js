export const endpoint = 'https://graphql.bitquery.io';    

export const GET_COIN_INFO =`
{
  ethereum(network: bsc) {
    dexTrades(
      options: {desc: ["block.height", "transaction.index"], limit: 1}
      exchangeName: {in: ["Pancake", "Pancake v2","Pancake v3"]}
      baseCurrency: {is: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"}
      quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}
    ) 
    {
      block {
        height
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S") 
        }
      }
      transaction {
        index
      }
      baseCurrency {
        name
        symbol
        decimals
      }
      quotePrice
    }
  }
}
`; 

export const GET_COIN_BARS = `
{
  ethereum(network: bsc) {
    dexTrades(
      options: {asc: "timeInterval.minute"}
      date: {since: "2021-06-20T07:23:21.000Z", till: "2021-06-23T15:23:21.000Z"}
      exchangeName: {in: ["Pancake", "Pancake v2","Pancake v3"]}
      baseCurrency: {is: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"},
      quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"},
      tradeAmountUsd: {gt: 10}
    ) 
    {
      timeInterval {
        minute(count: 15, format: "%Y-%m-%dT%H:%M:%SZ")  
      }
      volume: quoteAmount
      high: quotePrice(calculate: maximum)
      low: quotePrice(calculate: minimum)
      open: minimum(of: block, get: quote_price)
      close: maximum(of: block, get: quote_price) 
    }
  }
}
`; 