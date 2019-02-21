import React, { Component } from 'react'
import { View, ScrollView, Text, Platform, Dimensions, TouchableOpacity, AsyncStorage } from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { config } from '~/Config'
import { exchangeKeyId } from '@constants/StorageKey'
const { width, height } = Dimensions.get('window')

let _isChanged = true

export default class ExchangeKeyList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '거래소키',
            headerRight: (
                <TouchableOpacity
                    style={{
                        width: 50,
                        height: 30,
                        backgroundColor: '#3247c1',
                        marginRight: 20,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={(props) => {
                        navigation.navigate('addExchangeKey', {
                            tabBarHidden: true,
                            onGoBack: () => _isChanged = true
                        })
                    }}>
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 18
                        }}>추가</Text>
                </TouchableOpacity>
            ),
            headerStyle: {},
            headerBackTitle: null
        }
    }
    constructor(props) {
        super(props)
        this._interval = null
        this.exchanges = config.getExchangeLabels()
        this.state = {
            refresh: false,
            exchangeKeys: null
        }
    }
    _isRefresh = async () => {
        if (_isChanged) {
            let exchangeKeys = await AsyncStorage.getItem(exchangeKeyId)
            if (exchangeKeys !== null) {
                this.setState({
                    exchangeKeys: JSON.parse(exchangeKeys)
                })
            }
            _isChanged = false
        }
        this._interval = setTimeout(() => {
            this._isRefresh()
        }, 1000)
    }
    componentDidMount() {
        _isChanged = true
    }
    goExchangeDetail(exchange) {
        this.props.navigation.navigate('exchangeKeyDetail', {
            tabBarHidden: true,
            exchange: exchange
        })
    }
    ExchangeKeyTmplate(index, exchangeName, exchange) {
        return (
            <TouchableOpacity key={index} onPress={() => { this.goExchangeDetail(exchange) }}>
                <View
                    style={{
                        borderTopWidth: 0.2,
                        borderTopColor: '#bbb',
                        borderBottomWidth: 0.2,
                        borderBottomColor: '#bbb',
                        flexDirection: 'row'
                    }}>
                    <Text
                        style={{
                            width: width - 30,
                            fontSize: 18,
                            paddingTop: 20,
                            paddingBottom: 20,
                            paddingLeft: 20,
                            paddingRight: 20
                        }}>
                        {exchangeName}
                    </Text>
                    <Text
                        style={{
                            width: 30,
                            paddingTop: 20,
                            alignItems: 'flex-end'
                        }}>
                        <FontAwesomeIcon
                            name="chevron-right"
                            size={18}
                            color="gray" />
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    componentWillMount() {
        if (this._interval === null) {
            this._isRefresh()
        }
    }
    componentWillUnmount() {
        clearTimeout(this._interval)
        this._interval = null
    }
    render() {
        if (this.state.exchangeKeys === null) {
            return null
        }
        let keyList = []
        Object.keys(this.state.exchangeKeys)
        .forEach((exchangeId, index) => {
            let active = this.state.exchangeKeys[exchangeId]['active']
            keyList.push(this.ExchangeKeyTmplate(index, active['exchangeName'], active['exchange']))
        })
        return (
            <ScrollView style={{ marginTop: 0 }}>
                {keyList}
            </ScrollView>
        )
    }
}