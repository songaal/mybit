/*
 * 거래소 웹소켓또는 폴링작업을 임포트하는 영역.
 * 싱글턴방식으로 중복 실행안되게 구현체에서 정의
 * class Base 상속받아서 구현제 만들기.
 * 구현체에서는 파라미터, 메시지 데이터만 변환작업만 진행
 */
import ccxt from 'ccxt'
import Upbit from '@api/Upbit'
import Bithumb from '@api/Bithumb'
import Binance from '@api/Binance'
// import Bitmex from '@api/Bitmex'

class Nexus {
  constructor() {
    this.api = {
      'upbit': Upbit,
      'bithumb': Bithumb,
      'binance': Binance,
      //   'bitmex': Bitmex,
    }
  }
  checkMarket(callback) {
    let isReady = true
    Object.keys(this.api)
      .forEach(key => {
        if (!this.api[key].isMarketReady) {
          isReady = false
          return false
        }
      })
    if (isReady === true && typeof callback === 'function') {
      callback(isReady)
    } else {
      setTimeout(() => {
        this.checkMarket(callback)
      }, 500)
    }
  }
  isSubscribe(exchange, type) {
    return this.api[exchange].ws[type] !== undefined ||
      this.api[exchange].rest[type] !== undefined
  }
  close(exchange, type) {
    this.api[exchange].close(type)
  }
  closeAll(exchange) {
    if (exchange === undefined) {
      Object.keys(this.api).forEach(key => {
        this.api[key].closeAll()
      })
    } else {
      this.api[exchange].closeAll()
    }
  }
  getMarketKeyMap(exchange) {
    return Object.assign({}, this.api[exchange].marketKeyMap)
  }
  runTicker(exchange, base) {
    this.api[exchange].ticker(base)
  }
  getPriceInfo(exchange, type = null) {
    return this.api[exchange].markets.priceInfo
  }
  runOrderbook(exchange, base, coin) {
    this.api[exchange].orderbook(base, coin)
  }
  createOrder = async (exchangeId, accessKey, secretKey, params) => {
    // createOrder (symbol, type, side, amount[, price[, params]])
    let result = null
    try {
      let exchange = new ccxt[exchangeId]({
        apiKey: accessKey,
        secret: secretKey
      })
      console.log(params)

      let order = null

      if (params['side'] == 'buy') {
        if (params['type'] == 'market') {
          order = await exchange.createMarketBuyOrder(params['symbol'], params['amount'], params['params'] || {})
        } else if (params['type'] == 'limit') {
          order = await exchange.createLimitBuyOrder(params['symbol'], params['amount'], params['price'], params['params'] || {})
        }
      } else if (params['side'] == 'sell') {
        if (params['type'] == 'market') {
          order = await exchange.createMarketSellOrder(params['symbol'], params['amount'], params['params'] || {})
        } else if (params['type'] == 'limit') {
          order = await exchange.createLimitSellOrder(params['symbol'], params['amount'], params['price'], params['params'] || {})
        }
      }

      //   order = await exchange.createOrder(params['symbol'],
      //     params['type'],
      //     params['side'],
      //     params['amount'],
      //     params['price'],
      //     params['params'] || {})

      result = {
        status: 'success',
        order: order
      }

    } catch (error) {
      console.log(error)
      let trashIndex = error.message.indexOf(' ')
      let message = JSON.parse(error.message.substring(trashIndex))['message']
      result = {
        status: 'fail',
        message: message === undefined ? error.message : message
      }
    }
    return result
  }
  getOrderHistory = async (exchangeId, base, coin, accessKey, secretKey) => {
    //   fetchOrders([symbol[, since[, limit[, params]]]])
    let result = null
    try {
      let exchange = new ccxt[exchangeId]({
        apiKey: accessKey,
        secret: secretKey
      })
      if (exchange.has['fetchMyTrades'] === false) {
        result = {
          status: 'fail',
          message: '주문내역을 지원하지 않습니다.'
        }
      } else {
        result = {
          status: 'success',
          data: await exchange.fetchOrders(`${coin}/${base}`, undefined, limit = 50, {})
        }
      }
    } catch (error) {
      console.log(error)
      let trashIndex = error.message.indexOf(' ')
      let message = JSON.parse(error.message.substring(trashIndex))['message']
      result = {
        status: 'fail',
        message: message
      }
    }
    return result
  }
  getBalance = async (exchangeId, accessKey, secretKey) => {
    let result = null
    try {
      let exchange = new ccxt[exchangeId]({
        apiKey: accessKey,
        secret: secretKey
      })
      result = {
        status: 'success',
        data: await exchange.fetchBalance()
      }
    } catch (error) {
      console.log(error)
      let trashIndex = error.message.indexOf(' ')
      let message = JSON.parse(error.message.substring(trashIndex))['message']
      result = {
        status: 'fail',
        message: message
      }
    }
    return result
  }

  getCoinLastPrice = async (accessKey, secretKey, exchangeId, base, coin) => {
    let exchange = new ccxt[exchangeId]({
      apiKey: accessKey,
      secret: secretKey
    })
    let lastPrice = 0
    try {
      lastPrice = (await exchange.fetchTicker(`${coin}/${base}`))['close']
    } catch (error) {
      console.log(error)
    }
    return lastPrice
  }

  getOrders = async (accessKey, secretKey, exchangeId, base, coin) => {
    return await this.api[exchangeId].getOrders(accessKey, secretKey, base, coin)
  }
}


export default new Nexus()