import React, { Component } from 'react'
import { View, Text, FlatList, AsyncStorage, TouchableOpacity, Dimensions } from 'react-native'
import Nexus from '@api/Nexus'
import { exchangeKeyId } from '@constants/StorageKey'
import { NavigationEvents } from 'react-navigation'

const { width, height } = Dimensions.get('window')

export default class OrderHistoryTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: null,
            isAddedKey: null
        }
    }
    componentWillMount(props) {
        // 다시 탭 선택했을때
        console.log('마운트')
        this.getOrders()
    }
    componentWillUnmount() {
        console.log('마운트 해제')
    }
    getOrders = async () => {
        let exchangeKeys = await AsyncStorage.getItem(exchangeKeyId)
        if (exchangeKeys === null || exchangeKeys === undefined) {
            this.setState({
                isAddedKey: false,
                orders: []
            })
            return false
        }
        exchangeKey = JSON.parse(exchangeKeys)[this.props.exchange]
        if (exchangeKey === undefined || exchangeKey === null) {
            this.setState({
                isAddedKey: false,
                orders: []
            })
            return false
        }
        let accessKey = exchangeKey['active']['accessKey']
        let secretKey = exchangeKey['active']['secretKey']
        let exchangeId = this.props.exchange
        let base = this.props.base
        let coin = this.props.coin
        let orders = await Nexus.getOrders(exchangeId, accessKey, secretKey, base, coin)
        this.setState({
            isAddedKey: true,
            orders: orders
        })
    }
    render() {
        if (this.state.orders === undefined) {
            return <View><Text>미지원..</Text></View>
        }
        else if (this.state.orders === null) {
            return <View></View>
        } else if (this.state.isAddedKey === false) {
            return (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        fontSize: 20,
                        marginTop: 100
                    }}>
                        거래소키를 등록하세요.
                        </Text>
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <Text style={{
                    display: this.state.orders.length == 0 ? 'flex' : 'none',
                    fontSize: 20,
                    textAlign: 'center',
                    marginTop: 100
                }}>
                    주문이력이 없습니다.
                </Text>

                <FlatList
                    data={this.state.orders}
                    initialNumToRender={10}
                    onEndReachedThreshold={1200}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View
                            onPress={() => { }}
                            style={{
                                width: width,
                                borderBottomColor: 'gray',
                                borderBottomWidth: 0.5,
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                flexDirection: 'row'
                            }}>
                            <View
                                style={{
                                    width: width - 80 - 20
                                }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                    <Text
                                        style={{
                                            fontSize: 16
                                        }}>
                                        주문
                                        <Text style={{
                                            color: item.side == 'buy' ? 'blue' : 'red',
                                        }}>
                                            &nbsp;{item.side.toUpperCase()}
                                        </Text>
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16
                                        }}>
                                        수량 {item.amount}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                    <Text
                                        style={{
                                            fontSize: 16
                                        }}>
                                        타입 {item.type}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16
                                        }}>
                                        채결 {item.filled}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                    <Text
                                        style={{
                                            fontSize: 16
                                        }}>
                                        가격 {item.price}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16
                                        }}>
                                        수수료
                                        <Text style={{
                                            color: 'red',
                                        }}>
                                            &nbsp;{item.fee}
                                        </Text>
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: 'gray'
                                    }}>
                                    {item.timestamp}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={{
                                    paddingLeft: 10,
                                    width: 80,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                <Text style={{ fontSize: 16 }}>상태</Text>
                                <Text style={{ fontSize: 14 }}>{item.status}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        )
    }
}
