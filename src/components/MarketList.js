import React, { Component } from 'react'
import store from '@redux/store'
import {
  View,
  Text,
  ScrollView,
  Dimensions
} from 'react-native'
import {
  Progress,
  Button,
  WhiteSpace,
  List
} from 'antd-mobile-rn'
import CoinTicker from '@components/CoinTicker'

const { width, height } = Dimensions.get('window')

const Header = () => {
  return (
    <View style={{flexDirection: 'row',
                  marginVertical: 15,
                  marginHorizontal: 15
                }}>
      <View style={{width: (width / 4) - 15}}>
        <Text style={{textAlign: 'left'}}>코인명</Text>
      </View>
      <View style={{width: (width / 4)}}>
        <Text style={{textAlign: 'right'}}>가격</Text>
      </View>
      <View style={{width: (width / 4)}}>
        <Text style={{textAlign: 'right'}}>전일대비</Text>
      </View>
      <View style={{width: (width / 4) - 15}}>
        <Text style={{textAlign: 'right'}}>금일거래량</Text>
      </View>
    </View>
  )
}

export default class MarketList extends Component {
  constructor(props) {
    super(props)
    this.updateState = this.updateState.bind(this)
    this.state = {
      subscribe: store.getState(),
      unsubscribe: store.subscribe(this.updateState),
      exchange: props.exchange,
      base: props.base
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
  getCoinList(exchange, base) {
    return Object.values(this.state.subscribe.exchanges[exchange][base])
  }
  render() {
    const coinTickers = this.getCoinList(this.state.exchange, this.state.base)
                            .sort((c1, c2) => c1.coin >= c2.coin)
                            .map((coin, index) => {
      return (
        <List.Item key={index}>
          <CoinTicker coin={coin} {...this.props}/>
        </List.Item>
      )
    })
    return (
      <View style={{marginBottom: 50}}>
        <Header/>
        <ScrollView>
          <List>
            {coinTickers}
          </List>
        </ScrollView>
      </View>
    )
  }

}
