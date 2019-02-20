import React, { Component } from 'react'
import { View, WebView, Dimensions } from 'react-native'
import { config } from '~/Config'

const { width, height } = Dimensions.get('window')

export default class ChartTab extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    injection() {
        let tvExchangeId = config.exchanges[this.props.exchange]['tvExchangeId']
        if (tvExchangeId === undefined || tvExchangeId === null) {
            tvExchangeId = this.props.exchange.toUpperCase()
        }
        let coin = this.props.coin
        let base = this.props.base
        this.webview.injectJavaScript(
            `new TradingView.widget(
                {
                    "autosize": true,
                    "symbol": "${tvExchangeId}:${coin}${base}",
                    "interval": "60",
                    "timezone": "Asia/Seoul",
                    "theme": "Dark",
                    "style": "1",
                    "locale": "kr",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "withdateranges": true,
                    "hide_side_toolbar": false,
                    "allow_symbol_change": true,
                    "container_id": "tradingview_4aa41"
                }
            )`
        )
    }
    render() {
        return (
            <WebView ref={ref => (this.webview = ref)}
                source={require('~/resources/tradingview.html')}
                scrollEnabled={false}
                onLoad={() => { this.injection() }} />
        )
    }
}
