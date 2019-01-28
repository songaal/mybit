import MarketDispatcher from '@redux/dispatchers/MarketDispatcher'
/*
 * 액션은 UI 또는 이벤트 호출할수있게 정의하는 영역
*/
export const fetchMarkets = () => {
  const action = {
    type: 'FETCH_MARKETS'
  }
  MarketDispatcher.dispatch(action)
}
