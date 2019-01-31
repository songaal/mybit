import { config } from '~/Config'
import Base from '~/api/Base'

class UpbitWS extends Base {
  constructor() {
    super(config.exchanges.upbit)
    this.isDev = true
  }
  onOpen(symbols) {
    /*
     * 업비트는 웹소켓 연결 후 메시지는 전송하면 실시간으로 데이터를 구독해볼수있다.
     * symbolMap은 ccxt와 거래소의 심볼명의 차이를 맵핑해준 데이터이며, convert시 키값은 [base][coin]
     * symbolMap data structure
     * {KRW-BCH: {
     *    base: KRW,
     *    coin: BCC,
     *    symbol: BCC/KRW
     *    ...
     * }}
    */

    this.send([
      { ticket: 'ticker' },
      { type: 'ticker', codes: symbols}
    ])
    // this.send([
    //   { ticket: 'ticker' },
    //   { type: 'ticker', codes: ['KRW-WAVES', 'USDT-XMR', 'ETH-TUSD']}
    // ])
    console.log('업비트 메시지 전송. 마켓 수: ', symbols.length)
  }
  convert = async (state, message) => {
    // 업비트는 심볼하나씩 데이터옴.
    let textData = await new Response(message).text()
    if (this.isDev) {
      console.log(textData)
      this.isDev = false
    }
    let data = JSON.parse(await new Response(message).text())
    let base = this.symbolMap[data['code']]['base']
    let coin = this.symbolMap[data['code']]['coin']

    if (data['type'] === 'ticker') {
      state[base][coin] = Object.assign(state[base][coin], {
        ticker: {
          change: data['change'],
          signedChangeRate: data['signed_change_rate'],
          tradePrice: data['trade_price'],
          accTradeVolume: data['acc_trade_price']
        }
      })
      // console.log('volume', data['acc_trade_price'])
    }
    return state
  }
}
export default new UpbitWS()
