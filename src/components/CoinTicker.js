import React, { Component } from 'react'
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import {
  List
} from 'antd-mobile-rn'
const { width, height } = Dimensions.get('window')

export default class CoinTicker extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  goOrderBook(navigation, coin) {
    let params = {
      exchange: coin.exchange,
      base: coin.base,
      coin: coin.coin
    }
    navigation.navigate('coinDetail', params)
  }
  render() {
    const coin = this.props.coin
    if (coin.ticker === undefined) {
      return (
        <View>
          <Text>로딩 중...</Text>
        </View>
      )
    }
    let changeRateText = {
      color: 'black'
    }
    if (coin.ticker.changeRate > 0) {
      changeRateText['color'] = 'green'
    } else {
      changeRateText['color'] = 'red'
    }
    return (
      <View>
        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {this.goOrderBook(this.props.navigation, coin)}}>
          <View style={{width: (width / 4) - 15}}>
              <Text style={{fontSize: 20}}>{coin.coin}</Text>
          </View>
          <View style={{width: (width / 4)}}>
            <Text style={{textAlign:'right'}}>{coin.ticker.tradePrice || '--'}</Text>
          </View>
          <View style={{width: (width / 4)}}>
            <Text style={[changeRateText, {textAlign:'right'}]}>{(coin.ticker.changeRate * 100).toFixed(2)}%</Text>
          </View>
          <View style={{width: (width / 4) - 15}}>
            <Text style={{textAlign:'right'}}>{(coin.ticker.tradeVolume / 1000000).toFixed(2)}백만</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

}
