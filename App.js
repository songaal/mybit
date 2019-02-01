import React, { Component } from 'react'
import store from '@redux/store'
import { config } from '~/Config'
import {
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
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Container />
      </SafeAreaView>
    )
  }

}
