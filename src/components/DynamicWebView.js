import React, { Component } from 'react'
import { View, Text, WebView } from 'react-native'

export default class DynamicWebView extends Component {
    render() {
        return (
            <WebView url="https://naver.com" scrollEnabled={false} style={{flex: 1}}/>
        )
    }
}