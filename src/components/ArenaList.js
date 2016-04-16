import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import * as base from '../lib/base'

export default class Arenas extends Component {
  state = {
    arenas: {},
    players: {},
  }

  playerHandlers = {}

  componentWillMount() {
    // arena added
    this.handleArenaAdded = base.arenasRef.on('child_added', (snapshot) => {
      const arenaKey = snapshot.key()

      // add arena
      this.state.arenas[arenaKey] = snapshot.val()
      this.setState(this.state)

      // listen to players, save callback
      this.playerHandlers[arenaKey] = base.playersRef
        .child(arenaKey)
        .on('value', snapshot => {
          this.state.players[snapshot.key()] = snapshot.val()
          this.setState(this.state)
        })
    })

    // arena removed
    this.handleArenaRemoved = base.arenasRef.on('child_removed', (snapshot) => {
      const arenaKey = snapshot.key()

      // remove arena
      delete this.state.arenas[arenaKey]
      this.setState(this.state)

      // cleanup players handler
      base.playersRef
        .child(arenaKey)
        .off('value', this.playerHandlers[arenaKey])
      delete this.playerHandlers[arenaKey]
    })
  }

  componentWillUnmount() {
    base.arenasRef.off('child_added', this.handleArenaAdded)
    base.arenasRef.off('child_removed', this.handleArenaRemoved)

    // remove all /players handlers for ever arena
    _.each(this.state.arenas, (val, arenaKey) => {
      base.playersRef.child(arenaKey).off('value', this.playerHandlers[arenaKey])
    })
  }

  renderPlayerList = arena => _.map(this.state.players[arena], (val, key) => (
    <div className='ui label' key={key}>
      @{key}
    </div>
  ))

  renderArenas = () => {
    return _.map(this.state.arenas, (val, key) => (
      <div className='ui segment' key={key}>
        <div className='ui header'>
          <Link to={`/${key}`}>{val.name}</Link>
        </div>
        {this.renderPlayerList(key)}
      </div>
    ))
  }

  render() {
    return (
      <div className='ui piled segments'>
        {this.renderArenas()}
      </div>
    )
  }
}
