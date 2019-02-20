import config from '~/Config'
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
    this.rest = {}
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
    let markets = null
    try {
      markets = await exchagne.fetchMarkets()
    } catch (error) {
      console.log('마켓 조회 실패... 1초뒤 재시도 합니다.')
      setTimeout(() => {
        this._loadMarkets(id)
      }, 1000)
      return false
    }

    Object.values(markets)
      .forEach(market => {
        // quote == base
        // base == coin
        const { id, quote, base, symbol } = market
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
  close(type) {
    try {
      this.ws[type].close()
      delete this.ws[type]
    } catch (error) {
      // 종료 에러 무시.
    }
    try {
      clearTimeout(this.rest[type])
      delete this.rest[type]
    } catch (error) {
      // 종료 에러 무시.
    }
  }
  closeAll() {
    Object.values(this.ws)
      .forEach(ws => {
        try {
          ws.close()
        } catch (error) {
          // 종료 에러 무시.
        }
      })
    this.ws = {}
    let typeList = Object.keys(this.rest)
    typeList.forEach(type => {
      try {
        clearTimeout(this.rest[type])
      } catch (error) {
        // pass
      }
    })
    this.rest = {}
  }
  pollingTask(type, cfg, interval) {
    const task = (type, cfg) => {
      let url = `${this.config.rest.url}/${cfg.endpoint}`
      fetch(url, { ...cfg })
        .then(response => response.json())
        .then(response => {
          cfg.format(response, cfg)
            .then(formatData => {
              if (formatData.length === undefined) {
                // array
                formatData = [formatData]
              }
              formatData.forEach(priceSet => {
                let base = priceSet.base
                let coin = priceSet.coin
                this.markets.priceInfo[base][coin][type] = priceSet
              })
            })
        })
    }
    this.rest[type] = setTimeout(() => {
      task(type, cfg)
      this.pollingTask(type, cfg, interval)
    }, interval)
  }

  ticker(base) { }
  orderbook(base, coin) { }
  trade(base, coin) { }

}