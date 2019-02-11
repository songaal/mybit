import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native'
 
const tabs = [
  {id: 'order', title: '주문'},
  {id: 'chart', title: '차트'},
  {id: 'history', title: '나의 주문'}
]

export default class CoinDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'order'
    }
  }
  handleChange(id) {
    this.setState({ selected: id })
  }
  render() {
    return (
      <View></View>
    )
  }
}
