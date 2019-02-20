import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Dimensions, Button } from 'react-native'
import Nexus from '@api/Nexus'
import RNPickerSelect from 'react-native-picker-select'

const { width, height } = Dimensions.get('window')

const viewType = {
    buy: true,
    sell: false
}

export default class OrderTab extends Component {
    constructor(props) {
        super(props)

        this.isScrollTo = true
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
            enableScrollViewScroll: true
        }
    }
    updateOrderbook() {
        this._interval = setTimeout(() => {
            const priceInfo = Nexus.getPriceInfo(this.props.exchange)
            const orderbook = priceInfo[this.props.base][this.props.coin]['orderbook']
            if (orderbook) {
                this.setState({
                    units: orderbook['units'] || []
                })
            }
            this.updateOrderbook()
        }, 200)
    }
    componentWillMount() {
        // 오더북 연결
        const exchange = this.props.exchange
        const base = this.props.base
        const coin = this.props.coin
        Nexus.runOrderbook(exchange, base, coin)
        this.updateOrderbook()
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
        Nexus.close(this.props.exchange, 'orderbook')
        clearTimeout(this._interval)
        Nexus.runTicker(this.props.exchange, this.props.base)
    }
    onEnableScroll(value) {
        this.setState({
            enableScrollViewScroll: value,
        })
    }
    order = async () => {
        alert('주문을 하시겠습니까?')
    }
    render() {
        if (this.state.units.length == 0) {
            return null
        }
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                <ScrollView style={{ flex: 1, flexDirection: 'row' }} ref="scroll" scrollEnabled={this.state.enableScrollViewScroll}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <FlatList
                            ref="orderbook"
                            style={{ width: width / 2 - 10 }}
                            data={this.state.units}
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

                        <View style={{ width: width / 2 - 10, marginHorizontal: 10 }}>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>
                                <Button
                                    type={this.state.viewType ? 'primary' : 'default'}
                                    style={{ flex: 1 }}
                                    onPress={(e) => { this.state.viewType = !this.state.viewType }}
                                    title="구매">
                                </Button>
                                <Button
                                    type={!this.state.viewType ? 'warning' : 'default'}
                                    style={{ flex: 1 }}
                                    onPress={(e) => { this.state.viewType = !this.state.viewType }}
                                    title="판매">
                                </Button>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: 20, color: 'gray' }}>
                                    주문방식
                                </Text>
                                <RNPickerSelect
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 20,
                                            right: 10,
                                        },
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
                            </View>
                            <View style={{ marginTop: 20, display: this.state.orderType == 'limit' ? 'flex' : 'none' }}>
                                <Text style={{ fontSize: 20, color: 'gray' }}>가격</Text>
                                <TextInput
                                    style={defaultStyle.textInput}
                                    keyboardType='numeric'
                                    autoCorrect={false}
                                    value={String(this.state.price)}
                                    onChangeText={text => {
                                        this.setState({
                                            price: text.replace(/[^\d\.]/gi, '') || ''
                                        })
                                    }} />
                            </View>
                            <View style={{ marginTop: 20, display: this.state.orderType == 'limit' ? 'flex' : 'none' }}>
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
                                    onBlur={() => {
                                        // this.refs['scroll'].scrollTo({y: 0})
                                    }}
                                />
                            </View>
                            <View>
                                <Button
                                    onPress={() => this.order()}
                                    color='rgb(148,172,218)'
                                    title="구매하기" />
                                <Button
                                    onPress={() => this.order()}
                                    color='rgb(234,98,104)'
                                    buttonStyle={{
                                        display: 'none'
                                    }}
                                    title="판매하기" />
                            </View>
                        </View>
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
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        marginTop: 10,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
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