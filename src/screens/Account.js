import React from 'react'
import { View, Text, SafeAreaView, TextInput } from 'react-native'

export default class Account extends React.Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        
        <Text>[테스트] AccessKey</Text>
        <TextInput autoCapitalize="none" style={{marginTop:10, height: 40, borderWidth: 0.5, borderColor: 'gray'}} />
        
        <Text style={{marginTop: 20}}>[테스트] SecretKey</Text>
        <TextInput autoCapitalize="none" style={{marginTop:10, height: 40, borderWidth: 0.5, borderColor: 'gray'}} />

      </SafeAreaView>
    )
  }
}
