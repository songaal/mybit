import React, { Component } from 'react'
import { View, Text, FlatList,TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Dimensions} from 'react-native'
import Nexus from '@api/Nexus'
import RNPickerSelect from 'react-native-picker-select'
import Button from '@ant-design/react-native/lib/button'

const { width, height } = Dimensions.get('window')

const viewType = {
    buy: true,
    sell: false
}

export default class OrderTab extends Component {
    constructor(props) {
        super(props)
        this.inputRefs = {

        }
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
        }, 100)
    }
    componentWillMount() {
        // 웹소켓 연결
        const exchange = this.props.exchange
        const base = this.props.base
        const coin = this.props.coin
        Nexus.runOrderbook(exchange, base, coin)
        this.updateOrderbook()
    }
    componentWillUnmount() {
        // 웹소켓 종료
        Nexus.wsClose(this.props.exchange, 'orderbook')
        clearTimeout(this._interval)
        Nexus.runTicker(this.props.exchange, this.props.base)
    }
    onEnableScroll(value) {
        this.setState({
            enableScrollViewScroll: value,
        })
    }
    render() {
        if (this.state.units.length <= 0) {
            return null
        }
        console.log(Math.round(this.state.units.length / 10))
        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
            <ScrollView style={{flex: 1, flexDirection: 'row'}} ref="scroll" scrollEnabled={this.state.enableScrollViewScroll}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <FlatList 
                        style={{width: width / 2 - 10}}
                        data={this.state.units} 
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => (
                            <TouchableOpacity 
                                style={{
                                    height: 40,
                                    flexDirection: 'row', 
                                    justifyContent: 'space-between',
                                    backgroundColor: item.unit == 'ask' ? 'rgba(234,98,104,0.5)': 'rgba(148,172,218,0.5)',
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
                                    this.onEnableScroll( false )
                                 }}
                                 onMomentumScrollEnd={() => {
                                    this.onEnableScroll( true )
                                 }}
                                 >
                                <Text style={{fontSize: 12}}>{item.price}</Text>
                                <Text style={{fontSize: 8}}>{item.size}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    
                    <View style={{width: width / 2 - 10, marginHorizontal: 10}}>
                        <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}>
                            <Button 
                                type={this.state.viewType ? 'primary' : 'default'} 
                                style={{flex: 1}}
                                onPress={(e) => {this.state.viewType = !this.state.viewType}}>
                                구매
                            </Button>
                            <Button 
                                type={!this.state.viewType ? 'warning' : 'default'} 
                                style={{flex: 1}}
                                onPress={(e) => {this.state.viewType = !this.state.viewType}}>
                                판매
                            </Button>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={{fontSize: 20, color: 'gray'}}>
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
                                />
                        </View>
                            <View style={{marginTop: 20}}>
                                <Text style={{fontSize: 20, color: 'gray'}}>수량</Text>
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
                            <View style={{marginTop: 20, display: this.state.orderType == 'limit'? 'flex' : 'none'}}>
                                <Text style={{fontSize: 20, color: 'gray'}}>가격</Text>
                                <TextInput 
                                    style={defaultStyle.textInput} 
                                    keyboardType='numeric' 
                                    autoCorrect={false}
                                    value={String(this.state.price)}
                                    onChangeText={text => {
                                        this.setState({
                                            price: text.replace(/[^\d\.]/gi, '') || ''
                                        })
                                    }}/>
                            </View>
                            <View style={{marginTop: 20, display: this.state.orderType == 'limit'? 'flex' : 'none'}}>
                                <Text style={{fontSize: 20, color: 'gray'}}>발동가격</Text>
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
                                        this.refs['scroll'].scrollTo({y: 80})
                                    }}
                                    onBlur={() => {
                                        this.refs['scroll'].scrollTo({y: 0})
                                    }}
                                    />
                            </View>
                        <Button type="primary" style={{marginTop: 20, display: this.state.viewType ? 'flex' : 'none'}}>구매하기</Button>
                        <Button type="warning" style={{marginTop: 20, display: !this.state.viewType ? 'flex' : 'none'}}>판매하기</Button>
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