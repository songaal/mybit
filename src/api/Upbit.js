import { config } from '~/Config'
import Base from '~/api/Base'

class UpbitWS extends Base {
  constructor() {
    super(config.exchanges.upbit)
    this.isFirest = true
  }
  onOpen(dataSheets) {
    // 업비트는 웹소켓 연결 후 메시지는 전송하면 실시간으로 데이터를 구독해볼수있다.
    let symbols = []
    Object.values(dataSheets).forEach(dataSheet => {
      Object.values(dataSheet).forEach(data => {
        symbols.push(data.marketSymbol)
      })
    })
    console.log(symbols)
    this.send([
      { ticket: 'ticker' },
      { type: 'ticker', codes: symbols}
    ])
    console.log('업비트 메시지 전송.')
  }
  convert = async (message) => {
    if (this.isFirest) {
      console.log('데이터 전달받음. ', message)
    }
    this.isFirest = false
    /*
    exchange: {
      ticker: [{ BTC/USD: {} }, { ETH/USD: {} }],
      trade: [{ BTC/USD: {} }, { ETH/USD: {} }]
      ...
    }
    */
    let data = JSON.parse(await new Response(message).text())
    return {
      ticker: data['type'] === 'ticker' ? [data] : []
    }
  }
}
export default new UpbitWS()
