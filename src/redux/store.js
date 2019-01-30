import { combineReducers, createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise'
import exchangeReducer from '@redux/reducers/exchangeReducer'

// 리듀서 등록.
const reducer = combineReducers({
  exchanges: exchangeReducer
})

const middleware = applyMiddleware(promise)

export default store = createStore(reducer)
