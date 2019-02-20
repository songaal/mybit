import React, { Component } from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import Nexus from '@api/Nexus'
import { exchangeKeyId } from '@constants/StorageKey'

export default class OrderHistoryTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tradeHistory: []
        }
        // 최소 한번실행
        this.getTradeHistory()
    }
    componentWillUpdate() {
        // 다시 탭 선택했을때
        this.getTradeHistory()
    }
    getTradeHistory = async () => {
        let exchangeKeys = await AsyncStorage.getItem(exchangeKeyId)
        if (exchangeKeys === null || exchangeKeys === undefined) {
            return false
        }
        exchangeKey = JSON.parse(exchangeKeys)[this.props.exchange]
        if (exchangeKey === undefined || exchangeKey === null) {
            return false
        }
        let accessKey = exchangeKey['active']['accessKey']
        let secretKey = exchangeKey['active']['secretKey']
        let result = await Nexus.getOrderHistory(this.props.exchange, this.props.base, this.props.coin, accessKey, secretKey)
        console.log(result['status'])
    }
    render() {
        return (
            <View>
                <Text>주문이력</Text>
            </View>
        )
    }
}
