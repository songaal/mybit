import React, { Component } from 'react'
import { View, Text, WebView } from 'react-native'

export default class DynamicWebView extends Component {
  static navigationOptions = ({ navigation }) => {
    let title = navigation.getParam('title', '')
    return {
      title: title
    }
  }
  render() {
    const uri = this.props.navigation.getParam('uri')
    return (
      <WebView source={{ uri: uri }} style={{ flex: 1 }} />
    )
  }
}