import React from 'react'
import { config } from '~/Config'
import MarketSummary from '@components/MarketSummary'
import {
  View,
  Text,
  ScrollView
} from 'react-native'
import {
  Tabs,
  List
} from 'antd-mobile-rn'
const ccxt = require('ccxt')

const getExchangeMarkets = async (exchangeId) => {
  let exchange = new ccxt[exchangeId]()
  return await exchange.fetchMarkets()
}

export default class Exchange extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      baseCoinTabs: null,
      selectedBaseInfo: null
    }
    this._chagneExchange = this._chagneExchange.bind(this)
    this._chagneBaseCoins = this._chagneBaseCoins.bind(this)
    this._chagneExchange({id: 'upbit'})
  }
  _chagneExchange = async(exchangeInfo) => {
    let exchange = new ccxt[exchangeInfo.id]()
    let markets = await exchange.fetchMarkets()
    let baseCoins = {}
    markets.forEach(market => {
      baseCoins[market.quote] = {
        title: market.quote, 
        exchangeId: exchangeInfo.id,
        base: market.quote
      }
    })
    this.setState({
      selectedBaseInfo: Object.values(baseCoins)[0],
      baseCoinTabs: Object.values(baseCoins)
    })
  }
  _chagneBaseCoins(baseInfo) {
    this.setState({
      selectedBaseInfo: baseInfo
    })
  }
  render() {
    let BaseCoinTabs = null
    if (this.state.baseCoinTabs != null) {
      BaseCoinTabs = (
        <Tabs tabs={this.state.baseCoinTabs}
              tabBarPosition="top"
              initialPage={0}
              onChange={this._chagneBaseCoins}>
          <MarketSummary baseInfo={this.state.selectedBaseInfo} />
        </Tabs>
      )
    }
    return (
      <Tabs tabs={Object.values(config.exchanges).map(exchange => ({id: exchange.id, title: exchange.korName}))}
            tabBarPosition="top"
            initialPage={0}
            onChange={this._chagneExchange}>
        { BaseCoinTabs }
      </Tabs>
    )
  }
}
