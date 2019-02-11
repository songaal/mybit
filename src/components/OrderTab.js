import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Picker,
  TextInput,
  SectionList
} from 'react-native'

export default class OrderBook extends Component {
  constructor(props) {
    super(props)
    const exchange = props.navigation.state.params.exchange
    const base = props.navigation.state.params.base
    const coin = props.navigation.state.params.coin
  }
  render() {
    return (
      <ScrollView>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            
          </View>
          <View style={{flex: 1}}>
            
            <View style={{height: 20, flexDirection: 'row', textAlign: 'center'}}>
              <TouchableOpacity>
                <Text style={{fontSize: 20}}>구매</Text>
              </TouchableOpacity>
              <TouchableOpacity>
              <Text style={{fontSize: 20}}>판매</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{flex: 1}}>
              <View>
                {/* TODO select 추가. */}
              </View>
              <View>
                <Text>발동가격</Text>
                <TextInput style={{height: 40}} placeholder="3500"></TextInput>
              </View>
              <View>
                <Text>가격</Text>
                <TextInput style={{height: 40}} placeholder="3500"></TextInput>
              </View>
              <View>
                <Text>수량</Text>
                <TextInput style={{height: 40}} placeholder="1.5"></TextInput>
              </View>

            </View>

          </View>
        </View>
      </ScrollView>
    )
  }
}
