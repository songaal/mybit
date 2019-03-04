import React from 'react'
import { View, Text, SafeAreaView, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

export default class Strategy extends React.Component {
  render() {
    return (
      <SafeAreaView>
        <Text style={{
          marginTop: 30,
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          전략
        </Text>
        <View style={{
        }}>
          <Text>H전략: 빗썸/비트코인</Text>
          <View style={{
            width: 100
          }}>

          </View>
        </View>
      </SafeAreaView>
    )
  }
}
