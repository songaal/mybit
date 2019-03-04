import Nexus from '@api/Nexus';
import { exchangeKeyId } from '@constants/StorageKey';
import numeral from 'numeral';
import React, { Component } from 'react';
import { AsyncStorage, Dimensions, FlatList, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const { width, height } = Dimensions.get('window')

const viewType = {
    buy: true,
    sell: false
}

export default class OrderTab extends Component {
    constructor(props) {
        super(props)
        this.isScrollTo = true
        this.isConnect = true
        this._fetchBalance = this._fetchBalance.bind(this)
        this._invalidKey = false
        this.state = {
            units: [],
            viewType: viewType.buy, //default view type
            orderType: 'market',
            orderTypes: [
                {
                    label: '시장가',
                    value: 'market',
                },
                {
                    label: '지정가',
                    value: 'limit',
                },
            ],
            price: 0,
            limitPrice: 0,
            quantity: 1,
            enableScrollViewScroll: true,
            base: 0,
            coin: 0
        }
    }
    updateOrderbook() {
        try {
            const priceInfo = Nexus.getPriceInfo(this.props.exchange)
            const orderbook = priceInfo[this.props.base][this.props.coin]['orderbook']
            if (this.isConnect && orderbook) {
                this.setState({
                    units: orderbook['units'] || []
                })
            }
        } catch (error) {
            console.log('오더북 상태 저장 실패.', error)
        }
        this._interval = setTimeout(() => {
            this.updateOrderbook()
        }, 500)
    }
    _fetchBalance = async () => {
        if (this.isConnect === false) {
            return false
        }
        try {
            let exchangeKeys = await AsyncStorage.getItem(exchangeKeyId)
            if (exchangeKeys === null || exchangeKeys === undefined) {
                this._invalidKey = true
                return false
            }
            exchangeKey = JSON.parse(exchangeKeys)[this.props.exchange]
            if (exchangeKey === undefined || exchangeKey === null) {
                this._invalidKey = true
                return false
            }
            let accessKey = exchangeKey['active']['accessKey']
            let secretKey = exchangeKey['active']['secretKey']
            let exchange = this.props.exchange
            let base = this.props.base
            let coin = this.props.coin
            let balance = await Nexus.getBalance(exchange, accessKey, secretKey)
            if (this.isConnect && balance['status'] == 'success') {
                this.setState({
                    base: numeral(balance['data'][base]['total'] || 0).format('0,0[.]00000000'),
                    coin: numeral(balance['data'][coin]['total'] || 0).format('0,0[.]00000000')
                })
                this._invalidKey = false
            }
        } catch (error) {
            console.log('밸런스 조회 실패.. 1초뒤 재시도합니다.')
        }
        this._interval = setTimeout(() => {
            this._fetchBalance()
        }, 1000)
    }
    componentWillMount() {
        // 오더북 연결
        this.isConnect = true
        const exchange = this.props.exchange
        const base = this.props.base
        const coin = this.props.coin
        this.updateOrderbook()
        Nexus.runOrderbook(exchange, base, coin)
        this._fetchBalance()
    }
    componentWillUpdate() {
        if (this.refs['orderbook'] !== undefined
            && this.isScrollTo
            && this.state.units.length > 0) {
            this.isScrollTo = false
            let y = (this.state.units.length / 2) * 20
            this.refs['orderbook'].scrollToOffset({ animated: false, offset: y })
        }
    }
    componentWillUnmount() {
        // 오더북 종료
        try {
            this.isConnect = false
            Nexus.close(this.props.exchange, 'orderbook')
            clearTimeout(this._interval)
            Nexus.runTicker(this.props.exchange, this.props.base)
            if (this._interval !== undefined) {
                clearTimeout(this._interval)
                this._interval = undefined
            }
        } catch (error) {
            console.log('인터벌 종료 중 에러 발생..')
        }
    }
    onEnableScroll(value) {
        this.setState({
            enableScrollViewScroll: value,
        })
    }
    order = async () => {
        let exchangeKeys = await AsyncStorage.getItem(exchangeKeyId)
        if (exchangeKeys === null || exchangeKeys === undefined) {
            alert('거래소키를 등록하세요.')
            return false
        }
        exchangeKey = JSON.parse(exchangeKeys)[this.props.exchange]
        if (exchangeKey === undefined || exchangeKey === null) {
            alert('거래소키를 등록하세요.')
            return false
        }
        if (this.state.orderType === null) {
            alert('주문방식을 선택하세요.')
            return false
        }
        if (this.state.quantity == 0) {
            alert('수량을 입력하세요.')
            return false
        }
        let exchange = this.props.exchange
        let base = this.props.base
        let coin = this.props.coin
        let accessKey = exchangeKey['active']['accessKey']
        let secretKey = exchangeKey['active']['secretKey']

        let orderCfg = {
            coin: coin,
            base: base,
            time: new Date().getTime(),
            symbol: `${coin}/${base}`,
            type: this.state.orderType,
            side: this.state.viewType ? 'buy' : 'sell',
            amount: String(this.state.quantity).replace(/[^0-9.]/gi, ''),
            price: String(this.state.price).replace(/[^0-9]/gi, '')
        }

        // ///////////////////////////// TEST CODE
        // let orders = await AsyncStorage.getItem(`${accessKey}-${exchange}-${base}-${coin}`)
        // if (orders === null || orders === undefined) {
        //   orders = []
        // } else {
        //   orders = JSON.parse(orders)
        // }
        // if (orders.length >= 100) {
        //   orders = orders.splice(orders.length - 100)
        // }
        // if(orderCfg['type'] == 'market') {
        //     orderCfg['price'] = Math.random() * 99999
        // }
        // orders.push(orderCfg)
        // await AsyncStorage.setItem(`${accessKey}-${exchange}-${base}-${coin}`, JSON.stringify(orders))
        // alert('주문완료')
        // /////////////////////////////

        let order = await Nexus.createOrder(exchange, accessKey, secretKey, orderCfg)
        if (order['status'] === 'success') {
            alert('주문완료')
        } else {
            alert(order['message'])
        }
    }
    render() {
        // if (this.state.units.length == 0) {
        //     return null
        // }

        let InvalidKey = null
        if (this._invalidKey === true) {
            InvalidKey = <Text style={{
                color: 'red',
                fontSize: 14,
                textAlign: 'right'
            }}>* 거래소키를 등록하세요.</Text>
        }

        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                <ScrollView style={{ flex: 1, flexDirection: 'row' }}
                    ref="scroll"
                    scrollEnabled={this.state.enableScrollViewScroll}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <FlatList
                            ref="orderbook"
                            style={{ width: width / 2 }}
                            data={this.state.units}
                            initialNumToRender={10}
                            onEndReachedThreshold={1200}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{
                                        height: 40,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        backgroundColor: item.unit == 'ask' ? 'rgba(234,98,104,0.1)' : 'rgba(148,172,218,0.1)',
                                        paddingVertical: 10,
                                        paddingHorizontal: 10,
                                        borderBottomWidth: 0.5,
                                        borderBottomColor: '#bbb'
                                    }}
                                    onPress={(e) => {
                                        this.setState({
                                            price: item.price,
                                            limitPrice: item.price
                                        })
                                    }}
                                    onTouchStart={() => {
                                        this.onEnableScroll(false)
                                    }}
                                    onMomentumScrollEnd={() => {
                                        this.onEnableScroll(true)
                                    }}
                                >
                                    <Text style={{
                                        flex: 1.2,
                                        textAlign: 'right',
                                        fontSize: 12
                                    }}>{item.price}</Text>
                                    <Text style={{
                                        flex: 1,
                                        textAlign: 'right',
                                        fontSize: 8
                                    }}>{item.size}</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <ScrollView style={{ width: width / 2 - 20, marginHorizontal: 10 }}>

                            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        height: 50,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.viewType ? '#2743ce' : '#b7b3b3',
                                        marginRight: 5,
                                        borderRadius: 2
                                    }}
                                    onPress={(e) => {
                                        this.state.viewType = true
                                    }}>
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 20
                                    }}>구매</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        height: 50,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: !this.state.viewType ? '#e04323' : '#b7b3b3',
                                        marginLeft: 5,
                                        borderRadius: 2
                                    }}
                                    onPress={(e) => {
                                        this.state.viewType = false
                                    }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: 20
                                        }}>판매</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginTop: 40 }}>
                                <Text style={{ fontSize: 20, color: 'gray' }}>
                                    주문방식
                                </Text>
                                <RNPickerSelect
                                    useNativeAndroidPickerStyle={false}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 20,
                                            right: 10,
                                        }
                                    }}
                                    placeholder={{
                                        label: '선택하세요.',
                                        value: null,
                                    }}
                                    items={this.state.orderTypes}
                                    onValueChange={(value) => {
                                        this.setState({
                                            orderType: value,
                                        })
                                    }}
                                    value={this.state.orderType}
                                    Icon={() => {
                                        return (
                                            <View
                                                style={{
                                                    marginTop: 5,
                                                    backgroundColor: 'transparent',
                                                    borderTopWidth: 10,
                                                    borderTopColor: 'gray',
                                                    borderRightWidth: 10,
                                                    borderRightColor: 'transparent',
                                                    borderLeftWidth: 10,
                                                    borderLeftColor: 'transparent',
                                                    width: 0,
                                                    height: 0,
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: 20, color: 'gray' }}>수량</Text>
                                <TextInput
                                    style={defaultStyle.textInput}
                                    keyboardType='numeric'
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    value={String(this.state.quantity)}
                                    onChangeText={text => {
                                        this.setState({
                                            quantity: text.replace(/[^\d\.]/gi, '') || ''
                                        })
                                    }}
                                />
                                <Text style={{
                                    textAlign: 'right',
                                    color: 'gray',
                                    fontSize: 10
                                }}>
                                    {this.props.coin}: {this.state.coin}
                                </Text>
                                <Text style={{
                                    textAlign: 'right',
                                    color: 'gray',
                                    fontSize: 10
                                }}>
                                    {this.props.base}: {this.state.base}
                                </Text>
                            </View>
                            <View style={{
                                marginTop: 20,
                                display: this.state.orderType == 'limit' ? "flex" : "none"
                            }}>
                                <Text style={{ fontSize: 20, color: 'gray' }}>가격</Text>
                                <TextInput
                                    style={defaultStyle.textInput}
                                    keyboardType='numeric'
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    value={String(this.state.price)}
                                    onChangeText={text => {
                                        this.setState({
                                            price: text.replace(/[^\d\.]/gi, '') || ''
                                        })
                                    }}
                                    onFocus={(e) => {
                                        this.refs['scroll'].scrollTo({ y: 120 })
                                    }} />
                            </View>
                            {/* <View style={{ marginTop: 20, display: this.state.orderType == 'limit' ? 'flex' : 'none' }}>
                                <Text style={{ fontSize: 20, color: 'gray' }}>발동가격</Text>
                                <TextInput
                                    style={defaultStyle.textInput}
                                    keyboardType='numeric'
                                    autoCorrect={false}
                                    value={String(this.state.limitPrice)}
                                    onChangeText={text => {
                                        this.setState({
                                            limitPrice: text.replace(/[^\d\.]/gi, '') || ''
                                        })
                                    }}
                                    onFocus={(e) => {
                                        this.refs['scroll'].scrollTo({ y: 80 })
                                    }}
                                />
                            </View> */}
                            <View
                                style={{
                                    marginTop: 30,
                                    marginBottom: 30
                                }}>

                                {InvalidKey}

                                <TouchableOpacity
                                    onPress={() => this.order()}
                                    style={{
                                        display: this.state.viewType ? 'flex' : 'none',
                                        height: 50,
                                        backgroundColor: '#2743ce',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 3
                                    }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: 20,
                                        }}>
                                        구매하기
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.order()}
                                    color='#e04323'
                                    style={{
                                        display: !this.state.viewType ? 'flex' : 'none',
                                        height: 50,
                                        backgroundColor: '#e04323',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 3
                                    }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: 20,
                                        }}>
                                        판매하기
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginTop: 10,
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 2,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 2,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    }
})
const defaultStyle = StyleSheet.create({
    textInput: {
        marginTop: 10,
        fontSize: 16,
        height: 45,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 2,
        color: 'black'
    }
})