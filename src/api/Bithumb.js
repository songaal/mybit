import { config } from '~/Config'
import Base from '@api/Base'
import numeral from 'numeral'
import ccxt from 'ccxt'

/**
 * upbit api
 */

class Bithumb extends Base {
  constructor() {
    super(config.exchanges.bithumb)
  }
  ticker(base) {
    const config = {
      endpoint: '/public/ticker/all',
      method: 'GET',
      base: base,
      format: this.formatTicker
    }
    this.pollingTask('ticker', config, 500)
  }
  formatTicker = async (message, config) => {
    let formatData = []
    try {
      delete message.data['date']
    } catch (error) {
      console.log('[warning] 데이터 삭제 실패.')
    }
    let base = config.base
    Object.keys(message.data).forEach(coin => {
      let ticker = message.data[coin]
      formatData.push({
        coin: coin,
        base: config.base,
        tradePrice: numeral(ticker['closing_price']).format('0,000[.]00'),
        changeRate: numeral(ticker['24H_fluctate_rate'] / 100).format('0,0[.]00a'),
        tradeVolume: numeral(ticker['units_traded']).format('0,0[.]00a')
          .replace('b', '억').replace('m', '백만').replace('k', '만')
      })
    })
    return formatData
  }
  orderbook(base, coin) {
    const config = {
      endpoint: `/public/orderbook/${coin}`,
      method: 'GET',
      base: base,
      coin: coin,
      format: this.formatOrderbook
    }
    this.pollingTask('orderbook', config, 200)
  }
  formatOrderbook = async (message, cfg) => {
    let asks = []
    let bids = []
    let time = null
    try {
      message['data']['asks'].forEach(orderbook => {
        asks.push({
          price: numeral(orderbook['price']).format('0,000[.]00'),
          size: orderbook['quantity'],
          unit: 'ask'
        })
      })
      message['data']['bids'].forEach(orderbook => {
        bids.push({
          price: numeral(orderbook['price']).format('0,000[.]00'),
          size: orderbook['quantity'],
          unit: 'bid'
        })
      })
      time = message['data']['timestamp']
    } catch (error) {
      console.log('오더북 데이터가 없음.', error)
    }

    return {
      base: cfg.base,
      coin: cfg.coin,
      units: asks.reverse().concat(bids),
      time: time
    }
  }
  getOrders = async (accessKey, secretKey, base, coin) => {
    // let url = config.exchanges.bithumb.rest.url + '/info/orders'
    // let responseBody = await fetch(url, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     apiKey: accessKey,
    //     secretKey: secretKey,
    //     currency: coin,
    //     count: 50
    //   })
    // })

    // console.log(responseBody)

    let exchange = new ccxt['bithumb']({
      apiKey: "7c2ace2277f231489130087e5ee4afd3",
	    secret: "5924e3a2d09c1697535464557ab742fd"
    })
    exchange.loadMarkets()
    console.log(exchange)
    console.log(exchange.sign())
    // console.log('2', exchange.sign_message())
    // console.log('3', exchange.sign_message2())
    
    // let response = await exchange.privatePostInfoOrder({
    //   currency: 'BTC'
    // })
    
    // console.log(response)


    return []
    // let exchange = new ccxt[config.exchanges.upbit.id]({
    //   apiKey: accessKey,
    //   secret: secretKey
    // })
    // let orders = await exchange.fetchOrders(`${coin}/${base}`, undefined, 50)
    // if (orders.length > 0) {
    //   return orders.map(order => {
    //     if (base == 'KRW' || base.indexOf('USD') != -1) {
    //       priceRex = '0,000[.]00'
    //     }
    //     return {
    //       id: order['id'],
    //       base: base,
    //       coin: coin,
    //       amount: order['amount'],
    //       timestamp: Utils.formatTimestamp(order['timestamp']),
    //       filled: order['filled'],
    //       price: numeral(order['price']).format(priceRex),
    //       side: order['side'],
    //       type: order['type'],
    //       fee: order['fee'] || 0,
    //       status: order['status']
    //     }
    //   })
    // } else {
    //   return []
    // }
  }
}
export default new Bithumb()
