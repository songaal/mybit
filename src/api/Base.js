const ccxt = require('ccxt')
/**
 * 거래소의 마켓 정보 
 * 웹소켓 or http rest polling 관리
 * - 마켓 데이터 구조
 * markets = {
 *    priceInfo: {
 *      base1: {
 *        coin2: {
 *          ticker: { ... },
 *          orderbook: { ... },
 *          trade: { ... }
 *        }
 *       ...
 *      }
 *    },
 *    pairCoinList: {
 *      base1: [coin1, coin2, ...]
 *      ...
 *    }
 *  }
 * - 거래소, ccxt 마켓 맵핑데이터
 *    marketKeyMap[quote][coin] = {
 *      symbol: symbol,
 *      base: quote,
 *      coin: base,
 *      key: id
 *    }
 */

export default class Base {
  constructor(config) {
    this.config = config
    this.ws = {}
    this.markets = {
      priceInfo: {},
      pairCoinList: {}
    }
    this.marketKeyMap = {}
    this.revMarketKeyMap = {}
    this.isMarketReady = false
    this._loadMarkets(config.id)
  }
  _loadMarkets = async (id) => {
    let exchagne = new ccxt[id]()
    let priceInfo = {}
    let paireCoinList = {}
    let marketKeyMap = {}
    let revMarketKeyMap = {}
    const markets = await exchagne.fetchMarkets()
    Object.values(markets)
    .forEach(market => {
      // quote == base
      // base == coin
      const {id, quote, base, symbol } = market
      if (paireCoinList[quote] === undefined) {
        paireCoinList[quote] = []
        priceInfo[quote] = {}
        marketKeyMap[quote] = {}
      }
      priceInfo[quote][base] = {}
      paireCoinList[quote].push(base)
      marketKeyMap[quote][base] = {
        symbol: symbol,
        base: quote,
        coin: base,
        key: id
      }
      revMarketKeyMap[id] = {
        symbol: symbol,
        base: quote,
        coin: base
      }
    })
    this.markets.priceInfo = priceInfo
    this.markets.pairCoinList = paireCoinList
    this.marketKeyMap = marketKeyMap
    this.revMarketKeyMap = revMarketKeyMap
    this.isMarketReady = true
  }
  newWebsocket(cfg) {
    if (this.ws[cfg.type]) {
      this.ws[cfg.type].close()
    }
    let qs = typeof cfg.qs === 'string' ? cfg.qs : ''
    let ws = new WebSocket(this.config.ws.url + qs)
    ws.onopen = () => { 
      if (typeof cfg.initSend === 'string') {
        ws.send(cfg.initSend)
      }
      if (typeof cfg.onOpen === 'function') {
        cfg.onOpen()
      }
    }
    ws.onclose = (event) => {
      if (typeof cfg.onClose === 'function') {
        cfg.onClose(event)
      }
    }
    ws.onerror = (error) => {
      if (typeof cfg.onError === 'function') {
        cfg.onError(error)
      }
    }
    ws.onmessage = (event) => {
      let message = event.data
      if (typeof cfg.onMessage === 'function') {
        cfg.onmessage(message)
      }
      if (typeof cfg.format === 'function') {
        cfg.format(message).then(priceSet => {
          let base = priceSet.base
          let coin = priceSet.coin
          this.markets.priceInfo[base][coin][cfg.type] = priceSet
        })
      } else {
        let base = priceSet.base
        let coin = priceSet.coin
        this.markets.priceInfo[base][coin][cfg.type] = message
      }
    }
    this.ws[cfg.type] = ws
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

  ticker(base) {}
  orderbook(base, coin) {}
  trade(base, coin) {}

}