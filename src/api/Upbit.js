import { config } from '~/Config'
import Base from '~/api/Base'

class UpbitWS extends Base {
  constructor() {
    super(config.exchanges.upbit)
  }
  onOpen(dataSheets) {

    // 업비트는 웹소켓 연결 후 메시지는 전송하면 실시간으로 데이터를 구독해볼수있다.
    let symbols = []
    Object.values(dataSheets).forEach(dataSheet => {
      Object.values(dataSheet).forEach(data => {
        symbols.push(data.marketSymbol)
      })
    })
    this.send([
      { ticket: 'ticker' },
      { type: 'ticker', codes: symbols}
    ])
    console.log('업비트 메시지 전송.')
  }
  convert = async (message) => {
    /*
    - return data structure
    {
      tickers: [
        base: {
          coin: {tickerData}
        },
        base: {
          coin: {tickerData}
        }
        ...
      ]
    }
    */
    let data = JSON.parse(await new Response(message).text())
    let convertTicker = []
    if (data['type'] === 'ticker') {
      let symbol = data['code'].split('-')
      let base = symbol[0]
      let coin = symbol[1]
      convertTicker.push({
        [base]: {
          [coin]: data
        }
      })
    }
    return {
      ticker: convertTicker
    }
  }
}
export default new UpbitWS()
