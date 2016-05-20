import React from 'react'
import { Route, IndexRoute } from 'react-router'

import LoggedIn from './layouts/LoggedIn'

import Arena from './views/Arena'
import Arenas from './views/Arenas'
import Login from './views/Login'
import Root from './views/Root'

import { preventAuth, redirect, requireAuth } from './hooks'

const routes = (
  <Route path='/' component={Root}>
    <Route path='login' component={Login} onEnter={preventAuth} />
    <Route component={LoggedIn} onEnter={requireAuth}>
      <IndexRoute component={Arenas} />
      <Route path=':arena' component={Arena} />
    </Route>
    <Route path='*' onEnter={redirect('/arenas')} />
  </Route>
)

export default routes
