import React from 'react'
import { config } from '~/Config'
import {
  Text,
  View
} from 'react-native'
import Nexus from '@api/Nexus'
import BaseTab from '@components/BaseTab'

export default class Exchange extends React.Component {
  constructor(props) {
    super(props)
    const options = Object.values(config.getExchanges)
    .map(exchange => {
      return { id: exchange.id, title: exchange.korName }
    })
    this.state = {
      options: options,
      selected: options[0].id
    }
  }
  handleSelected(id) {
    this.setState({selected: id})
  }
  render() {
    return (
      <View>
        <BaseTab
          exchange={this.state.selected}
          navigation={this.props.navigation}/>
      </View>
    )
  }
}
