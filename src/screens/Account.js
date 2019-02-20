import React from 'react'
import { View, Text, SafeAreaView, TextInput, AsyncStorage, TouchableOpacity, Dimensions } from 'react-native'
import { Button, NoticeBar, WhiteSpace, Card } from '@ant-design/react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Links from '@constants/Links'
const { width, height } = Dimensions.get('window')

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
    (async () => {
      try {
        let accessKey = await AsyncStorage.getItem('accessKey')
        let secretKey = await AsyncStorage.getItem('secretKey')
        this.setState({
          accessKey: accessKey,
          secretKey: secretKey
        })
      } catch (error) {
        console.log(error)
      }
    })()
  }
  registerKey = async () => {
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
  goDynamicWebView(linkName) {
    this.props.navigation.navigate('dynamicWebView', {
      ...Links[linkName]
    })
  }
  goExchangeKeyList() {
    this.props.navigation.navigate('exchangeKeyList', {
      tabBarHidden: true
    })
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
          내정보
        </Text>

        <View
          style={{
            marginTop: 50,
            alignItems: 'center'
          }}>

          {/* <Button>
            로그인
          </Button> */}
          <Text style={{ fontSize: 20 }}>환영합니다!</Text>

        </View>

        <View style={{ height: 50}}></View>

        <TouchableOpacity onPress={() => { this.goDynamicWebView('Notice') }}>
          <View
            style={{
              borderTopWidth: 0.5,
              borderTopColor: '#bbb',
              borderBottomWidth: 0.5,
              borderBottomColor: '#bbb',
              flexDirection: 'row'
            }}>
            <Text
              style={{
                width: width - 30,
                fontSize: 18,
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 20,
                paddingRight: 20
              }}>
              공지사항
            </Text>
            <Text
              style={{
                width: 30,
                paddingTop: 20,
                alignItems: 'flex-end'
              }}>
              <FontAwesomeIcon
                name="chevron-right"
                size={18}
                color="gray" />
            </Text>

          </View>
        </TouchableOpacity>

        <View style={{ height: 50}}></View>

        <TouchableOpacity onPress={() => { this.goExchangeKeyList() }}>
          <View
            style={{
              borderTopWidth: 0.5,
              borderTopColor: '#bbb',
              borderBottomWidth: 0.5,
              borderBottomColor: '#bbb',
              flexDirection: 'row'
            }}>
            <Text
              style={{
                width: width - 30,
                fontSize: 18,
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 20,
                paddingRight: 20
              }}>
              거래소키
            </Text>
            <Text
              style={{
                width: 30,
                paddingTop: 20,
                alignItems: 'flex-end'
              }}>
              <FontAwesomeIcon
                name="chevron-right"
                size={18}
                color="gray" />
            </Text>

          </View>
        </TouchableOpacity>
        
        <View style={{ height: 50}}></View>

        <TouchableOpacity onPress={() => { this.goDynamicWebView('TermsOfService') }}>
          <View
            style={{
              borderTopWidth: 0.5,
              borderTopColor: '#bbb',
              borderBottomWidth: 0.5,
              borderBottomColor: '#bbb',
              flexDirection: 'row'
            }}>
            <Text
              style={{
                width: width - 30,
                fontSize: 18,
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 20,
                paddingRight: 20
              }}>
              이용약관
            </Text>
            <Text
              style={{
                width: 30,
                paddingTop: 20,
                alignItems: 'flex-end'
              }}>
              <FontAwesomeIcon
                name="chevron-right"
                size={18}
                color="gray" />
            </Text>

          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { this.goDynamicWebView('TermsOfPrivacy') }}>
          <View
            style={{
              marginTop: 0,
              borderBottomWidth: 0.5,
              borderBottomColor: '#bbb',
              flexDirection: 'row'
            }}>
            <Text
              style={{
                width: width - 30,
                fontSize: 18,
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 20,
                paddingRight: 20
              }}>
              개인정보처리약관
            </Text>
            <Text
              style={{
                width: 30,
                paddingTop: 20,
                alignItems: 'flex-end'
              }}>
              <FontAwesomeIcon
                name="chevron-right"
                size={18}
                color="gray" />
            </Text>

          </View>
        </TouchableOpacity>


        {/* <View 
          style={{
            marginTop: 50
          }}>
          
          <Button>
            로그아웃
          </Button>

        </View> */}



        {/* <Card style={{marginTop: 20}}>
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
        </Card> */}

      </View>
    )
  }
}
