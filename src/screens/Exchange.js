import React from 'react'
import { config } from '~/Config'
import {
  Text,
  ScrollView
} from 'react-native'
import {
  TabBar,
  Tabs
} from 'antd-mobile-rn'
import BaseTab from '@components/BaseTab'

export default class Exchange extends React.Component {
  constructor(props) {
    super(props)
    const exchanges = Object.values(config.exchanges).map(exchange => {
      return { exchange: exchange.id, title: exchange.korName }
    })
    this.state = {
      exchangeTabs: exchanges,
      exchange: exchanges[0]['exchange']
    }
  }
  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <Tabs tabs={this.state.exchangeTabs}
              tabBarPosition="top"
              initialPage={0}
              onChange={(tab) => {this.setState({exchange: tab.exchange})}}>
            <BaseTab exchange={this.state.exchange} />
        </Tabs>
      </ScrollView>
    )
  }
}
