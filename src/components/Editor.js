import _ from 'lodash'
import React, { Component, PropTypes } from 'react'

import 'brace'
import 'brace/ext/language_tools'
import 'brace/mode/javascript'
import 'brace/theme/tomorrow'
import AceEditor from 'react-ace'

import { prettyPrint } from '../lib/utils'
import * as base from '../lib/base'

const avatarStyle = {
  position: 'absolute',
  right: '0.5em',
  bottom: '0.5em',
  textAlign: 'right',
  fontSize: '0.875em',
  color: '#999',
  border: 'none',
  borderRadius: 0,
  zIndex: 9,
}

export default class Editor extends Component {
  static propTypes = {
    arena: PropTypes.string,
    avatar: PropTypes.string,
    github: PropTypes.string,
    height: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    height: '100px',
    onChange: _.noop,
  }

  state = {
    value: '',
  }

  componentWillMount = () => {
    const { arena, github } = this.props
    this.ref = base.editorsRef.child(`${arena}/${github}`)

    // initial value
    this.ref.once('value', snapshot => this.setState(snapshot.val()))

    // subscribe to changes
    this.ref.on('child_changed', this.receiveChildUpdate)
  }

  componentWillUnmount = () => {
    this.ref.off('child_changed', this.receiveChildUpdate)
  }

  receiveChildUpdate = (snapshot) => {
    this.setState({
      [snapshot.key()]: snapshot.val()
    })
  }

  handleChange = (value) => {
    const { arena, github, onChange } = this.props
    if (arena && github) {
      base.updateEditor(arena, github, { value })
    }
    if (onChange) onChange(value)
  }

  renderAvatar = () => {
    const { avatar, github, name} = this.props
    const { isHoveringAvatar } = this.state

    if (!avatar || !github || !name) return

    return (
      <a
        style={{ ...avatarStyle, opacity: isHoveringAvatar ? 1 : 0.5 }}
        href={`https://github.com/${github}`}
        target='_blank'
        onMouseEnter={() => this.setState({ isHoveringAvatar: true })}
        onMouseLeave={() => this.setState({ isHoveringAvatar: false })}
      >
        <img src={avatar} alt={name} className='ui avatar image' />
        @{github}
      </a>
    )
  }

  render() {
    const { value } = this.state
    const { github, height } = this.props
    return (
      <div className='column' style={{ position: 'relative' }}>
        {/*
         <b>Props</b>
         <pre>{prettyPrint(this.props)}</pre>
         */}
        {this.renderAvatar()}
        <AceEditor
          name={`editor-${github}`}
          mode='javascript'
          theme='tomorrow'
          width='100%'
          height={height}
          value={value}
          onChange={this.handleChange}
          editorProps={{ $blockScrolling: true }}
          showPrintMargin={false}
          tabSize={2}
          useSoftTabs
        />
        {/*
         <b>State Value</b>
         <pre>{this.state.value}</pre>
         */}
      </div>
    )
  }
}
