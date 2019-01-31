import React, { Component } from 'react'
import store from '@redux/store'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import {
  Progress,
  Button,
  WhiteSpace,
  List
} from 'antd-mobile-rn'

const { width, height } = Dimensions.get('window')

const Header = () => {
  return (
    <View style={{flexDirection: 'row',
                  marginTop: 15,
                  marginBottom: 15,
                  marginLeft: 10,
                  marginRight: 10
                }}>
      <View style={{width: (width / 4) - 10}}>
        <Text style={{textAlign: 'left'}}>코인명</Text>
      </View>
      <View style={{width: (width / 4)}}>
        <Text style={{textAlign: 'right'}}>가격</Text>
      </View>
      <View style={{width: (width / 4)}}>
        <Text style={{textAlign: 'right'}}>전일대비</Text>
      </View>
      <View style={{width: (width / 4) - 10}}>
        <Text style={{textAlign: 'right'}}>금일거래량</Text>
      </View>
    </View>
  )
}

const Coin = (coin, base, tradePrice=0, signedChangeRate=0, accTradeVolume=0) => {
  return (
    <List.Item key={coin}>
    <View style={{}}>
      <TouchableOpacity style={{flexDirection: 'row'}}>
        <View style={{width: (width / 4) - 15}}>
            <Text style={{fontSize: 20}}>{coin}</Text>
        </View>
        <View style={{width: (width / 4)}}>
          <Text style={{textAlign:'right'}}>{tradePrice.toFixed(2)}</Text>
        </View>
        <View style={{width: (width / 4)}}>
          <Text style={{textAlign:'right'}}>{(signedChangeRate * 100).toFixed(2)}%</Text>
        </View>
        <View style={{width: (width / 4) - 15}}>
          <Text style={{textAlign:'right'}}>{(accTradeVolume / 1000000).toFixed(2)}백만</Text>
        </View>
      </TouchableOpacity>
    </View>
    </List.Item>
  )
}

export default class MarketTicker extends Component {
  constructor(props) {
    super(props)
    this.updateState = this.updateState.bind(this)
    this.state = {
      subscribe: store.getState(),
      unsubscribe: store.subscribe(this.updateState)
    }
  }
  componentWillUnmount() {
    this.state.unsubscribe()
  }
  updateState() {
    this.setState({
      subscribe: store.getState()
    })
  }
  render() {
    const coinList = Object.values(this.state.subscribe.exchanges[this.props.exchange][this.props.base])
                           .map((coin, index) => {
      if (coin.ticker === undefined) {
        return Coin(coin.coin, coin.base)
      } else {
        return Coin(coin.coin, coin.base, coin.ticker.tradePrice, coin.ticker.signedChangeRate, coin.ticker.accTradeVolume)
      }
    })
    console.log('refresh')
    return (
      <View style={{marginBottom: 100}}>
        <Header/>
        <ScrollView style={{}}>
          <List>
            {coinList}
          </List>
        </ScrollView>
      </View>
    )
  }

}
