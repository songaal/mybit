import React from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native'
import { config } from '~/Config'
import '@api/index'
import Home from '@screens/Home'
import store from '@redux/store'
import { Navigation } from 'react-native-navigation'
import { registerScreens } from '~/registerScreens'
/* app은 앱 준비 단계로 사용.
 * 거래소, 마켓 로딩 완료시 화면 표시.
*/

registerScreens()

Navigation.events().registerAppLaunchedListener(() => {
Navigation.setRoot({
  root: {
    component: {
      name: 'App'
    }
  }
})
})

console.log('----------------------------')
console.log('Device OS: ', Platform.OS)
console.log('Device Width: ', Dimensions.get('window').width)
console.log('Device Height: ', Dimensions.get('window').height)
console.log('----------------------------')

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
        <View style={{flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center'}}>
          <Text>로딩 중...</Text>
        </View>
      )
    }
    this.state.unsubscribe()

    return (
      <SafeAreaView style={{flex: 1}}>
        <Home/>
      </SafeAreaView>
    )
  }
}
