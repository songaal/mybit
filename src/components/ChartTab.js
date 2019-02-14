import React, { Component } from 'react'
import { View, Text, WebView } from 'react-native'

const chartHTML = require('~/htmls/tradingview.html')

export default class ChartTab extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return <WebView source={chartHTML} style={{flex: 1}}/>
    }
}
