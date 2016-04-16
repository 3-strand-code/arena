import React, { Component, PropTypes } from 'react'
import { routerShape } from 'react-router'

import * as base from '../lib/base'

export default class Root extends Component {
  static contextTypes = {
    router: routerShape.isRequired,
  }

  componentWillMount() {
    const { router } = this.context

    // auto redirect user on auth change
    base.onAuth(user => {
      if (user) {
        if (router.isActive('login')) {
          router.replace('')
        }
      } else {
        router.replace('login')
      }
    })
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
