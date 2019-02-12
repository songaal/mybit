import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
  FlatList
} from 'react-native'
import { 
  TabView
} from 'react-native-tab-view'
import Nexus from '@api/Nexus'
import Utils from '~/Utils'
import Ticker from '@components/Ticker'

const { width, height } = Dimensions.get('window')

const LazyPlaceholder = ({ route }) => (
  <View style={styles.scene}>
    <Text>Loading…</Text>
  </View>
);

export default class BaseTab extends Component {
  constructor(props) {
    super(props)
    this.updateTicker = this.updateTicker.bind(this)
    this.handleSelected = this.handleSelected.bind(this)
    this.goCoinDetail = this.goCoinDetail.bind(this)
    this._renderScene = this._renderScene.bind(this)
    this._handleIndexChange = this._handleIndexChange.bind(this)
    this.updateText = this.updateText.bind(this)
    this.cleanTickers = {}

    const options = Nexus.getBaseList(props.exchange)
    .map(base => ({key: base, title: base}))
    this.state = {
      index: 0,
      routes: options,
      loaded: [options[0].key],
      tickers: {},
      aa: 1
    }
    this.updateText()
  }
  updateText() {
    setInterval(() => {
      let text = (Math.random() * 99999999)
      console.log(text)
        this.setState( prevState => ({
          aa: text
      }))
    }, 10)
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
    return (<Ticker exchange={this.props.exchange} base={route.key} text={this.state.aa}/>)
  };
  updateTicker(ticker) {
    if (this.cleanTickers[ticker.base] === undefined) {
      this.cleanTickers[ticker.base] = {}
    }
    this.cleanTickers[ticker.base][ticker.coin] = ticker
  }
  handleSelected(id) {
    Nexus.wsCloseAll()
    this.setState({selected: id})
    Nexus.subscribeTicker(this.props.exchange, id, this.updateTicker)
  }
  goCoinDetail(exchange, base, coin) {
    Nexus.wsCloseAll()
    let params = {
      exchange: exchange,
      base: base,
      coin: coin
    }
    this.props.navigation.navigate('coinDetail', params)
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          onIndexChange={this._handleIndexChange}
        />
      </View>
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