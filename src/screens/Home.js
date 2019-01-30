import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import {
  TabBar
} from 'antd-mobile-rn'
import Exchange from '@screens/Exchange'
import Assets from '@screens/Assets'
import Chart from '@screens/Chart'
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
        <TabBar.Item title="차트"
                     selected={this.state.selectedTab === 'Chart'}
                     onPress={() => this.onChangeTab('Chart')}>
          <Chart />
        </TabBar.Item>
        <TabBar.Item title="자산관리"
                     selected={this.state.selectedTab === 'Assets'}
                     onPress={() => this.onChangeTab('Assets')}>
          <Assets />
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
