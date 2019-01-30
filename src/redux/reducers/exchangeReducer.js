
/*
 * markets
 * data structure
 */

export default exchangeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return Object.assign(state, {[action.exchange]: action.dataSheets})
    case 'FETCH_TICKER':
      // 딥카피를 통해 이전 상태 유지.
      let dataSheets = Object.assign(state, {})
      dataSheets[action.exchange][action.base][action.coin]['ticker'] = action.ticker
      return dataSheets
    default:
      // 잘못된 액션은 이전 상태 유지.
      return state
  }
}
