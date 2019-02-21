import { config } from '~/Config'
import Base from '@api/Base'
import Utils from '~/Utils'
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
    console.log(serviceNames)
    this.newWebsocket({
      type: 'ticker',
      qs: 'streams=' + serviceNames,
      format: this.formatTicker,
    })
  }
  formatTicker = async (message) => {
    // let data = JSON.parse(await new Response(message).text())
    // let { base, coin } = this.revMarketKeyMap[data['code']]
    // if (base === 'KRW') {
    //   tradePrice = numeral(data['trade_price']).format('0,000[.]00')
    //   changeRate = numeral(data['signed_change_rate']).format('0,0[.]00a')
    //   tradeVolume = numeral(data['acc_trade_price']).format('0,0[.]00a')
    //   tradeVolume=tradeVolume.replace('b', '억').replace('m', '백만').replace('k', '만')
    // } else if (base.startsWith('USD')) {
    //   tradePrice = numeral(data['trade_price']).format('0,0[.]00a')
    //   changeRate = numeral(data['signed_change_rate']).format('0,0[.]00a')
    //   tradeVolume = numeral(data['acc_trade_price']).format('0,0[.]000a')
    // } else {
    //   tradePrice = numeral(data['trade_price']).format('0,0[.]00000000a')
    //   if (isNaN(tradePrice)) {
    //     tradePrice = '0.000000' + (data['trade_price'] * 100000000).toFixed(0)
    //   }
    //   changeRate = numeral(data['signed_change_rate']).format('0,0[.]00a')
    //   tradeVolume = numeral(data['acc_trade_price']).format('0,0[.]000a')
    // }
    return {
      base: 1,
      coin: 2,
      changeRate: 3,
      tradePrice: 4,
      tradeVolume: 5
    }
  }
  orderbook(base, coin) {
    // const key = this.marketKeyMap[base][coin].key
    // const cfg = {
    //   type: 'orderbook',
    //   format: this.formatOrderbook,
    //   initSend: JSON.stringify([
    //     { ticket: 'orderbook' }, 
    //     { type: 'orderbook', 
    //       codes: [key] }
    //     ])
    // }
    // this.newWebsocket(cfg)
  }
  formatOrderbook = async (message) => {
    console.log(message)
    return {
      base: 1,
      coin: 2,
      units: 3,
      time: 4
    }
  }

}
export default new Binance()
