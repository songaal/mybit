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
    const key = this.marketKeyMap[base][coin].key
    console.log(key)
    const cfg = {
      type: 'orderbook',
      format: this.formatOrderbook,
      qs: `${key.toLowerCase()}@depth`
    }
    this.newWebsocket(cfg)
  }
  formatOrderbook = async (message, cfg) => {
    console.log(message)
    // let { base, coin } = this.revMarketKeyMap[data['data']['s']]
    return {
      base: 1,
      coin: 2,
      units: [],
      time: 4
    }
  }

}
export default new Binance()
