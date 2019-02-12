const ccxt = require('ccxt')

/**
 * 거래소 API 인터페이스
 */
 
export default class Base {
  constructor(config) {
    this.config = config
    this.markets = {}
    this.baseList = []
    this.coins = {}
    this.ws = {}
    this.isMarketReady = false
    this._loadMarkets(config.id)
  }
  _loadMarkets = async (id) => {
    let exchagne = new ccxt[id]()
    Object.values(await exchagne.fetchMarkets())
    .forEach(market => {
      let id = market['id']
      let base = market['quote']
      let coin = market['base']
      if (this.coins[base] === undefined) {
        this.coins[base] = []
        this.baseList.push(base)
      }
      this.coins[base].push(coin)
      this.markets[id] = { base: base, coin: coin }
    })
    console.log('[마켓 조회 완료]', id)
    this.isMarketReady = true
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
        // console.log('initSend>>', initSend)
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
    try {
      this.ws[type].close()
      delete this.ws[type]
    } catch(error) {
      // 종료 에러 무시.
    }
  }
  wsCloseAll() {
    Object.values(this.ws)
    .forEach(ws => {
      try {
        ws.close()
      } catch (error) {
        // 종료 에러 무시.
      }
    })
    this.ws = {}
  }

  ticker(base, callback) {}
  orderbook(base, coin, callback) {}
  trade(base, coin, callback) {}

}