
/*
 * markets
 * data structure
 */

export default exchangeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return Object.assign(state, {[action.exchange]: action.dataSheets})
    case 'FETCH_TICKER':
      return null
    default:
      return state
  }
}
