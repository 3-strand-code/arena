import React, { Component, PropTypes } from 'react'

import ArenasList from '../components/ArenaList'

export default class Arenas extends Component {
  render() {
    return (
      <div className='ui text container'>
        <ArenasList />
      </div>
    )
  }
}
