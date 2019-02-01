import React, { Component } from 'react'
import MarketList from '@components/MarketList'
import store from '@redux/store'
import {
  View
} from 'react-native'
import {
  Tabs
} from 'antd-mobile-rn'

export default class BaseTab extends Component {
  constructor(props) {
    super(props)
    // 스토어에서 한번만 조회해서 베이스코인들을 나열한다.
    const baseList = Object.keys(store.getState().exchanges[this.props.exchange])
                           .map(base => {
      return { title: base }
    })
    this.state = {
      baseList: baseList,
      base: baseList[0].title // 기본값은 리스트 처음 베이스로 선택.
    }
  }
  render() {
    return (
      <Tabs tabs={this.state.baseList}
            tabBarPosition="top"
            initialPage={0}
            onChange={(tab) => {this.setState({base: tab.title})}}>
        <MarketList exchange={this.props.exchange}
                    base={this.state.base} />
      </Tabs>
    )
  }
}
