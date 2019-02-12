import React from 'react'
import { config } from '~/Config'
import Nexus from '@api/Nexus'
import BaseTab from '@components/BaseTab'
import {
  Text,
  View,
  Dimensions,
  StyleSheet
} from 'react-native'
import { 
  TabView
} from 'react-native-tab-view'

const LazyPlaceholder = ({ route }) => (
  <View style={styles.scene}>
    <Text>Loading…</Text>
  </View>
);

export default class Exchange extends React.Component {
  constructor(props) {
    super(props)
    const options = config.getExchangeLabels()
    this.state = {
      index: 0,
      routes: options,
      loaded: [options[0].key]
    }
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
    });
  _renderScene = ({ route }) => {
    if (
      this.state.routes.indexOf(route) !== this.state.index &&
      !this.state.loaded.includes(route.key)
    ) {
      return <LazyPlaceholder route={route} />
    }
    return <BaseTab exchange={route.key} />
  };

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