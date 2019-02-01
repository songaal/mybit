import {
  createStackNavigator,
  createAppNavigator
} from 'react-navigation'
import Home from '@screens/Home'
import OrderBook from '@screens/OrderBook'

const MainNavigator = createStackNavigator({
  Home: {screen: Home},
  OrderBook: {screen: OrderBook},
})

const App = createAppNavigator(MainNavigator)

export default App
