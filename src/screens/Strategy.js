import React from 'react'
import { View, Text, SafeAreaView, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import Card from '@components/Card'

const { width, height } = Dimensions.get('window')

export default class Strategy extends React.Component {
  render() {
    return (
      <SafeAreaView>

        <Text
          style={{
            marginTop: 30,
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
          전략
        </Text>

        <View
          style={{
            marginTop: 30
          }}>
          <Card
            style={{
            }}>
            <View
              key="header"
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
              <Text
                style={{
                  fontSize: 18
                }}>
                H 전략
              </Text>
              <Text
                style={{
                  fontSize: 18
                }}>
                BTC/USDT
               </Text>
              <Text
                style={{
                  fontSize: 18
                }}>
                빗썸
              </Text>
            </View>
            <View key="body">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                <Text
                  style={{
                    fontSize: 18
                  }}>
                  총수익 5%
              </Text>
                <Text
                  style={{
                    fontSize: 18
                  }}>
                  기간 365일
                </Text>
              </View>
            </View>
            <View key="footer">
                  <TouchableOpacity />
            </View>
          </Card>



        </View>


      </SafeAreaView>
    )
  }
}
