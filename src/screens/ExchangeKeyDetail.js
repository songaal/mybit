import React, { Component } from 'react'
import { View, Text, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native'
import { exchangeKeyId } from '@constants/StorageKey'

const { width, height } = Dimensions.get('window')

export default class ExchangeKeyDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '거래소키',
            headerBackTitle: null
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            active: null,
            keyList: []
        }
    }
    componentWillUnmount() {}
    componentWillMount() {
        (async () => {
            let exchangeId = this.props.navigation.getParam('exchange', '')
            let exchangeKey = JSON.parse(await AsyncStorage.getItem(exchangeKeyId))[exchangeId]
            this.setState({
                active: exchangeKey['active'],
                keyList: exchangeKey['keyList']
            })
        })()
    }
    render() {
        if (this.state.active === null) {
            return null
        }
        return (
            <View>
                <View style={{
                    marginTop: 30,
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    borderBottomWidth: 0.3,
                    borderBottomColor: 'gray',
                    paddingBottom: 5
                }}>
                    <Text style={{
                        width: 100,
                        fontSize: 18,
                        textAlign: 'left'
                    }}>
                        거래소:
                </Text>
                    <Text style={{
                        width: width - 100,
                        fontSize: 18,
                        textAlign: 'left'
                    }}>
                        {this.state.active.exchangeName}
                    </Text>
                </View>

                <View style={{
                    marginTop: 30,
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    borderBottomWidth: 0.3,
                    borderBottomColor: 'gray',
                    paddingBottom: 5
                }}>
                    <Text style={{
                        width: 100,
                        fontSize: 18,
                        textAlign: 'left'
                    }}>
                        액세스키:
                </Text>
                    <Text style={{
                        width: width - 100,
                        fontSize: 18,
                        textAlign: 'left'
                    }}>
                        {this.state.active.accessKey}
                    </Text>
                </View>

                <View style={{
                    marginTop: 30,
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    borderBottomWidth: 0.3,
                    borderBottomColor: 'gray',
                    paddingBottom: 5
                }}>
                    <Text style={{
                        width: 100,
                        fontSize: 18,
                        textAlign: 'left'
                    }}>
                        시크릿키:
                </Text>
                    <Text style={{
                        width: width - 100,
                        fontSize: 18,
                        textAlign: 'left'
                    }}>
                        {this.state.active.secretKey.substring(0, 5) + '**********'}
                    </Text>
                </View>


            </View>
        )
    }
}