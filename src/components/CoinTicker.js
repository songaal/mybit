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
import Nexus from '@api/Nexus'

export default class CoinTicker extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  goCoinDetail(navigation, coin) {
    let params = {
      exchange: coin.exchange,
      base: coin.base,
      coin: coin.coin
    }
    navigation.navigate('coinDetail', params)
  }
  render() {
    const base = this.props.ticker.base
    const coin = this.props.ticker.coin
    const changeRate = this.props.ticker.changeRate
    const tradePrice = this.props.ticker.tradePrice
    const tradeVolume = this.props.ticker.tradeVolume
    
    let changeRateText = { color: 'black' }
    if (changeRate > 0) {
      changeRateText['color'] = 'green'
    } else if (changeRate < 0) {
      changeRateText['color'] = 'red'
    }
    return (
      <View>
        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {this.goCoinDetail(this.props.navigation, coin)}}>
          <View style={{width: (width / 4) - 15}}>
              <Text style={{fontSize: 20}}>{coin}</Text>
          </View>
          <View style={{width: (width / 4)}}>
            <Text style={{textAlign:'right'}}>{tradePrice || '--'}</Text>
          </View>
          <View style={{width: (width / 4)}}>
            <Text style={[changeRateText, {textAlign:'right'}]}>{(changeRate * 100).toFixed(2)}%</Text>
          </View>
          <View style={{width: (width / 4) - 15}}>
            <Text style={{textAlign:'right'}}>{(tradeVolume / 1000000).toFixed(2)}백만</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

}
