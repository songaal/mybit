
/*
 * markets
 * data structure
 */

export default exchangeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      // 거래소 데이터 프레임 초기화.
      state[action.exchange] = action.dataSheets
      return state
    case 'FETCH_TICKER':
      state[action.exchange][action.base][action.coin]['ticker'] = action.ticker
      return state
    default:
      // 잘못된 액션은 이전 상태 유지.
      return state
  }
}
