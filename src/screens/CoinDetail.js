import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import {
  Progress,
  Button,
  WhiteSpace,
  List,
  Tabs
} from 'antd-mobile-rn'
import store from '@redux/store'
import OrderTab from '@components/OrderTab'
 
export default class CoinDetail extends Component {
  constructor(props) {
    super(props)
    const exchange = props.navigation.state.params.exchange
    const base = props.navigation.state.params.base
    const coin = props.navigation.state.params.coin
    this.updateState = this.updateState.bind(this)
    this.state = {
      subscribe: store.getState(),
      unsubscribe: store.subscribe(this.updateState),
      exchange: exchange,
      base: base,
      coin: coin,
      selectedTab: 'order'
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
  handleChange(tab) {
    this.setState({
      selectedTab: tab.id
    })
  }
  render() {
    const tabs = [{id: 'order', title: '주문'},
      {id: 'chart', title: '차트'},
      {id: 'history', title: '나의 주문'}
    ]
    let content = null
    switch (this.state.selectedTab) {
      case 'order':
        content = (<OrderTab {...this.props}/>)
        break;
      case 'chart':
        break;
      case 'history':
        break;

    }

    return (
      <Tabs
        tabs={tabs}
        tabBarPosition="top"
        initialPage={0}
        onChange={(tab) => {this.handleChange(tab)}}>
        {content}
      </Tabs>
    )
  }
}
