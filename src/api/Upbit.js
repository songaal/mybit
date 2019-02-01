import { config } from '~/Config'
import Base from '~/api/Base'

class UpbitWS extends Base {
  constructor() {
    super(config.exchanges.upbit)
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
      { ticket: 'ticket' },
      { type: 'ticker',
        codes: symbols
      },
      { type: 'orderbook',
        codes: symbols
      },
      { type: 'trade',
        codes: symbols
      },
    ])

    console.log('업비트 메시지 전송. 심볼 수: ', symbols.length)
  }
  convert = async (state, message) => {
    // 업비트는 심볼하나씩 데이터옴.
    let data = JSON.parse(await new Response(message).text())
    if (data['type'] === 'ticker') {
      let base = this.symbolMap[data['code']]['base']
      let coin = this.symbolMap[data['code']]['coin']
      state[base][coin] = Object.assign(state[base][coin], {
        ticker: {
          change: data['change'],
          changeRate: data['signed_change_rate'],
          tradePrice: data['trade_price'],
          tradeVolume: data['acc_trade_price']
        }
      })
    } else if (data['ty'] === 'trade') {
      let base = this.symbolMap[data['cd']]['base']
      let coin = this.symbolMap[data['cd']]['coin']
      // console.log(base, coin, data['ab'], data['c'], data['tp'], data['tv'])
      state[base][coin] = Object.assign(state[base][coin], {
        trade: {
          ab: data['ab'],
          change: data['c'],
          tradePrice: data['tp'],
          tradeVolume: data['tv']
        }
      })
    }else {
      // console.log(1)
    }

    return state
  }
}
export default new UpbitWS()
