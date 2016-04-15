import React from 'react'
import { render } from 'react-dom'
import logo from './helm.png'

class App extends React.Component {
  render() {
    return (
      <div className='ui container'>
        <div className='ui hidden divider' />
        <div className='ui middle aligned center aligned grid'>
          <div className='five wide column'>
            <h2 className='ui blue image header'>
              <img src={logo} className='image' />
            </h2>
            <form className='ui large form'>
              <div className='ui stacked segment'>
                <div className='field'>
                  <div className='ui left icon input'>
                    <i className='user icon'></i>
                    <input type='text' name='email' placeholder='E-mail address' />
                  </div>
                </div>
                <div className='field'>
                  <div className='ui left icon input'>
                    <i className='lock icon'></i>
                    <input type='password' name='password' placeholder='Password' />
                  </div>
                </div>
                <div className='ui fluid large blue submit button'>Login</div>
              </div>
              <div className='ui error message'></div>
            </form>
            <div className='ui message'>
              New to us? <a href='#'>Sign Up</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
