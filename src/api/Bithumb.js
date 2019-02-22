import { config } from '~/Config'
import Base from '@api/Base'
import numeral from 'numeral'

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
}
export default new Bithumb()
