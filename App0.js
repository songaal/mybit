import React, { Component } from 'react'
import store from '@redux/store'
import { config } from '~/Config'
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native'
import '@api/index'
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer
} from 'react-navigation'
import { Ionicons } from '@expo/vector-icons'
import Home from '@screens/Home'
import OrderBook from '@screens/OrderBook'

console.log('----------------------------')
console.log('Device OS: ', Platform.OS)
console.log('Device Width: ', Dimensions.get('window').width)
console.log('Device Height: ', Dimensions.get('window').height)
console.log('----------------------------')
















const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state
  let IconComponent = Ionicons
  let iconName
  if (routeName === 'Home') {
    iconName = `ios-information-circle${focused ? '' : '-outline'}`
    // We want to add badges to home tab icon
    // IconComponent = HomeIconWithBadge
  } else if (routeName === 'Settings') {
    iconName = `ios-options${focused ? '' : '-outline'}`
  }
  return <IconComponent name={iconName} size={25} color={tintColor} />
}

export default createAppContainer(
  createBottomTabNavigator(
    {
      Home: { screen: Home },
      OrderBook: { screen: OrderBook },
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
          getTabBarIcon(navigation, focused, tintColor),
      }),
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      },
    }
  )
)












const RootStack = createStackNavigator(
  {
    Home: Home,
    OrderBook: OrderBook,
  },
  {
    initialRouteName: 'Home',
  }
)
const AppContainer = createAppContainer(RootStack)

class App extends Component {
  constructor(props) {
    super(props)
    this.updateState = this.updateState.bind(this)
    this.state = {
      subscribe: store.getState(),
      unsubscribe: store.subscribe(this.updateState)
    }
  }
  componentWillUnmount() {
    this.state.unsubscribe()
  }
  updateState() {
    this.setState({
      subscribe: store.getState()
    })
  }
  render() {
    let totalCont = Object.keys(config.exchanges).length
    let runCount = Object.keys(this.state.subscribe.exchanges).length
    if (totalCont != runCount) {
      return (
        <View style={{flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center'}}>
          <Text>로딩 중...</Text>
        </View>
      )
    }
    this.state.unsubscribe()
    return <AppContainer />
  }
}
