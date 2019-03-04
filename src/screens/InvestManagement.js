import React from 'react'
import { View, Text, SafeAreaView, AsyncStorage, Dimensions, ScrollView } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import { config } from '~/Config'
import Card from '@components/Card'
import Nexus from '@api/Nexus'
import { exchangeKeyId } from '@constants/StorageKey'
import numeral from 'numeral'

const { width, height } = Dimensions.get('window')

const InvestCard = (key, title, sumPrice, data) => {
  let List = Object.keys(data)
    .map((key, index) => {
      return (
        <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, color: 'gray' }}>
              보유 {key}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, color: 'black', textAlign: 'right' }}>
              {data[key].coinAmount} {key}
            </Text>
          </View>
        </View>
      )
    })
  return (
    <Card key={key} style={{ marginTop: 10, marginBottom: 10 }}>
      <View key="header" style={{flexDirection: 'row'}}>
        <Text style={{ fontSize: 18, flex: 1 }}> {title}</Text>
        <Text style={{ fontSize: 14, flex: 1, textAlign: 'right' }}> {sumPrice} BTC</Text>
        
      </View>
      <View key="body">
        {List}
      </View>
    </Card>
  )
}

export default class InvestHistory extends React.Component {
  constructor(props) {
    super(props)
    this._sumKrwValue = {}
    this._sumBtcValue = {}
    this._exchangeInCoinPriceSet = {}
    this.fetchBalance()
    this.state = {
      sumKrwValue: null,
      sumBtcValue: null,
      exchangeInCoinPriceSet: null
    }
  }
  fetchBalance = async () => {
    // ****************************
    // 1. 저장된 모든거래소키 정보 가져온다.
    // ****************************
    let val = await AsyncStorage.getItem(exchangeKeyId)
    let exchangeKeys = val === null ? {} : JSON.parse(val)
    let exchangeIds = Object.keys(exchangeKeys)

    // ****************************
    // 2. 거래소의 지갑정보를 조회하여 보유한 코인만 추출한다.
    // ****************************
    for (let i = 0; i < exchangeIds.length; i++) {
      let exchangeId = exchangeIds[i]
      let { accessKey, secretKey } = exchangeKeys[exchangeId]['active']
      let { data } = await Nexus.getBalance(exchangeId, accessKey, secretKey)
      let coins = Object.keys(data['total'])
        .filter(coin => data[coin]['total'] && data[coin]['total'] != 0)

      // ****************************
      // 3. 보유한 코인의 현재 가격을 조회후 BTC로 가치 환산한다.
      // ****************************
      this._sumBtcValue[exchangeId] = 0
      let tether = config.exchanges[exchangeId].tether
      let tetherPrice = await Nexus.getCoinLastPrice(accessKey, secretKey, exchangeId, tether, 'BTC')

      // console.log(`거래소: ${exchangeId}`)
      this._exchangeInCoinPriceSet[exchangeId] = {}
      for (let j = 0; j < coins.length; j++) {
        let coin = coins[j]
        let coinAmount = data[coin]['total']
        let coinPrice = 0
        let btcValue = 0

        if (coin === 'BTC') {
          // 비트코인
          coinPrice = await Nexus.getCoinLastPrice(accessKey, secretKey, exchangeId, tether, coin)
          btcValue = coinAmount
        } else if (coin === tether || coin.indexOf('USD') !== -1) {
          // 테더코인
          coinPrice = await Nexus.getCoinLastPrice(accessKey, secretKey, exchangeId, tether, 'BTC')
          btcValue = coinAmount / coinPrice
        } else {
          // 알트코인
          coinPrice = await Nexus.getCoinLastPrice(accessKey, secretKey, exchangeId, 'BTC', coin)
          btcValue = coinAmount * coinPrice
        }

        this._exchangeInCoinPriceSet[exchangeId][coin] = {
          coinPrice: coinPrice,
          coinAmount: coinAmount,
          btcValue: btcValue
        }

        this._sumBtcValue[exchangeId] += btcValue

        // console.log(`코인: ${coin}, 코인가격: ${coinPrice}, 보유수량: ${coinAmount}, BTC 가치 수량: ${btcValue}`)
      }
      // console.log(`총 BTC 가치 수량: ${this._sumBtcValue[exchangeId]}`)

      // ****************************
      // 4. BTC 가격을 원화로 환산하여 상태에 저장한다.
      // ****************************
      let btcValue = this._sumBtcValue[exchangeId]
      if (tether === 'KRW') {
        this._sumKrwValue[exchangeId] = btcValue * tetherPrice
      } else if (tether.indexOf('USD') !== -1) {
        this._sumKrwValue[exchangeId] = btcValue * tetherPrice * 1140
      } else {
        this._sumKrwValue[exchangeId] = 0
      }
      // console.log('원화 가치: ', this._sumKrwValue[exchangeId])
    }
    let krwSum = 0
    Object.values(this._sumKrwValue).forEach(v => krwSum += v)
    let btcSum = 0
    Object.values(this._sumBtcValue).forEach(v => btcSum += v)
    
    this.setState({
      sumKrwValue: numeral(krwSum).format('0,0'),
      sumBtcValue: numeral(btcSum).format('0,0[.]00000000'),
      exchangeInCoinPriceSet: this._exchangeInCoinPriceSet
    })
    if (this._interval !== false) {
      this._interval = setTimeout(() => {
        this.fetchBalance()
      }, 10000)
    }
  }
  render() {
    if (this.state.sumKrwValue === null || this.state.exchangeInCoinPriceSet === null) {
      return null
    }
    let listTag = []
    Object.keys(this.state.exchangeInCoinPriceSet)
      .forEach((exchange, index) => {
        let title = config.exchanges[exchange]['korName']
        let sumBtc = numeral(this._sumBtcValue[exchange]).format('0,0[.]00000000')
        listTag.push(InvestCard(index, title, sumBtc, this.state.exchangeInCoinPriceSet[exchange]))
      })

    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.fetchBalance()
            this._interval = true
          }}
          onWillBlur={payload => {
            clearTimeout(this._interval);
            this._interval = false
          }}
        />
        <Text style={{
          marginTop: 30,
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          투자내역
        </Text>
        <View style={{
          marginTop: 30,
          paddingBottom: 10,
          width: width,
          // height: 100,
          borderBottomWidth: 1.5,
          borderBottomColor: 'gray'
        }}>
          <View style={{
            flexDirection: 'row',
            marginHorizontal: 20
          }}>
            <Text style={{
              flex: 1,
              fontSize: 20,
              color: 'gray'
            }}>
              원화가격
            </Text>
            <Text style={{
              flex: 1.8,
              fontSize: 20,
              textAlign: 'right',
            }}>
              {this.state.sumKrwValue} 원
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginTop: 10
          }}>
            <Text style={{
              flex: 1,
              fontSize: 20,
              color: 'gray'
            }}>
              BTC가격
            </Text>
            <Text style={{
              flex: 1.8,
              fontSize: 20,
              textAlign: 'right',
            }}>
              {this.state.sumBtcValue} BTC
            </Text>

          </View>


        </View>
        <ScrollView style={{ flex: 1 }}>
          {listTag}

        </ScrollView>
      </SafeAreaView >
    )
  }
}
