import React, { Component } from 'react'
import { View, Text } from 'react-native'
import Nexus from '@api/Nexus'

export default class OrderTab extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {}
    }
    componentWillReceiveProps(props) {
        // if (this.index !== props.index) {
        //     clearTimeout(this._interval)
        //     this.isConnect = false
        // } else if (this.index === props.index && !this.isConnect) {
        //     Nexus.runTicker(this.exchange, this.base)
        //     this.updateTicker()
        //     this.isConnect = true
        // }
    }
    render() {
        return (
            <View>
                <Text>주문</Text>
            </View>
        )
    }
}
