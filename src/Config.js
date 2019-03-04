export const config = {
  exchanges: {
    upbit: {
      id: 'upbit',
      tvExchangeId: 'upbit',
      isTvUDF: true,
      engName: 'Upbit',
      korName: '업비트',
      tether: 'KRW',
      ws: {
        url: 'wss://api.upbit.com/websocket/v1'
      },
    },
    bithumb: {
      id: 'bithumb',
      tvExchangeId: 'BITHUMB',
      isTvUDF: false,
      engName: 'Bithumb',
      korName: '빗썸',
      tether: 'KRW',
      rest: {
        url: 'https://api.bithumb.com'
      },
    },
    binance: {
      id: 'binance',
      tvExchangeId: 'BINANCE',
      isTvUDF: false,
      engName: 'Binance',
      korName: '바이낸스',
      tether: 'USDT',
      ws: {
        url: 'wss://stream.binance.com:9443/stream'
      },
      rest: {
        url: 'https://www.binance.com/api/v1/'
      },
    },
    // bitmex: {
    //   id: 'bitmex',
    //   engName: 'Bitmex',
    //   korName: '비트맥스',
    //   ws: {
    //     url: 'wss: //www.bitmex.com/realtime'
    //   }
    // }
  },
  getExchangeLabels: () => {
    return Object.values(config.exchanges).map(exchange => {
      return { key: exchange.id, title: exchange.korName }
    })
  }
}


/*
bitmex: {
  id: 'bitmex',
  engName: 'Bitmex',
  korName: '비트맥스',
  ws: {
    url: ''
  }
},
bithumb: {
  id: 'bithumb',
  engName: 'Bithumb',
  korName: '빗썸',
  ws: null
},
binance: {
  id: 'binance',
  engName: 'Binance',
  korName: '바이낸스',
  ws: {
    url: ''
  }
}
*/
