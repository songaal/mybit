import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TabView } from 'react-native-tab-view'
import OrderTab from '@components/OrderTab'
import ChartTab from '@components/ChartTab'
import OrderHistoryTab from '@components/OrderHistoryTab'
import Nexus from '@api/Nexus'

const options = [
  { key: 'order', title: '주문' },
  { key: 'chart', title: '차트' },
  { key: 'orderHistory', title: '주문내역' }
]

export default class CoinDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    let exchangeKr = navigation.getParam('exchangeKr', '')
    let companyName = navigation.getParam('companyName', '')
    let coin = navigation.getParam('coin', '')
    let base = navigation.getParam('base', '')
    let coinKoName = Nexus.getCoinKoName(coin)
    return {
      // title: `${exchangeKr}/${coin}(${coinKoName})/${base}`
      headerTitle: (
        <View>
          <View>
            <Text style={{ textAlign: 'center', fontSize: 20 }}>
              {exchangeKr}
              <Text style={{ textAlign: 'center', fontSize: 12, color: 'gray' }}>
                {companyName}
              </Text>
            </Text>
          </View>
          <View>
            <Text style={{ textAlign: 'center' }}>
              {coin}{coinKoName ? '(' + coinKoName + ')' : ''}/{base}
            </Text>
          </View>
        </View>
      )
    }
  }
  constructor(props) {
    super(props)
    this._handleIndexChange = this._handleIndexChange.bind(this)
    this._renderScene = this._renderScene.bind(this)
    this.exchange = props.navigation.getParam('exchange')
    this.base = props.navigation.getParam('base')
    this.coin = props.navigation.getParam('coin')

    this.state = {
      index: 0,
      routes: options,
      loaded: [options[0].key]
    }
  }
  _handleIndexChange(index) {
    this.setState(state => {
      const { key } = state.routes[index]
      return {
        index,
        loaded: state.loaded.includes(key)
          ? state.loaded
          : [...state.loaded, key],
      }
    })
  }
  _renderScene = ({ route }) => {
    if (
      this.state.routes.indexOf(route) !== this.state.index
      // && !this.state.loaded.includes(route.key)
    ) {
      return <View></View>
    }
    switch (route.key) {
      case 'order': return <OrderTab exchange={this.exchange} base={this.base} coin={this.coin} key={route.key} />
      case 'chart': return <ChartTab exchange={this.exchange} base={this.base} coin={this.coin} key={route.key} />
      case 'orderHistory': return <OrderHistoryTab exchange={this.exchange} base={this.base} coin={this.coin} key={route.key} />
      default: return <View></View>
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          onIndexChange={this._handleIndexChange}
          animationEnabled={false}
          swipeEnabled={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});