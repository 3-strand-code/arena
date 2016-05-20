import React, { Component, PropTypes } from 'react'

import * as base from '../lib/base'
import Logo from '../components/Logo'

export default class Login extends Component {
  handleClick() {
    base.login()
  }

  render() {
    return (
      <div className='ui center aligned one column grid'>
        <div className='ui hidden section divider' />
        <div className='column'>
          <Logo size='big' />
          <div className='ui section divider' />
          <button className='ui button' onClick={this.handleClick}>
            <i className='github icon' />
            Login with GitHub
          </button>
        </div>
      </div>
    )
  }
}
