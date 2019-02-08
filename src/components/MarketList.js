import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import {
  Progress,
  Button,
  WhiteSpace,
  List
} from 'antd-mobile-rn'
import Nexus from '@api/Nexus'

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
    // let coinList = {}
    // Nexus.getCoinList(this.props.exchange, this.props.base)
    // .forEach(coin => { coinList[coin] = {} })
    this.state = {
      tickers: {}
    }
    Nexus.wsCloseAll()
    this.cleanTickers = {}
    Nexus.subscribeTicker(props.exchange, props.base, ticker => {
      this.cleanTickers[ticker.coin] = ticker
    })
    this.updateState = this.updateState.bind(this)
    this.updateState()
  }
  componentWillReceiveProps(props) {
    Nexus.wsCloseAll()
    this.setState({tickers: {}})
    this.cleanTickers = {}
    Nexus.subscribeTicker(props.exchange, props.base, ticker => {
      this.cleanTickers[ticker.coin] = ticker
    })
  }
  updateState() {
    setTimeout(() => {
      const tickers = Object.assign(this.state.tickers, this.cleanTickers)
      this.setState({ tickers: tickers })
      this.updateState()
    }, 2000)
  }
  render() {
    console.log('r', this.props.base)
    const tickers = Object.keys(this.state.tickers)
    .map((coin, index) => {
      return (
        <List.Item key={index}>
          <View>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {}}>
              <View style={{width: (width / 4) - 15}}>
                  <Text style={{fontSize: 20}}>{coin}/{this.state.tickers[coin].base}</Text>
              </View>
              <View style={{width: (width / 4)}}>
                <Text style={{textAlign:'right'}}>{'--'}</Text>
              </View>
              <View style={{width: (width / 4)}}>
                <Text style={[{textAlign:'right'}]}>{1}%</Text>
              </View>
              <View style={{width: (width / 4) - 15}}>
                <Text style={{textAlign:'right'}}>{1}백만</Text>
              </View>
            </TouchableOpacity>
          </View>
        </List.Item>
      )
    })
    
    return (
      <View style={{marginBottom: 50}}>
        <Header/>
        <ScrollView>
          <List>
            {tickers}
          </List>
        </ScrollView>
      </View>
    )
  }

}
