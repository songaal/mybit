import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import {
  TabBar
} from 'antd-mobile-rn'
import Exchange from '@screens/Exchange'
import Strategy from '@screens/Strategy'
import InvestHistory from '@screens/InvestHistory'
import Account from '@screens/Account'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'Exchange' // default
    }
    this.onChangeTab = this.onChangeTab.bind(this)
  }
  onChangeTab(selectedTab) {
    this.setState({
      selectedTab: selectedTab,
    })
  }
  render() {
    return (
      <TabBar unselectedTintColor="#949494"
              tintColor="#33A3F4"
              barTintColor="#f5f5f5">
        <TabBar.Item title="거래소"
                     selected={this.state.selectedTab === 'Exchange'}
                     onPress={() => this.onChangeTab('Exchange')}>
          <Exchange />
        </TabBar.Item>
        <TabBar.Item title="전략"
                     selected={this.state.selectedTab === 'Strategy'}
                     onPress={() => this.onChangeTab('Strategy')}>
          <Strategy />
        </TabBar.Item>
        <TabBar.Item title="투자내역"
                     selected={this.state.selectedTab === 'InvestHistory'}
                     onPress={() => this.onChangeTab('InvestHistory')}>
          <InvestHistory />
        </TabBar.Item>
        <TabBar.Item title="마이페이지"
                     selected={this.state.selectedTab === 'Account'}
                     onPress={() => this.onChangeTab('Account')}>
          <Account />
        </TabBar.Item>
      </TabBar>
    )
  }
}
