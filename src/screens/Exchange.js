import React from 'react'
import { config } from '~/Config'
import Nexus from '@api/Nexus'
import BaseTab from '@components/BaseTab'
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  SafeAreaView
} from 'react-native'
import { 
  TabView
} from 'react-native-tab-view'


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
  }
  _renderScene = ({ route }) => {
    if (
      this.state.routes.indexOf(route) !== this.state.index &&
      !this.state.loaded.includes(route.key)
    ) {
      return null
    }
    return <BaseTab exchange={route.key} navigation={this.props.navigation}/>
  }
  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        onIndexChange={this._handleIndexChange}
      />
    )
  }
}
const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});