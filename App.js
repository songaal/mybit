import React, { Component } from 'react'
import { Platform, Dimensions, View, Text, ScrollView } from 'react-native'
import Nexus from '@api/Nexus'
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
    this.state = {
      isReadyAPI: false
    }
    Nexus.checkMarket((isReady) => {
      this.setState({
        isReadyAPI: isReady
      })
    })
  }
  render() {
    if (!this.state.isReadyAPI) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading...</Text>
        </View>
      )
    }
    return <Container />
  }

}
