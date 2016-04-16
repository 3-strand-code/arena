import React, { Component } from 'react'

import Menu from '../components/Menu'

export default class LoggedIn extends Component {
  render() {
    return (
      <div>
        <Menu />
        <div className='ui hidden divider' />
        {this.props.children}
      </div>
    )
  }
}
