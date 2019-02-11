import React, { Component } from 'react'
import {
  View
} from 'react-native'
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation'
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
      header: null
    }
  },
  coinDetail: {
    screen: CoinDetail,
    navigationOptions: {
      title: null
    }
  }
})

const AppContainer = createAppContainer(
  createBottomTabNavigator(
    {
      exchange: {
        screen: exchangeStackNavigator,
        navigationOptions: {
          title: '거래소',
          tabBarIcon: (<FontAwesomeIcon
            name="exchange"
            size={24}
            color="gray" />)
        }
      },
      strategy: {
        screen: Strategy,
        navigationOptions: {
          title: '전략',
          tabBarIcon: (<FontAwesomeIcon
            name="stack-exchange"
            size={24}
            color="gray" />)
        }
      },
      investHistory: {
        screen: InvestHistory,
        navigationOptions: {
          title: '투자이력',
          tabBarIcon: (<FontAwesomeIcon
            name="history"
            size={24}
            color="gray" />)
        }
      },
      account: {
        screen: Account,
        navigationOptions: {
          title: '마이페이지',
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
    return (
      <View style={{flex: 1}}>
        <AppContainer />
      </View>
    )
  }
}
