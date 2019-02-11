import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native'

import Nexus from '@api/Nexus'
import Utils from '~/Utils'

const { width, height } = Dimensions.get('window')

export default class BaseTab extends Component {
  constructor(props) {
    super(props)
    this.cleanTickers = {}
    this.state = {
      selected: null,
      tickers: Object.assign({}, this.cleanTickers),
      doExpensiveRender: false
    }
    this.updateTicker = this.updateTicker.bind(this)
    this.handleSelected = this.handleSelected.bind(this)
    this.goCoinDetail = this.goCoinDetail.bind(this)
  }
  updateTicker(ticker) {
    if (this.cleanTickers[ticker.base] === undefined) {
      this.cleanTickers[ticker.base] = {}
    }
    this.cleanTickers[ticker.base][ticker.coin] = ticker
  }
  handleSelected(id) {
    Nexus.wsCloseAll()
    this.setState({selected: id})
    Nexus.subscribeTicker(this.props.exchange, id, this.updateTicker)
  }
  goCoinDetail(exchange, base, coin) {
    Nexus.wsCloseAll()
    let params = {
      exchange: exchange,
      base: base,
      coin: coin
    }
    this.props.navigation.navigate('coinDetail', params)
  }
  render() {
    return (
      <View></View>
    )
  }
}
