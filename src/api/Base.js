const ccxt = require('ccxt')
import store from '@redux/store'
import { initAction, fetchState } from '@redux/actions/exchangeAction'
import Upbit2 from '@api/Upbit2'
/*
 * 웹소켓 로직임. 상속받아서 개발하면됨.
*/
export default class Base {
  constructor(config) {
    this.id = config.id
    this.config = config
    this.symbolMap = {}
    this.dirtyState = null

    if (this.config.ws) {
      // websocket 통신
      this.wsConnection()
    } else {
      // TODO rest 폴링 통신으로 주기적 데이터 조회
      this.restPolling()
    }
  }
  loadMarkets = async () => {
    let exchange = new ccxt[this.id]()
    let dataSheets = {}
    let symbolMap = {}
    Object.values(await exchange.fetchMarkets())
          .forEach(market => {
      // store에 생성될 데이터 구조.
      let data = {
        exchange: this.id,
        symbol: market['symbol'],
        base: market['quote'],
        coin: market['base'],
        marketSymbol: market['id']
      }
      if (dataSheets[data.base] === undefined) {
        dataSheets[data.base] = {}
      }
      symbolMap[data.marketSymbol] = data
      dataSheets[data.base][data.coin] = data
    })
    this.symbolMap = symbolMap
    this.dirtyState = dataSheets
    store.dispatch(initAction(this.id, dataSheets))
    this._fetch()
    return Object.keys(symbolMap)
  }
  wsConnection() {
    let ws = new WebSocket(this.config.ws.url)
    ws.onopen = () => { this._onOpen() }
    ws.onclose = (event) => { this._onClose(event) }
    ws.onerror = (error) => { this._onError(error) }
    ws.onmessage = (event) => { this._onMessage(event.data) }
    this.ws = ws
  }
  send(obj) {
    this.ws.send(JSON.stringify(obj))
  }
  _onOpen() {
    console.log('[웹소켓 연결]', this.id)
    this.loadMarkets().then((symbols) => {
      if(typeof this.onOpen === 'function') {
        this.onOpen(symbols)
      }
    })
  }
  _onClose(event) {
    // 웹소켓 종료
    console.log('[웹소켓 종료]', this.id)
    if(typeof this.onClose === 'function') {
      this.onClose()
    }
  }
  _onMessage(message) {
    // 웹소켓 데이터 받음
    (async () => {
      this.dirtyState = await this.convert(Object.assign({}, this.dirtyState), message)
    })()
  }
  _onError(error) {
    // 웹소켓 에러
    console.log('[웹소켓 에러]', this.id, JSON.stringify(error))
    if(typeof this.onError === 'function') {
      this.onError()
    }
  }
  restPolling() {
    // ws, rest 데이터를 가공하여 fetchTicker 넘기기 빗썸꺼
  }
  convert(message) {
    return message
  }
  _fetch() {
    // 너무빠른 상태 변경으로 딜레이 추가.
    if (this.dirtyState == null) {
      return
    }
    store.dispatch(fetchState({[this.id]: this.dirtyState}))
    setTimeout(() => this._fetch(), 500)
  }
}
