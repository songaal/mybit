import React, { Component } from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'
import Nexus from '@api/Nexus'
import Ticker from '@components/Ticker'

const { width, height } = Dimensions.get('window')

export default class BaseTab extends Component {
  constructor(props) {
    super(props)
    this.token = props.token
    const options = Object.keys(Nexus.getMarketKeyMap(props.exchange))
    .map(base => ({key: base, title: base}))
    this.state = {
      index: 0,
      routes: options,
      loaded: [options[0].key]
    }
    this._renderScene = this._renderScene.bind(this)
    this._handleIndexChange = this._handleIndexChange.bind(this)
  }
  _handleIndexChange = index =>
    this.setState(state => {
      const { key } = state.routes[index]
      return {
        index,
        loaded: state.loaded.includes(key)
          ? state.loaded
          : [...state.loaded, key],
      };
    })
  _renderScene = ({ route }) => {
    if (
      this.state.routes.indexOf(route) !== this.state.index &&
      !this.state.loaded.includes(route.key)
    ) {
      return null
    }

    return (
      <View>
        <View style={{height: 30}}>
            <View style={{
              flex: 1, 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 0.5,
              borderBottomCOlor: 'gray'}}>
                <Text style={{marginLeft: 10, textAlign: 'left'}}>코인명</Text>
                <Text style={{marginLeft: 50, textAlign: 'right'}}>가격</Text>
                <Text style={{marginLeft: -10, textAlign: 'right'}}>전일대비</Text>
                <Text style={{marginRight: 10, textAlign: 'right'}}>거래량</Text>
            </View>
        </View>
        <View style={{marginBottom: 60}}>
          <Ticker
            exchange={this.props.exchange} 
            base={route.key} 
            index={this.state.index} 
            navigation={this.props.navigation}
            token={this.props.token}/>
        </View>
      </View>
    )
  }
  _renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />
  )
  render() {
    return (
      <TabView
          style={this.props.style}
          navigationState={this.state}
          renderScene={this._renderScene}
          onIndexChange={this._handleIndexChange}
          renderTabBar={this._renderTabBar}
        />
    )
  }
}

// const styles = StyleSheet.create({
//   scene: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
const styles = StyleSheet.create({
  tabbar: {
    // backgroundColor: '#3f51b5',
  },
  tab: {
    width: 105,
  },
  indicator: {
    // backgroundColor: '#aee5dd',
  },
  label: {
    fontWeight: '400',
  },
});