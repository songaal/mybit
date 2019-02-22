import React from 'react'
import { View, Text, SafeAreaView, AsyncStorage, Dimensions, ScrollView } from 'react-native'
import { config } from '~/Config'
import ccxt from 'ccxt'
import Card from '@components/Card'
import Nexus from '@api/Nexus'
import { exchangeKeyId } from '@constants/StorageKey'

const InvestCard = (title, data, prefixLabel = "보유") => {
  let List = Object.keys(data)
    .map(key => {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, color: 'gray' }}>
              {prefixLabel} {key}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, color: 'black', textAlign: 'right' }}>
              {data[key]} {key}
            </Text>
          </View>
        </View>
      )
    })
  return (
    <Card style={{ marginTop: 30 }}>
      <View key="header">
        <Text style={{ fontSize: 18 }}> {title}</Text>
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
    this._total = {}
    this._balances = {}
    this.fetchBalance()
    this.state = {
      total: null,
      balances: null
    }
  }
  fetchBalance = async () => {
    const exchangeKeys = await AsyncStorage.getItem(exchangeKeyId)
    if (exchangeKeys == null) {
      return false
    }
    exObj = JSON.parse(exchangeKeys)
    Object.keys(exObj).forEach(exchange => {
      (async () => {
        let accessKey = exObj[exchange]['active']['accessKey']
        let secretKey = exObj[exchange]['active']['secretKey']
        let totals = (await Nexus.getBalance(exchange, accessKey, secretKey))['data']['total']
        this._balances[exchange] = {}
        Object.keys(totals).forEach(coin => {
          if (totals[coin] && totals[coin] > 0) {
            if (this._total[coin] === undefined) {
              this._total[coin] = 0
            }
            this._total[coin] += totals[coin]
            this._balances[exchange][coin] = totals[coin]
          }
        })
        this.setState({
          total: this._total,
          balances: this._balances
        })
      })()
    })
  }
  render() {
    if (this.state.balances === null) {
      return false
    }
    let listTag = [InvestCard('합계', this.state.total, '총보유')]

    Object.keys(this.state.balances)
      .forEach(exchange => {
        let title = config.exchanges[exchange]['korName']
        listTag.push(InvestCard(title, this.state.balances[exchange]))
      })

    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{
          marginTop: 30,
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center'
        }}>투자내역</Text>
        <ScrollView>
          {listTag}
        </ScrollView>
      </SafeAreaView>
    )
  }
}
