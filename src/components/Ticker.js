import Nexus from '@api/Nexus';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { config } from '~/Config'
const { width, height } = Dimensions.get('window')

export default class Ticker extends React.PureComponent {
    constructor(props) {
        super(props)
        this.updateTicker = this.updateTicker.bind(this)
        this.getfilterTickers = this.getfilterTickers.bind(this)

        Nexus.runTicker(props.exchange, props.base)
        this.updateTicker()

        this.isConnect = true
        this.state = {
            tickers: this.getfilterTickers(props.exchange, props.base)
        }
    }
    goCoinDetail(exchange, base, coin) {
        Nexus.closeAll()
        this.props.navigation.navigate('coinDetail', {
            exchangeKr: this.props.exchangeKr,
            exchange: exchange,
            companyName: config.exchanges[exchange].companyName,
            base: base,
            coin: coin
        })
    }
    updateTicker() {
        this._interval = setTimeout(() => {
            const tickers = this.getfilterTickers(this.props.exchange, this.props.base)
            // TODO 변경사항에 있을때 highlight animate
            if (this.isConnect) {
                this.setState({
                    tickers: tickers
                })
            }
            this.updateTicker()
        }, 500)
    }
    getfilterTickers(exchange, base) {
        let tickers = Object.values(Nexus.getPriceInfo(exchange)[base])
        return tickers
    }
    componentWillUnmount() {
        this.isConnect = false
    }
    render() {
        if (this.state.tickers.length == 0) {
            return <View></View>
        }
        return (
            <FlatList
                data={this.state.tickers}
                initialNumToRender={10}
                onEndReachedThreshold={1200}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                        if (item.ticker && item.ticker.tradePrice != 0) {
                            this.goCoinDetail(this.props.exchange, this.props.base, item.ticker.coin)
                        } else {
                            alert('거래불가 코인입니다.')
                        }
                    }}
                        style={{
                            display: item.ticker && item.ticker.tradePrice != 0 ? 'flex' : 'none'
                        }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            height: 50,
                            borderBottomWidth: 0.5,
                            borderBottomColor: '#bbb',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginHorizontal: 10
                        }}>
                            <View>
                                <Text style={{ width: width / 4 - 30, fontSize: 14, textAlign: 'left' }}>
                                    {item.ticker ? item.ticker.coin : null}
                                </Text>
                                <Text style={{ width: width / 4 - 30, fontSize: 10, textAlign: 'left', color: 'gray', marginTop: 5 }}>
                                    {item.ticker ? Nexus.getCoinKoName(item.ticker.coin) : ''}
                                </Text>
                            </View>


                            <Text style={{
                                width: width / 4,
                                fontSize: 13,
                                textAlign: 'right'
                            }}>
                                {item.ticker ? item.ticker.tradePrice : null}
                            </Text>
                            <Text style={{
                                width: width / 4 - 30,
                                fontSize: 13,
                                textAlign: 'right',
                                color: item.ticker ? (Number(item.ticker.changeRate) > 0
                                    ? 'blue' : (Number(item.ticker.changeRate) < 0 ? 'red' : 'black')) : 'black'
                            }}>
                                {item.ticker ? item.ticker.changeRate + '%' : null}
                            </Text>
                            <Text style={{ width: width / 4 - 15, fontSize: 13, textAlign: 'right' }}>
                                {item.ticker ? item.ticker.tradeVolume : null}
                            </Text>
                            {/* <FontAwesomeIcon name="chevron-right" size={20} color="gray" /> */}
                        </View>
                    </TouchableOpacity>
                )}
            />
        )
    }
}