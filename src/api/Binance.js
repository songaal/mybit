import { config } from '~/Config'
import Base from '@api/Base'
import numeral from 'numeral'
/**
 * binance api
 */

class Binance extends Base {
  constructor() {
    super(config.exchanges.binance)
  }
  ticker(base) {
    let serviceNames = Object.values(this.marketKeyMap[base])
      .map(marketKey => marketKey.key.toLowerCase() + '@ticker/').join('')
    serviceNames = serviceNames.substring(0, serviceNames.length - 1)
    this.newWebsocket({
      type: 'ticker',
      qs: 'streams=' + serviceNames,
      format: this.formatTicker,
      base: base
    })
  }
  formatTicker = async (message, cfg) => {
    let data = JSON.parse(message)
    let { base, coin } = this.revMarketKeyMap[data['data']['s']]

    if (base.indexOf('USD') != -1) {
      tradePrice = numeral(data['data']['c']).format('0,0[.]00a')
      changeRate = numeral(data['data']['P']).format('0,0[.]00a')
      tradeVolume = numeral(data['data']['v']).format('0,0[.]000a')
    } else {
      tradePrice = numeral(data['data']['c']).format('0,0[.]00000000a')
      if (isNaN(tradePrice)) {
        tradePrice = '0.000000' + (data['data']['c'] * 100000000).toFixed(0)
      }
      changeRate = numeral(data['data']['P']).format('0,0[.]00a')
      tradeVolume = numeral(data['data']['v']).format('0,0[.]000a')
    }

    return {
      base: base,
      coin: coin,
      tradePrice: tradePrice,
      changeRate: changeRate,
      tradeVolume: tradeVolume
    }
  }
  orderbook(base, coin) {
    const config = {
      endpoint: `depth?symbol=${coin}${base}&limit=10`,
      method: 'GET',
      base: base,
      coin: coin,
      format: this.formatOrderbook
    }
    this.pollingTask('orderbook', config, 500)
  }
  formatOrderbook = async (message, cfg) => {
    let asks = []
    let bids = []
    let time = message['lastUpdateId']

    let priceRex = '0,000[.]00000000'
    if (cfg.base == 'KRW' || cfg.base.indexOf('USD') != -1) {
      priceRex = '0,000[.]00'
    }

    message['asks'].forEach(ask => {
      asks.push({
        price: numeral(ask[0]).format(priceRex),
        size: ask[1],
        unit: 'ask'
      })
    })
    message['bids'].forEach(bid => {
      asks.push({
        price: numeral(bid[0]).format(priceRex),
        size: bid[1],
        unit: 'bid'
      })
    })

    return {
      base: cfg.base,
      coin: cfg.coin,
      units: asks.reverse().concat(bids),
      time: time
    }
  }

}
export default new Binance()
