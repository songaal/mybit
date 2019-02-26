import Nexus from '@api/Nexus';
import BaseTab from '@components/BaseTab';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { config } from '~/Config';


export default class Exchange extends React.Component {
  constructor(props) {
    super(props)
    this._handleIndexChange = this._handleIndexChange.bind(this)
    this._renderScene = this._renderScene.bind(this)

    const options = config.getExchangeLabels()
    this.state = {
      index: 0,
      routes: options,
      loaded: [options[0].key]
    }
  }
  _handleIndexChange(index) {
    this.setState(state => {
      const { key } = state.routes[index]
      return {
        index,
        loaded: state.loaded.includes(key)
          ? state.loaded
          : [...state.loaded, key],
      }
    })
    // Nexus.closeAll()
  }
  _renderScene = ({ route }) => {
    if (this.state.routes.indexOf(route) !== this.state.index) {
      return <View></View>
    }
    return <BaseTab exchange={route.key}
      exchangeKr={route.title}
      navigation={this.props.navigation} />
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
        navigationState={this.state}
        renderScene={this._renderScene}
        onIndexChange={this._handleIndexChange}
        renderTabBar={this._renderTabBar}
      />
    )
  }
}
const styles = StyleSheet.create({
  tabbar: {
    // backgroundColor: '#3f51b5',
  },
  tab: {
    width: 100,
  },
  indicator: {
    // backgroundColor: '#aee5dd',
  },
  label: {
    fontWeight: '400',
  },
});