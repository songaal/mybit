import React from 'react'
import { View, Text, SafeAreaView, AsyncStorage, Dimensions, ScrollView } from 'react-native'
import { config } from '~/Config'
import ccxt from 'ccxt'
import Card from '@components/Card'
import Nexus from '@api/Nexus'
import { exchangeKeyId } from '@constants/StorageKey'

const balanceList = (exchange, data) => {
  List = Object.keys(data).map(key => {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, color: 'gray' }}>보유 {key}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, color: 'black', textAlign: 'right' }}>{data[key]['total']}</Text>
        </View>
      </View>
    )
  })
  return (
    <Card style={{ marginTop: 30 }}>
      <View key="header">
        <Text style={{ fontSize: 18 }}> {exchange}</Text>
      </View>
      <View key="body">
        {List}
      </View>
    </Card>
  )
}



export default class InvestHistory extends React.Component {
  constructor(props) {
    super(props)
    this._balances = {}
    this.fetchBalance()
    this.state = {

    }
  }
  fetchBalance = async () => {
    const exchangeKeys = await AsyncStorage.getItem(exchangeKeyId)
    if (exchangeKeys == null) {
      return false
    }
    exObj = JSON.parse(exchangeKeys)
    Object.keys(exObj).forEach(key => {
      (async () => {
        let accessKey = exObj[key]['active']['accessKey']
        let secretKey = exObj[key]['active']['secretKey']
        let b = await Nexus.getBalance(key, accessKey, secretKey)
        // this._balances[key] = b['data']
        console.log(b['data'])
      })()

    })

  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>투자내역</Text>
        <ScrollView>


        </ScrollView>

      </SafeAreaView>
    )
  }
}
