import React, { Component } from 'react'
import MarketTicker from '@components/MarketTicker'
import store from '@redux/store'
import {
  View,
  Text,
  ScrollView
} from 'react-native'
import {
  Tabs,
  List
} from 'antd-mobile-rn'

export default class BaseTab extends Component {
  constructor(props) {
    super(props)
    const baseList = Object.keys(store.getState().exchanges[this.props.exchange])
                           .map(base => {
      return { title: base }
    })
    this.state = {
      baseList: baseList,
      base: baseList[0].title
    }
  }
  render() {
    return (
      <ScrollView>
        <Tabs tabs={this.state.baseList}
              tabBarPosition="top"
              initialPage={0}
              onChange={(tab) => {this.setState({base: tab.title})}}>
          <MarketTicker exchange={this.props.exchange}
                        base={this.state.base} />
        </Tabs>
      </ScrollView>
    )
  }
}
