import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from '@screens/Home'
import Account from '@screens/Account'
import Exchange from '@screens/Exchange'
import InvestManagement from '@screens/InvestManagement'
import Strategy from '@screens/Strategy'
import CoinDetail from '@screens/CoinDetail'
import DynamicWebView from '@components/DynamicWebView'
import ExchangeKeyList from '@screens/ExchangeKeyList'
import ExchangeKeyDetail from '@screens/ExchangeKeyDetail'
import AddExchangeKey from '@screens/AddExchangeKey'
// icon stack-exchange
const exchangeStackNavigator = createStackNavigator({
  exchange: {
    screen: Exchange,
    navigationOptions: {
      headerStyle: {
        height: 0,
        borderBottomWidth: 0
      },
      headerBackTitle: null
    }
  },
  coinDetail: {
    screen: CoinDetail,
    navigationOptions: {}
  }
})

const accountStackNavigator = createStackNavigator({
  account: {
    screen: Account,
    navigationOptions: {
      headerStyle: {
        height: 0,
        borderBottomWidth: 0
      },
      headerTintColor: 'red',
      headerBackTitle: null
    }
  },
  dynamicWebView: {
    screen: DynamicWebView,
    navigationOptions: {}
  },
  exchangeKeyList: {
    screen: ExchangeKeyList,
    navigationOptions: {}
  },
  addExchangeKey: {
    screen: AddExchangeKey,
    navigationOptions: {}
  },
  exchangeKeyDetail: {
    screen: ExchangeKeyDetail,
    navigationOptions: {}
  }
})

const AppContainer = createAppContainer(
  createBottomTabNavigator(
    {
      exchange: {
        screen: exchangeStackNavigator,
        navigationOptions: ({ navigation }) => {
          let index = navigation.state.routes.length - 1
          let routeName = navigation.state.routes[index].routeName
          let isVisible = true
          if ('coinDetail' == routeName) {
            isVisible = false
          }
          return {
            title: '거래소',
            tabBarVisible: isVisible,
            tabBarIcon: (<FontAwesomeIcon
              name="exchange"
              size={18}
              color="gray" />),

          }
        }
      },
      strategy: {
        screen: Strategy,
        navigationOptions: {
          title: '전략',
          tabBarIcon: (<FontAwesomeIcon
            name="clone"
            size={24}
            color="gray" />)
        }
      },
      investManagement: {
        screen: InvestManagement,
        navigationOptions: {
          title: '투자내역',
          tabBarIcon: (<FontAwesomeIcon
            name="line-chart"
            size={18}
            color="gray" />)
        }
      },
      account: {
        screen: accountStackNavigator,
        navigationOptions: ({ navigation }) => {
          let index = navigation.state.routes.length - 1
          let isVisible = true
          let params = navigation.state.routes[index]['params']
          if (params && params['tabBarHidden'] === true) {
            isVisible = false
          }
          return {
            title: '내정보',
            tabBarVisible: isVisible,
            tabBarIcon: (<FontAwesomeIcon
              name="user"
              size={18}
              color="gray" />)
          }
        }
      }
    }
  )
)

export default class Container extends Component {
  render() {
    return <AppContainer />
  }
}
