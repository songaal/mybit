import React, { Component } from 'react'
import { View, Text, FlatList, AsyncStorage, TouchableOpacity, Dimensions } from 'react-native'
import Nexus from '@api/Nexus'
import { exchangeKeyId } from '@constants/StorageKey'
import { NavigationEvents } from 'react-navigation'
import Utils from '~/Utils'
import numeral from 'numeral'

const { width, height } = Dimensions.get('window')

export default class OrderHistoryTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: [],
            isAddedKey: null
        }
    }
    componentWillMount(props) {
        // 마운트, 다시 탭 선택했을때
        (async () => {
            let accessKeys = await AsyncStorage.getItem(exchangeKeyId)
            if (accessKeys === null || accessKeys === undefined
                || JSON.parse(accessKeys)[this.props.exchange] === undefined) {
                isAddedKey = false
                return
            }
            let accessKey = JSON.parse(accessKeys)[this.props.exchange]['active']['accessKey']
            let orders = await AsyncStorage.getItem(`${accessKey}-${this.props.exchange}-${this.props.base}-${this.props.coin}`)
            if (orders === null) {
                orders = []
            } else {
                orders = JSON.parse(orders)
            }
            this.setState({
                isAddedKey: true,
                orders: orders.reverse()
            })
        })()
    }
    componentWillUnmount() {
        //마운트 해제
    }

    render() {
        if (this.state.orders === null) {
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
                        <View style={{
                            // marginHorizontal: 20,
                            borderBottomColor: 'gray',
                            borderBottomWidth: 0.5,
                            marginVertical: 5,
                            paddingBottom: 5
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{
                                    width: 100,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 20, color: item.side === 'buy' ? 'blue' : 'red' }}>
                                        {item.side === 'buy' ? '매수': '매도'}
                                    </Text>
                                </View>
                                <View style={{
                                    width: width / 3 + 30,
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text style={{ fontSize: 14 }}>@{numeral(item.price).format('0,0[.]00000000')}</Text>
                                    <Text style={{ fontSize: 14 }}>{numeral(item.amount).format('0,0[.]00000000')}</Text>
                                </View>
                                <View style={{
                                    width: width / 3 - 30,
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text style={{ fontSize: 14 }}>{Utils.formatTimestamp(item.time)}</Text>
                                </View>
                            </View>
                            {/* <Text
                                style={{
                                    fontSize: 12,
                                    color: 'gray'
                                }}>
                                2018.09.05 11:22.05
                            </Text> */}
                        </View>
                        // <View
                        //     style={{
                        //         width: width,
                        //         borderBottomColor: 'gray',
                        //         borderBottomWidth: 0.5,
                        //         paddingHorizontal: 10,
                        //         paddingVertical: 10,
                        //         flexDirection: 'row'
                        //     }}>
                        //     <View
                        //         style={{
                        //             width: width - 80 - 20
                        //         }}>
                        //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                        //             <Text
                        //                 style={{
                        //                     fontSize: 16
                        //                 }}>
                        //                 주문
                        //                 <Text style={{
                        //                     color: item.side == 'buy' ? 'blue' : 'red',
                        //                 }}>
                        //                     &nbsp;{item.side.toUpperCase()}
                        //                 </Text>
                        //             </Text>
                        //             <Text
                        //                 style={{
                        //                     fontSize: 16
                        //                 }}>
                        //                 수량 {item.amount}
                        //             </Text>
                        //         </View>
                        //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                        //             <Text
                        //                 style={{
                        //                     fontSize: 16
                        //                 }}>
                        //                 타입 {item.type}
                        //             </Text>
                        //             <Text
                        //                 style={{
                        //                     fontSize: 16
                        //                 }}>
                        //                 채결 {item.filled}
                        //             </Text>
                        //         </View>
                        //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                        //             <Text
                        //                 style={{
                        //                     fontSize: 16
                        //                 }}>
                        //                 가격 {item.price}
                        //             </Text>
                        //             <Text
                        //                 style={{
                        //                     fontSize: 16
                        //                 }}>
                        //                 수수료
                        //                 <Text style={{
                        //                     color: 'red',
                        //                 }}>
                        //                     &nbsp;{item.fee}
                        //                 </Text>
                        //             </Text>
                        //         </View>
                        //         <Text
                        //             style={{
                        //                 fontSize: 12,
                        //                 color: 'gray'
                        //             }}>
                        //             {item.timestamp}
                        //         </Text>
                        //     </View>
                        //     <TouchableOpacity
                        //         style={{
                        //             paddingLeft: 10,
                        //             width: 80,
                        //             alignItems: 'center',
                        //             justifyContent: 'center'
                        //         }}>
                        //         <Text style={{ fontSize: 16 }}>상태</Text>
                        //         <Text style={{ fontSize: 14 }}>{item.status}</Text>
                        //     </TouchableOpacity>
                        // </View>
                    )}
                />
            </View>
        )
    }
}
