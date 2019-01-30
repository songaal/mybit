import React from 'react'
import { View, Text } from 'react-native'
import Home from '@screens/Home'
import '@api/index'
import store from '@redux/store'
/* app은 앱 준비 단계로 사용.
 * 거래소, 마켓 로딩 완료시 화면 표시.
*/

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.updateState = this.updateState.bind(this)
    this.state = {
      subscribe: store.getState(),
      unsubscribe: store.subscribe(this.updateState)
    }
  }
  componentWillUnmount() {
    this.state.unsubscribe()
  }
  updateState() {
    this.setState({
      subscribe: store.getState()
    })
  }
  render() {
    return (
      <View>
        <Home />
      </View>
    )
  }
}
