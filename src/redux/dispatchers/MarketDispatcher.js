/*
 * 동기화 처리 및 스토어에 저장하는 영역
*/
class MarketDispatcher {
  constructor() {
    this.isDispatching = false
  }
  dispatch(action) {
    if (this.isDispatching) {
      throw new Error('Cannot dispatch in the middle of adispatch')
    }
    this.isDispatching = true

    // 액션을 스토어로 전달할 것

    this.isDispatching = false
  }
}

export default new MarketDispatcher()
