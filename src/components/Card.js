import React, { Component } from 'react'
import { Dimensions, View } from 'react-native'

const { width, height } = Dimensions.get('window')

export default class Card extends Component {
  render() {
    const props = this.props
    let header = null
    let body = null
    let footer = null
    props.children.forEach(children => {
      switch (children.key) {
        case 'header': header = children; break;
        case 'body': body = children; break;
        case 'footer': footer = children; break;
      }
    })
    return (
      <View style={{
        width: width,
        // borderTopWidth: 0.3,
        borderBottomWidth: 0.3,
        // borderTopColor: 'gray',
        borderBottomColor: 'gray',
        ...props.style
      }}>

        <View style={{
          borderBottomWidth: 0.3,
          borderBottomColor: 'gray',
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
          display: header === null ? 'none' : 'flex',
          ...props.headerStyle
        }}>
          {header}
        </View>

        <View style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
          display: body === null ? 'none' : 'flex',
          ...props.bodyStyle
        }}>
          {body}
        </View>

        <View style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
          display: footer === null ? 'none' : 'flex',
          ...props.footerStyle
        }}>
          {footer}
        </View>

      </View>
    )
  }
}
