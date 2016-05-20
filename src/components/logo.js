import React, { Component, PropTypes } from 'react'
import cx from 'classnames'

import logo from '../assets/logo.png'

const headerStyles = {
  fontWeight: '100'
}

const imageSizeMap = {
  big: '',
  large: 'tiny',
  small: 'mini',
  tiny: 'mini',
}

const imageStyles = {
  marginLeft: 0,
  marginRight: 0,
}

export default class Logo extends Component {
  static propTypes = {
    iconOnly: PropTypes.bool,
    size: PropTypes.oneOf([
      'big',
      'large',
      'small',
      'tiny',
    ]),
    text: PropTypes.string,
  }

  render() {
    const { iconOnly, size, text } = this.props
    const headerClasses = cx(
      'ui center aligned',
      size,
      'header',
    )
    const imageClasses = cx(
      'ui',
      imageSizeMap[size] || 'tiny',
      'image'
    )
    const subHeaderClasses = cx(
      size === 'tiny' && 'sub header',
    )
    return (
      <h1 className={headerClasses} style={headerStyles}>
        <img src={logo} className={imageClasses} style={imageStyles} />
        {!iconOnly && (
          <div className={subHeaderClasses}>
            {text || 'ARENA'}
          </div>
        )}
      </h1>
    )
  }
}
