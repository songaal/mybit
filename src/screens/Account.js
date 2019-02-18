import React from 'react'
import { View, Text, SafeAreaView, TextInput, AsyncStorage } from 'react-native'
import { Button, NoticeBar, WhiteSpace, Card } from '@ant-design/react-native'

export default class Account extends React.Component {
  constructor(props) {
    super(props)

    this.registerKey = this.registerKey.bind(this)

    this.state = {
      accessKey: '',
      secretKey: ''
    }
  }
  componentWillMount() {
    (async() => {
      try {
        let accessKey = await AsyncStorage.getItem('accessKey')
        let secretKey = await AsyncStorage.getItem('secretKey')
        console.log(accessKey, secretKey)
        this.setState({
          accessKey: accessKey,
          secretKey: secretKey
        })
      } catch (error) {
        console.log(error)
      }
    })()
  }
  registerKey = async() => {
    console.log(this.state.accessKey, this.state.secretKey)
    let accessKey = this.state.accessKey
    let secretKey = this.state.secretKey
    try {
      await AsyncStorage.setItem('accessKey', accessKey)
      await AsyncStorage.setItem('secretKey', secretKey)
      alert('저장되었습니다.')
    } catch (error) {
      console.log(error)
      alert('저장 실패하였습니다.')
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, margin: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>거래소 키 등록</Text>
        <Card style={{marginTop: 20}}>
          <Card.Header
            title="업비트"
            extra=""
          />
          <Card.Body>
            <Text style={{marginTop: 10}}>AccessKey</Text>
            <TextInput 
              autoCapitalize="none" 
              style={{
                marginTop:10, 
                height: 40, 
                borderWidth: 0.5, 
                borderColor: 'gray'}} 
              value={String(this.state.accessKey)}
              onChangeText={(text) => {
                console.log(text)
                this.setState({
                  accessKey: text
                })
              }}/>
            
            <Text style={{marginTop: 10}}>SecretKey</Text>
            <TextInput 
              autoCapitalize="none" 
              style={{
                marginTop:10, 
                height: 40, 
                borderWidth: 0.5, 
                borderColor: 'gray'}} 
              value={String(this.state.secretKey)}
              onChangeText={(text) => {
                this.setState({
                  secretKey: text
                })
              }}/>
            <View style={{marginTop: 20, marginRight: 10, alignItems: 'flex-end'}}>
              <Button style={{width: 80}} type="primary" onPress={() => {this.registerKey()}}>
                저장
              </Button>
            </View>
            
          </Card.Body>
        </Card>
        
      </SafeAreaView>
    )
  }
}
