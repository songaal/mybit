import React, { Component } from 'react'
import store from '@redux/store'
import { config } from '~/Config'
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native'
import '@api/index'
import Container from '~/containers/Container'

////////////////////////////////////////////////
// 디바이스 정보 로그.
////////////////////////////////////////////////

const {width, height} = Dimensions.get('window')
console.log('----------------------------')
console.log('Device OS: ', Platform.OS)
console.log('Device Width: ', width)
console.log('Device Height: ', height)
console.log('----------------------------')

export default class App extends Component {
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
    let totalCont = Object.keys(config.exchanges).length
    let runCount = Object.keys(this.state.subscribe.exchanges).length
    if (totalCont != runCount) {
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
        <Container />
      </SafeAreaView>
    )
  }

}
