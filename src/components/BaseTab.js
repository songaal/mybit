import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native'
import {
  Tabs,
  List
} from 'antd-mobile-rn'
import Nexus from '@api/Nexus'

const { width, height } = Dimensions.get('window')

const Header = () => {
  return (
    <View style={{flexDirection: 'row',
                  marginVertical: 15,
                  marginHorizontal: 15
                }}>
      <View style={{width: (width / 4) - 15}}>
        <Text style={{textAlign: 'left'}}>코인명</Text>
      </View>
      <View style={{width: (width / 4)}}>
        <Text style={{textAlign: 'right'}}>가격</Text>
      </View>
      <View style={{width: (width / 4)}}>
        <Text style={{textAlign: 'right'}}>전일대비</Text>
      </View>
      <View style={{width: (width / 4) - 15}}>
        <Text style={{textAlign: 'right'}}>금일거래량</Text>
      </View>
    </View>
  )
}

export default class BaseTab extends Component {
  constructor(props) {
    super(props)
    const options = Nexus.getBaseList(props.exchange)
    this.cleanTickers = {}
    options.forEach(option => this.cleanTickers[option] = {})
    this.state = {
      options: options.map(base => ({id: base, title: base})),
      tickers: Object.assign({}, this.cleanTickers),
      selected: options[0]
    }
    this.updateState()
    Nexus.subscribeTicker(props.exchange, options[0], (ticker) => {
      this.cleanTickers[ticker.base][ticker.coin] = ticker
    })
  }
  updateState() {
    setTimeout(() => {
      const tickers = Object.assign(this.state.tickers, this.cleanTickers)
      this.setState({ tickers: tickers })
      this.updateState()
    }, 500)
  }
  handleSelected(id) {
    if (this.state.selected != id) {
      (async () => {
        Nexus.wsCloseAll()
        Nexus.subscribeTicker(this.props.exchange, id, (ticker) => {
          this.cleanTickers[ticker.base][ticker.coin] = ticker
        })
      })()
      this.setState({selected: id})
    }
  }
  render() {
    const tickers = Object.keys(this.state.tickers[this.state.selected])
    .map((coin, index) => {
      return (
        <List.Item key={index}>
          <View>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {}}>
              <View style={{width: (width / 4) - 15}}>
                  <Text style={{fontSize: 20}}>{coin}/{this.state.tickers[this.state.selected][coin].base}</Text>
              </View>
              <View style={{width: (width / 4)}}>
                <Text style={{textAlign:'right'}}>{'--'}</Text>
              </View>
              <View style={{width: (width / 4)}}>
                <Text style={[{textAlign:'right'}]}>{1}%</Text>
              </View>
              <View style={{width: (width / 4) - 15}}>
                <Text style={{textAlign:'right'}}>{1}백만</Text>
              </View>
            </TouchableOpacity>
          </View>
        </List.Item>
      )
    })

    return (
      <Tabs
        tabs={this.state.options}
        onChange={(tab) => this.handleSelected(tab.id)}>
        
        <View style={{marginBottom: 50}}>
          <Header/>
          <ScrollView>
            <List>
              {tickers}
            </List>
          </ScrollView>
        </View>

      </Tabs>
    )
  }
}
