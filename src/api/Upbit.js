import { config } from '~/Config'
import Base from '@api/Base'
import numeral from 'numeral'

/**
 * upbit api
 */

class Upbit extends Base {
  constructor() {
    super(config.exchanges.upbit)
  }
  ticker(base) {
    const keys = Object.values(this.marketKeyMap[base])
    .map(marketKey => marketKey.key)
    this.newWebsocket({
      type: 'ticker',
      format: this.formatTicker,
      initSend: JSON.stringify([
        { ticket: 'ticker' }, 
        { type: 'ticker', 
          codes: keys
        }]),
      base: base
    })
  }
  formatTicker = async (message) => {
    let data = JSON.parse(await new Response(message).text())
    let { base, coin } = this.revMarketKeyMap[data['code']]
    if (base === 'KRW') {
      tradePrice = numeral(data['trade_price']).format('0,000[.]00')
      changeRate = numeral(data['signed_change_rate']).format('0,0[.]00a')
      tradeVolume = numeral(data['acc_trade_price']).format('0,0[.]00a')
      tradeVolume=tradeVolume.replace('b', '억').replace('m', '백만').replace('k', '만')
    } else if (base.indexOf('USD') != -1) {
      tradePrice = numeral(data['trade_price']).format('0,0[.]00a')
      changeRate = numeral(data['signed_change_rate']).format('0,0[.]00a')
      tradeVolume = numeral(data['acc_trade_price']).format('0,0[.]000a')
    } else {
      tradePrice = numeral(data['trade_price']).format('0,0[.]00000000a')
      if (isNaN(tradePrice)) {
        tradePrice = '0.000000' + (data['trade_price'] * 100000000).toFixed(0)
      }
      changeRate = numeral(data['signed_change_rate']).format('0,0[.]00a')
      tradeVolume = numeral(data['acc_trade_price']).format('0,0[.]000a')
    }
    return {
      base: base,
      coin: coin,
      changeRate: changeRate,
      tradePrice: tradePrice,
      tradeVolume: tradeVolume
    }
  }
  orderbook(base, coin) {
    const key = this.marketKeyMap[base][coin].key
    const cfg = {
      type: 'orderbook',
      format: this.formatOrderbook,
      initSend: JSON.stringify([
        { ticket: 'orderbook' }, 
        { type: 'orderbook', 
          codes: [key] }
        ]),
      base: base,
      coin: coin
    }
    this.newWebsocket(cfg)
  }
  formatOrderbook = async (message, cfg) => {
    let data = JSON.parse(await new Response(message).text())
    let { base, coin } = this.revMarketKeyMap[data['code']]
    let asks = []
    let bids = []
    let priceRex = '0,000[.]00000000'
    if (cfg.base == 'KRW' || cfg.base.indexOf('USD') != -1) {
      priceRex = '0,000[.]00'
    }
    data['orderbook_units'].forEach(orderbook => {
      asks.push({
        price: numeral(orderbook['ask_price']).format(priceRex),
        size: orderbook['ask_size'],
        unit: 'ask'
      })
      bids.push({
        price: numeral(orderbook['bid_price']).format(priceRex),
        size: orderbook['bid_size'],
        unit: 'bid'
      })
    })

    return {
      base: base,
      coin: coin,
      units: asks.reverse().concat(bids),
      time: data['timestamp']
    }
  }
  getOrders = async (accessKey, secretKey, base, coin) => {
    let exchange = new ccxt[config.exchanges.upbit.id]()
    console.log(await exchange.fetchOrders())
  }
}
export default new Upbit()
