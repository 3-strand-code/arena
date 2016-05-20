import * as base from './lib/base'

export const redirect = to => (nextState, replace) => replace(to)

export const requireAuth = (nextState, replace) => {
  if (!base.getActiveUser()) {
    replace('login')
  }
}

export const preventAuth = (nextState, replace) => {
  if (base.getActiveUser()) {
    replace('')
  }
}
