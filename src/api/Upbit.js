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
    console.log('업비트 메시지 전송. 마켓 수: ', symbols.length)
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
      // acc_trade_volume_24h: 24시간 누적 거래대금
      // change: EVEN : 보합, RISE : 상승, FALL : 하락
      // change_rate: 변화율의 절대값
      // market: 종복
      convertTicker.push({
        [base]: {
          [coin]: {
            change: data['change'],
            changeRate: data['signed_change_price']
          }
        }
      })
    }
    return {
      ticker: convertTicker
    }
  }
}
export default new UpbitWS()
