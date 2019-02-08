import { config } from '~/Config'
import Base from '@api/Base'
/**
 * upbit api
 */
class Upbit extends Base {
  constructor() {
    super(config['exchanges']['upbit']) // base에서 거래소의 마켓 정보를 store에 저장.
  }
  ticker(base, callback, retry=10) {
    const codes = Object.keys(this.markets).filter(key => this.markets[key].base === base)
    const initSend = JSON.stringify([ { ticket: 'ticker' }, { type: 'ticker', codes: codes } ])
    const convert = async (message) => {
      let data = JSON.parse(await new Response(message).text())
      let { base, coin } = this.markets[data['code']]
      callback({
        base: base,
        coin: coin,
        changeRate: data['signed_change_rate'],
        tradePrice: data['trade_price'],
        tradeVolume: data['acc_trade_price']
      })
    }
    this.newWebsocket('ticker', null, initSend, convert)
  }
  orderbook(base, coin, callback, retry=10) {
    const initSend = JSON.stringify([ { ticket: 'orderbook' }, { type: 'orderbook', codes: [`${base}-${coin}`] } ])
    const convert = async (message) => {
      let data = JSON.parse(await new Response(message).text())
      callback(JSON.stringify(data))
    }
    this.newWebsocket('orderbook', null, initSend, convert)
  }
  trade(base, coin, callback, retry=10) {
    const initSend = JSON.stringify([ { ticket: 'trade' }, { type: 'trade', codes: [`${base}-${coin}`] } ])
    const convert = async (message) => {
      let data = JSON.parse(await new Response(message).text())
      callback(JSON.stringify(data))
    }
    this.newWebsocket('trade', null, initSend, convert)
  }
}
export default new Upbit()
