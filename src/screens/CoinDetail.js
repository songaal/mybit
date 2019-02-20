import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TabView } from 'react-native-tab-view'
import OrderTab from '@components/OrderTab'
import ChartTab from '@components/ChartTab'
import OrderHistoryTab from '@components/OrderHistoryTab'

const options = [
  { key: 'order', title: '주문' },
  { key: 'chart', title: '차트' },
  // { key: 'orderHistory', title: '주문내역' }
]

export default class CoinDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    let coin = navigation.getParam('coin', '')
    let base = navigation.getParam('base', '')
    return {
      title: `${coin}/${base}`
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
      this.state.routes.indexOf(route) !== this.state.index &&
      !this.state.loaded.includes(route.key)
    ) {
      return null
    }
    switch (route.key) {
      case 'order': return <OrderTab exchange={this.exchange} base={this.base} coin={this.coin} />
      case 'chart': return <ChartTab exchange={this.exchange} base={this.base} coin={this.coin}></ChartTab>
      // case 'orderHistory': return <OrderHistoryTab exchange={this.exchange} base={this.base} coin={this.coin}></OrderHistoryTab>
      default: return null
    }
  }
  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        onIndexChange={this._handleIndexChange}
      />
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