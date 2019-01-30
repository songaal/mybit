import React from 'react'
import { View, Text } from 'react-native'
import { config } from '~/Config'
import '@api/index'
import Home from '@screens/Home'
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
      unsubscribe: store.subscribe(this.updateState),
      runTotal: Object.keys(config.exchanges).length
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
    let runCount = Object.keys(this.state.subscribe.exchanges).length
    if (this.state.runTotal != runCount) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>로딩 중...</Text>
        </View>
      )
    }
    return (
      <View>
        <Home />
      </View>
    )
  }
}
