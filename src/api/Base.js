const ccxt = require('ccxt')
// import store from '@redux/store'
// import { addExchange } from '@redux/actions/exchangeAction'

/**
 * 거래소 API 인터페이스
 */
 
export default class Base {
  constructor(config) {
    this.config = config
    this.markets = {}
    this.isMarketReady = false
    this._loadMarkets(config.id)
    this.ws = {}
  }
  _loadMarkets = async (id) => {
    let exchagne = new ccxt[id]()
    Object.values(await exchagne.fetchMarkets())
    .forEach(market => {
      this.markets[market['id']] = {
        base: market['quote'],
        coin: market['base']
      }
    })
    console.log('[마켓 조회 완료]', id)
    this.isMarketReady = true
  }
  getMarketList() {
    return Object.keys(this.markets)
  }
  getBaseList() {
    let baseSet = new Set()
    Object.values(this.markets).forEach(market => {
      baseSet.add(market.base)
    })
    return Array.from(baseSet)
  }
  getCoinList(base) {
    return Object.values(this.markets)
    .filter(market => market.base == base)
    .map(market => market.coin)
  }
  newWebsocket(type, qs='', initSend=null, onMessage=null, onClose=null, onError=null, onOpen=null) {
    if (type === undefined || type === null) {
      return false
    }
    qs = typeof qs === 'string' ? qs : ''
    let ws = new WebSocket(this.config.ws.url + qs)
    ws.onopen = () => { 
      console.log(this.config.id, 'websocket opened')
      if (initSend !== null) { 
        console.log('initSend>>', initSend)
        ws.send(initSend)
      }
      if (typeof onOpen === 'function') { this.onOpen() }
    }
    ws.onclose = (event) => { 
      console.log(this.config.id, 'websocket closed')
      if (typeof onClose === 'function') { onClose(event) }
    }
    ws.onerror = (error) => { 
      console.log(this.config.id, 'websocket error')
      if (typeof onError === 'function') { onError(error) }
    }
    ws.onmessage = (event) => { 
      if (typeof onMessage === 'function') { onMessage(event.data) }
    }
    this.ws[type] = ws
    return ws
  }
  wsClose(type) {
    if (this.ws[type]) {
      this.ws[type].close()
      delete this.ws[type]
      return true
    } else {
      return false
    }
  }
  wsCloseAll() {
    // 연결된 웹소켓 종료.
    Object.values(this.ws).forEach(ws => {
      try {
        ws.close()
      } catch (error) {
        // 종료 에러 무시.
      }
    })
    this.ws = {}
    return true
  }

  ticker(base, callback) {}
  orderbook(base, coin, callback) {}
  trade(base, coin, callback) {}

}