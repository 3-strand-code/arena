import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const mountNode = document.createElement('div')
document.body.appendChild(mountNode)

if (__DEV__) {
  if (module.hot) {
    const AppContainer = require('react-hot-loader').AppContainer

    ReactDOM.render((
      <AppContainer>
        <App />
      </AppContainer>
    ), mountNode)

    module.hot.accept('./App', () => {
      const NextApp = require('./App').default
      ReactDOM.render((
        <AppContainer>
          <NextApp />
        </AppContainer>
      ), mountNode)
    })
  }
} else {
  ReactDOM.render((<App />), mountNode)
}
