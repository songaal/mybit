/*
 * 액션은 UI 또는 이벤트 호출할수있게 정의하는 영역
*/
export const initAction = (exchange, dataSheets) => {
  const action = {
    type: 'INITIALIZE',
    exchange: exchange,
    dataSheets: dataSheets
  }
  return action
}

export const fetchTickerAction = (exchange, base, coin, ticker) => {
  const action = {
    type: 'FETCH_TICKER',
    exchange: exchange,
    base: base,
    coin: coin,
    ticker: ticker
  }
  return action
}
