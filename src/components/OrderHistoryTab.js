import React, { Component } from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import Nexus from '@api/Nexus'
import { exchangeKeyId } from '@constants/StorageKey'
import { NavigationEvents } from 'react-navigation'

export default class OrderHistoryTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tradeHistory: []
        }
        // 최소 한번실행
        this.getTradeHistory()
    }
    componentWillUpdate(props) {
        console.log(props)
        // 다시 탭 선택했을때
        this.getTradeHistory()
    }
    getTradeHistory = async () => {
        console.log('call')
    }
    render() {
        return (
            <View>
                <NavigationEvents
                    onWillFocus={payload => console.log('will focus', payload)}
                    onDidFocus={payload => console.log('did focus', payload)}
                    onWillBlur={payload => console.log('will blur', payload)}
                    onDidBlur={payload => console.log('did blur', payload)}
                />
                <Text>주문이력</Text>
            </View>
        )
    }
}
