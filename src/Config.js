
export const config = {
  exchanges: {
    upbit: {
      id: 'upbit',
      engName: 'Upbit',
      korName: '업비트',
      currencyUnit: 'KRW',
      ws: {
        url: 'wss://api.upbit.com/websocket/v1',
        ticker: ''
      }
    },
  },
  getExchanges: () => {
    return ['upbit']
  }
}


/*
bithumb: {
  id: 'bithumb',
  engName: 'Bithumb',
  korName: '빗썸',
  displayCurrencyUnit: 'KRW',
  ws: null
},
binance: {
  id: 'binance',
  engName: 'Binance',
  korName: '바이낸스',
  displayCurrencyUnit: 'USDT',
  ws: {
    url: ''
  }
},
bitmex: {
  id: 'bitmex',
  engName: 'Bitmex',
  korName: '비트맥스',
  displayCurrencyUnit: 'USD',
  ws: {
    url: ''
  }
}

*/
