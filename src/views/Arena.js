import * as Babel from 'babel-standalone'
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

// use const so names are preserved (not babelified)
// this allows the eval()'d scripts to use these modules
const faker = require('faker')
const _ = require('lodash')

import * as base from '../lib/base'
import { prettyPrint } from '../lib/utils'

import Editor from '../components/Editor'

const babelConfig = {
  presets: [
    'es2015',
    'stage-0',
  ]
}

const challenge = `hi('there') === 'there'`
const getEditorHeight = (ratio) => `${ratio * 70}vh`

export default class Arena extends Component {
  static propTypes = {
    params: PropTypes.shape({
      arena: PropTypes.string.isRequired,
    }).isRequired,
  }

  state = {
    users: {},
    editors: {},
  }

  componentWillMount = () => {
    window.addEventListener('beforeunload', this.componentWillUnmount)
    const { arena } = this.props.params
    base.joinArena(arena)

    // track users
    this.userHandlers = {}
    this.playersRef = base.playersRef.child(arena)

    // ----------------------------------------
    // Players
    // ----------------------------------------

    // added
    this.handlePlayerAdded = this.playersRef.on('child_added', snapshot => {
      const github = snapshot.key()
      const userRef = base.usersRef.child(github)

      // listen to player's user, save callback
      this.userHandlers[github] = userRef.on('value', snapshot => {
        if (snapshot.val()) {
          this.state.users[github] = { github, ...snapshot.val() }
          this.setState(this.state)
        }
      })
    })

    // removed
    this.handlePlayerRemoved = this.playersRef.on('child_removed', snapshot => {
      const github = snapshot.key()
      const userRef = base.usersRef.child(github)

      // remove user & listener
      userRef.off('value', this.userHandlers[github])
      delete this.state.users[github]

      this.setState(this.state)
    })
  }

  componentWillUnmount = () => {
    const { arena } = this.props.params

    this.playersRef.off('child_added', this.handlePlayerAdded)
    this.playersRef.off('child_removed', this.handlePlayerRemoved)

    // remove any remaining user listeners
    _.each(this.userHandlers, (callback, github) => {
      base.usersRef.child(github).off('value', callback)
    })

    window.removeEventListener('beforeunload', this.componentWillUnmount)

    base.leaveArena(arena)
  }

  // testChallenge = () => {
  //   const { code, localUser: { github } } = this.state
  //
  //   let error = null
  //   let passed = null
  //   try {
  //     const IIFE = `(function() {\n${code}\nreturn ${challenge}\n}())`
  //     const transformed = Babel.transform(IIFE, babelConfig).code
  //     passed = eval(transformed)
  //   } catch (err) {
  //     error = err.message
  //   }
  //   this.setState({ error, passed })
  //   // this.updateRemoteEditor(github, code, error, passed)
  // }

  renderOtherEditors = () => {
    const { arena } = this.props.params
    const { users } = this.state
    const otherUsers = _.omit(users, base.getActiveUser().github)
    const height = getEditorHeight(1 / _.keys(otherUsers).length)

    return _.isEmpty(otherUsers) ? (
      <div className='ui center aligned basic segment'>
        <div className='ui icon header'>
          <i className='share icon' />
          You're all alone, share the link!
        </div>
        <br />
        <br />
        <span className='ui large label'>
          {location.href.replace(/\?.*/, '')}
        </span>
      </div>
    ) : _.map(otherUsers, (user) => (
      <Editor
        key={user.github}
        arena={arena}
        height={height}
        {...user}
      />
    ))
  }

  render() {
    const { arena } = this.props.params
    const user = base.getActiveUser()
    // let passed

    return (
      <div>
        {/*
         TODO: Challenge:

         <div className='ui text container'>
         <Editor
         arena={arena}
         height='50px'
         onChange={this.handleChallengeChange}
         />

         <div className='ui center aligned horizontally padded grid'>
         <div className='column'>
         {passed ? (
         <div className='ui inverted green label'>
         <i className='thumbs up icon' /> Nice job!
         </div>
         ) : (
         <div className='ui label'>
         Write code to pass the challenge...
         </div>
         )}
         </div>
         </div>
         </div>

         <div className='ui divider'></div>
         */}

        <div className='ui equal width grid'>
          <div className='column'>
            <Editor arena={arena} height={getEditorHeight(1)} {...user} />
          </div>
          <div className='column'>
            {this.renderOtherEditors()}
          </div>
        </div>
        {/*
         <pre>{prettyPrint(this.state)}</pre>
         */}
      </div>
    )
  }
}
