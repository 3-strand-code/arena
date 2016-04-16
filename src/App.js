import * as Babel from 'babel-standalone'
import faker from 'faker'
import _ from 'lodash'
// import uuid from 'node-uuid'
import React from 'react'
import { render } from 'react-dom'

import ace from 'brace'
import 'brace/ext/language_tools'
import 'brace/mode/javascript'
import 'brace/theme/tomorrow'
import AceEditor from 'react-ace'

import logo from './helm.png'

const babelConfig = {
  presets: [
    'es2015',
    'stage-0',
  ]
}

const challenge = `hi('there') === 'there'`
// const uid = uuid.v4()

// TODO use location.hash to nest all state in a "room" on firebase
// 3sc-arena.firebase.io/arenas/{the hash}

class App extends React.Component {
  state = {
    challenge,
    // TODO, these 3 props belong to each user, move to array of users with these
    // this state shape only allows for a single user, need to have an array of users
    // each with a shape that looks like the current
    code: "// const hi = () => 'there'",
    error: null,
    passed: false,
  }

  testChallenge = _.throttle(() => {
    const { code, challenge } = this.state
    let error
    let passed = false
    try {
      const IIFE = `(function() {${code};return ${challenge}}())`
      const transformed = Babel.transform(IIFE, babelConfig).code
      passed = eval(transformed)
    } catch (err) {
      error = err.message
    }
    this.setState({ passed, error })
  }, 500)

  componentWillMount() {
    // TODO push the current user to array of users on firebase
    this.testChallenge()
  }

  handleChallengeChange = (newValue) => {
    this.setState({ challenge: newValue })
    this.testChallenge()
  }

  handleChangeCode = (code) => {
    this.setState({ code })
    this.testChallenge()
  }

  renderEditors = () => {
    const { code, passed } = this.state
    // TODO
    // render editor for every user in fb array
    // don't worry about adding the readOnly prop to editors that are no yours, yet
    return (
      <div className='column'>
        <AceEditor
          name='editor'
          mode='javascript'
          theme='tomorrow'
          width='100%'
          value={code}
          onChange={newVal => this.handleChangeCode(newVal)}
          editorProps={{$blockScrolling: true}}
          tabSize={2}
          useSoftTabs
        />
      </div>
    )
  }

  render() {
    const { challenge, passed } = this.state
    return (
      <div>
        <div className='ui hidden divider' />
        <div className='ui text container' style={{ display: 'flex' }}>
          <div style={{ flex: '0 0 6em' }}>
            <h2 className='ui center aligned small header'>
              <img src={logo} className='ui image' />
              <br />
              ARENA
            </h2>
          </div>
          <div style={{ flex: '1' }}>
            <AceEditor
              name='challenge-editor'
              mode='javascript'
              theme='tomorrow'
              width='100%'
              height='60px'
              value={challenge}
              onChange={this.handleChallengeChange}
              editorProps={{$blockScrolling: true}}
              tabSize={2}
              useSoftTabs
            />
          </div>
        </div>

        <div className='ui hidden divider' />

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
        <div className='ui equal width grid'>
          {this.renderEditors()}
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
