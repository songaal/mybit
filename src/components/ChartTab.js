import React, { Component } from 'react'
import { View, Text, WebView, Dimensions, Platform } from 'react-native'
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

        if (config.exchanges[this.props.exchange].isTvUDF) {
            this.webview.injectJavaScript(`
                document.getElementById('chartView')
                        .setAttribute('data-exchange', '${tvExchangeId}')
                new TradingView.widget({
                    fullscreen: true,
                    symbol: '${coin}/${base}',
                    interval: '60',
                    theme: "Dark",
                    container_id: "tv_chart_container",
                    datafeed: new Datafeeds.UDFCompatibleDatafeed("https://9u3jawxuod.execute-api.ap-northeast-2.amazonaws.com/v1_1"),
                    library_path: "charting_library/",
                    locale: "ko",
                    drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
                    disabled_features: ["use_localstorage_for_settings"],
                    enabled_features: ["study_templates"],
                    charts_storage_url: 'http://saveload.tradingview.com',
                    charts_storage_api_version: "1.1",
                    client_id: 'tradingview.com',
                    user_id: 'public_user_id'
                })
            `)
        } else {
            this.webview.injectJavaScript(`
                new TradingView.widget(
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
                )
            `)
        }
    }
    render() {
        if (config.exchanges[this.props.exchange].isTvUDF) {
            return <WebView ref={ref => (this.webview = ref)}
                source={require('./tradingview-udf.html')}
                scrollEnabled={false}
                onLoad={() => { this.injection() }}
                scalesPageToFit={Platform.select({
                    ios: true,
                    android: false,
                })} />
        } else {
            return <WebView ref={ref => (this.webview = ref)}
                source={require('./tradingview.html')}
                scrollEnabled={false}
                onLoad={() => { this.injection() }}
                scalesPageToFit={Platform.select({
                    ios: true,
                    android: false,
                })} />
        }
    }
}
