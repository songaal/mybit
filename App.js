import React from 'react'
import Home from '@screens/Home'
import '@api/index'

// 리덕스를 진행해볼꺼임.
export default class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Home />
    )
  }
}
