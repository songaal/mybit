import React, { Component } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet
} from 'react-native'
import Nexus from '@api/Nexus'

export default class Ticker extends Component {
    constructor(props) {
        super(props)
        const coinList = Nexus.getCoinList(props.exchange, props.base).map(coin => ({key: coin}))
        this.coins = {}
        this.state = {
            coinList: coinList,
            aa: 1
        }
    }
    componentWillUnmount() {
        // console.log('componentDidMount')
        // clearInterval(this.state.code)
    }
    renderTicker(coin) {
        console.log('renderTicker')
        return (
            <View>
                <Text ref={ref => {this.setState({[coin]: ref})}} style={styles.item}>{this.props.text}</Text>
            </View>
        )
    }
    render() {
        
        return (
            <View>
                <Text>{this.props.text}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 22
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
      textAlign: 'center'
    },
  })