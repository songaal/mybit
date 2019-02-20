import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, AsyncStorage } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { config } from '~/Config'
import ccxt from 'ccxt'
import { exchangeKeyId } from '@constants/StorageKey'
const { width, height } = Dimensions.get('window')

export default class AddExchangeKey extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '거래소키'
        }
    }
    constructor(props) {
        super(props)
        this.exchanges = config.getExchangeLabels().map(exchange => {
            return {
                label: exchange.title,
                value: exchange.key
            }
        })
        this.state = {
            selected: this.exchanges[0].value,
            accessKey: '',
            secretKey: '',
            name: ''
        }
        this.addExchange = this.addExchange.bind(this)
    }
    addExchange = async () => {
        let exchangeId = this.state.selected
        let name =this.state.name
        let accessKey = this.state.accessKey
        let secretKey = this.state.secretKey
        
        if (exchangeId === null) {
            alert('거래소를 선택하세요.')
            return false
        }
        let koExchangeName = this.exchanges.filter(ex => ex.value == exchangeId)[0].label
        let keyData = await AsyncStorage.getItem(exchangeKeyId)
        if (keyData === null) {
            keyData = {}
        } else {
            keyData = JSON.parse(keyData)
        }
        // TODO 거래소에 여러개의 키가 있는경우. 삭제예정.
        if (keyData[exchangeId] !== undefined) {
            alert('이미 거래소키가 등록되어 있습니다.')
            this.props.navigation.goBack()
            return false
        }
        // if (name === '') {
        //     alert('별칭을 입력하세요.')
        //     return false
        // }
        if (accessKey === '') {
            alert('액세스키를 입력하세요.')
            return false
        }
        if (secretKey === '') {
            alert('시크릿키를 입력하세요.')
            return false
        }
        let exchange = new ccxt[exchangeId]({
            apiKey: accessKey,
            secret: secretKey
        })
        try {
            await exchange.fetchBalance()

            if (keyData[exchangeId] === undefined || keyData[exchangeId] === null) {
                keyData[exchangeId] = {
                    active: {
                        exchange: null,
                        exchangeName: null,
                        name: null,
                        accessKey: null,
                        secretKey: null,
                    },
                    keyList: []
                }
            }
            keyData[exchangeId]['active']['exchange'] = exchangeId
            keyData[exchangeId]['active']['exchangeName'] = koExchangeName
            keyData[exchangeId]['active']['name'] = name
            keyData[exchangeId]['active']['accessKey'] = accessKey
            keyData[exchangeId]['active']['secretKey'] = secretKey
            keyData[exchangeId]['keyList'].push({
                exchange: exchangeId,
                exchangeName: koExchangeName,
                name: name,
                accessKey: accessKey,
                secretKey: secretKey,
            })
            await AsyncStorage.setItem(exchangeKeyId, JSON.stringify(keyData))
            this.props.navigation.state.params.onGoBack()
            alert('저장 되었습니다.')
            this.props.navigation.goBack()
        } catch (error) {
            console.log(error)
            let trashIndex = error.message.indexOf(' ')
            alert(JSON.parse(error.message.substring(trashIndex))['error']['message'])
        }
    }
    render() {
        return (
            <View style={{
                marginHorizontal: 10
            }}>
                {/* <Text style={{
                    marginTop: 20,
                    fontSize: 18,
                    textAlign: 'center'
                }}>등록</Text> */}

                <Text style={{
                    marginTop: 30,
                    fontSize: 18,
                    color: 'gray'
                }}>
                    거래소
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
                    items={this.exchanges}
                    onValueChange={(value) => {
                        this.setState({
                            selected: value,
                        })
                    }}
                    value={this.state.selected}
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

                {/* <Text style={{
                    marginTop: 30,
                    fontSize: 18,
                    color: 'gray'
                }}>
                    별칭
                </Text>
                <TextInput
                    style={{
                        marginTop: 10,
                        height: 40,
                        borderRadius: 5,
                        borderWidth: 0.5,
                        borderColor: 'gray',
                        fontSize: 16,
                        paddingHorizontal: 10
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={this.state.name}
                    onChangeText={text => {
                        this.setState({
                            name: text
                        })
                    }} /> */}


                <Text style={{
                    marginTop: 30,
                    fontSize: 18,
                    color: 'gray'
                }}>
                    액세스키
                </Text>
                <TextInput
                    style={{
                        marginTop: 10,
                        height: 40,
                        borderRadius: 5,
                        borderWidth: 0.5,
                        borderColor: 'gray',
                        fontSize: 16,
                        paddingHorizontal: 10
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={this.state.accessKey}
                    onChangeText={text => {
                        this.setState({
                            accessKey: text
                        })
                    }} />

                <Text
                    style={{
                        marginTop: 30,
                        fontSize: 18,
                        color: 'gray'
                    }}>
                    시크릿키
                </Text>
                <TextInput
                    style={{
                        marginTop: 10,
                        height: 40,
                        borderRadius: 5,
                        borderWidth: 0.5,
                        borderColor: 'gray',
                        fontSize: 16,
                        paddingHorizontal: 10
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={this.state.secretKey}
                    onChangeText={text => {
                        this.setState({
                            secretKey: text
                        })
                    }} />

                <View
                    style={{
                        alignItems: 'center',
                        marginTop: 50,
                        marginHorizontal: 10
                    }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#3247c1',
                            width: width - 20,
                            height: 50,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={props => this.addExchange()}>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 20,
                            }}
                        >저장</Text>
                    </TouchableOpacity>
                </View>

            </View>
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