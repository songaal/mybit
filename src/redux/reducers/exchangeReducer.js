
/*
 * 스토어에는 거래소의 베이스와 코인을 저장한다.
 * data structure
 * {
 *  upbit: {
 *    KRW: ['BTC', 'ETH' ... ],
 *    ...
 *  }
 * }
 */

export default exchangeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_EXCHANGE':
      return Object.assign(state, action.exchange)
  }
}
