import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Home from '@screens/Home'
import Account from '@screens/Account'
import Exchange from '@screens/Exchange'
import InvestHistory from '@screens/InvestHistory'
import Strategy from '@screens/Strategy'
import CoinDetail from '@screens/CoinDetail'

const exchangeStackNavigator = createStackNavigator({
  exchange: {
    screen: Exchange,
    navigationOptions: {
      headerStyle: {
        height: 0
      }
    }
  },
  coinDetail: {
    screen: CoinDetail,
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
          if('coinDetail' == routeName) {
            isVisible = false
          }
          return {
            title: '거래소',
            tabBarVisible: isVisible,
            tabBarIcon: (<FontAwesomeIcon
              name="exchange"
              size={24}
              color="gray" />)
          }
        }
      },
      // strategy: {
      //   screen: Strategy,
      //   navigationOptions: {
      //     title: '전략',
      //     tabBarIcon: (<FontAwesomeIcon
      //       name="stack-exchange"
      //       size={24}
      //       color="gray" />)
      //   }
      // },
      investHistory: {
        screen: InvestHistory,
        navigationOptions: {
          title: '투자내역',
          tabBarIcon: (<FontAwesomeIcon
            name="bookmark"
            size={24}
            color="gray" />)
        }
      },
      account: {
        screen: Account,
        navigationOptions: {
          title: '내정보',
          tabBarIcon: (<FontAwesomeIcon
            name="user"
            size={24}
            color="gray" />)
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
