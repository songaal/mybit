const ccxt = require('ccxt')
import { fetchMarkets } from '@redux/actions/MarketAction'
/*
 * 웹소켓 로직임. 상속받아서 개발하면됨.
*/
export default class Base {
  constructor(config) {
    this.id = config.id
    this.config = config
    this.ticker = {}

    if (this.config.ws) {
      // websocket 통신
      this.wsWaitConnection()
    } else {
      // rest 폴링 통신
      this.restPolling()
    }
  }
  loadMarkets = async () => {
    let exchange = new ccxt[this.config.id]()
    let markets = (await exchange.fetchMarkets()).map(market => {
      this.ticker[market['symbol']] = {}
      return market
    })
    // TODO markets -> store 저장 시키기.
    // fetchMarkets()

  }
  wsWaitConnection() {
    let ws = new WebSocket(this.config.ws.url)
    ws.onopen = () => { this._onOpen() }
    ws.onclose = (event) => { this._onClose(event) }
    ws.onerror = (error) => { this._onError(error) }
    ws.onmessage = (event) => { this._onMessage(event.data) }
    this.ws = ws
  }
  send(obj) {
    console.log('[웹소켓 메시지 전송] ', obj)
    this.ws.send(JSON.stringify(obj))
  }
  _onOpen() {
    // 웹소켓 연결
    console.log('[웹소켓 연결]', this.config.id)
    this.loadMarkets().then((markets) => {
      if(typeof this.onOpen === 'function') {
        this.onOpen(markets)
      }
    })
  }
  _onClose(event) {
    // 웹소켓 종료
    console.log('[웹소켓 종료]', this.config.id)
    if(typeof this.onClose === 'function') {
      this.onClose()
    }
  }
  _onMessage(message) {
    // 웹소켓 데이터 받음
    this.convert(message)
        .then(data => this._fetch(data))
  }
  _onError(error) {
    // 웹소켓 에러
    console.log('[웹소켓 에러]', this.config.id, JSON.stringify(error))
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
  _fetch(data) {
    console.log('스토어 저장.')
    // ticker 데이터 스토어 저장하기
    /*
    - data structure
    exchange: {
      ticker: [{ BTC/USD: {} }, { ETH/USD: {} }],
      trade: [{ BTC/USD: {} }, { ETH/USD: {} }]
      ...
    }
    */
    return null
  }
}
