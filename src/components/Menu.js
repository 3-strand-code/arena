import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import * as base from '../lib/base'
import Logo from '../components/Logo'

export default class Menu extends Component {
  render() {
    const { avatar, name, github } = base.getActiveUser()

    return (
      <div className='ui borderless top attached menu'>
        <Link to='/' className='header item'>
          <Logo size='tiny' iconOnly />
        </Link>
        <div className='right menu'>
          <div className='ui simple dropdown item link'>
            <img src={avatar} alt={name} className='ui avatar image' />
            {github}
            <i className='dropdown icon' />
            <div className='menu'>
              <div className='item' onClick={base.logout}>Logout</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
