
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
    case 'FETCH_STATE':
      return action.newState
    default:
      // 잘못된 액션은 이전 상태 유지.
      console.log('[잘못된 액션!]', action)
      return state
  }
}
