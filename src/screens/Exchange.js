import React from 'react'
import { config } from '~/Config'
import {
  View, 
  Text, 
  StyleSheet, 
  ListView, 
  ScrollView,
  WebView
} from 'react-native'
import {
  Grid
} from 'antd-mobile-rn'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from "react-native-underline-tabbar";

const data = Array.from(new Array(9)).map((_val, i) => ({
  text: `coin-${i}`
}))

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
const dataSource = ds.cloneWithRows(['row 1', 'row 2'])

const Header = () => {
  <View style={{flex: 1, backgroundColor: 'green'}}>
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'top'}}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text>코인명</Text>
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text>가격</Text>
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text>전일대비</Text>
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text>거래량</Text>
      </View>
    </View>
  </View>
}

const Page = ({label}) => (
  <View style={{flex: 1, backgroundColor: 'red'}}>
    <ListView dataSource={dataSource}
              renderRow={(rowData) => <Text>{rowData}</Text>} />
  </View>
);

const getMarketAll = async () => {
  return await fetch('https://api.upbit.com/v1/market/all')
}

export default class Exchange extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollableTabView tabBarActiveTextColor="#53ac49"
                           style={{}}
                           renderTabBar={() => <TabBar style={{height: 25}} underlineColor="#53ac49" />}>
          
          <View tabLabel={{label: "업비트"}} style={{flex: 1}}>
            <ScrollableTabView tabBarActiveTextColor="#53ac49"
                               renderTabBar={() => <TabBar underlineColor="#53ac49" />}>
              <Page style={{flex: 1}} tabLabel={{label: "BTC"}} label="BTC"/>
              <Page style={{flex: 1}} tabLabel={{label: "ETH"}} label="ETH"/>
              <Page style={{flex: 1}} tabLabel={{label: "KRW"}} label="KRW"/>
            </ScrollableTabView>
          </View>
          
          <View tabLabel={{label: "빗썸"}} style={{flex: 1}}>
            <ScrollableTabView tabBarActiveTextColor="#53ac49"
                               renderTabBar={() => <TabBar underlineColor="#53ac49" />}>
              <Page tabLabel={{label: "BTC"}} label="BTC"/>
              <Page tabLabel={{label: "ETH"}} label="ETH"/>
              <Page tabLabel={{label: "KRW"}} label="KRW"/>
            </ScrollableTabView>
          </View>
          
          <View tabLabel={{label: "바이낸스"}} style={{flex: 1}}>
            <ScrollableTabView tabBarActiveTextColor="#53ac49"
                               renderTabBar={() => <TabBar underlineColor="#53ac49" />}>
              <Page tabLabel={{label: "BTC"}} label="BTC"/>
              <Page tabLabel={{label: "ETH"}} label="ETH"/>
              <Page tabLabel={{label: "USDT"}} label="KRW"/>
            </ScrollableTabView>
          </View>
          
          <View tabLabel={{label: "후오비"}} style={{flex: 1}}>
            <ScrollableTabView tabBarActiveTextColor="#53ac49"
                               renderTabBar={() => <TabBar underlineColor="#53ac49" />}>
              <Page tabLabel={{label: "BTC"}} label="BTC"/>
              <Page tabLabel={{label: "ETH"}} label="ETH"/>
              <Page tabLabel={{label: "USD"}} label="KRW"/>
            </ScrollableTabView>
          </View>
          
          <View tabLabel={{label: "비트맥스"}} style={{flex: 1}}>
            <ScrollableTabView tabBarActiveTextColor="#53ac49"
                               renderTabBar={() => <TabBar underlineColor="#53ac49" />}>
              <Page tabLabel={{label: "BTC"}} label="BTC"/>
              <Page tabLabel={{label: "ETH"}} label="ETH"/>
              <Page tabLabel={{label: "USD"}} label="KRW"/>
            </ScrollableTabView>
          </View>
        </ScrollableTabView>
      
      
      </View>
    )
  }
}
// renderItem
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})