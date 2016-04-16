/**
 * Our Firebase data wrapper to deal with our tree:
 *
 * const firebase = {
 *   arenas: {
 *     'battle-arena': {
 *       name: 'Battle Arena',
 *     },
 *   },
 *   editors: {
 *     [arena]: {
 *       [github]: {
 *         value: 'const foo = null',
 *       },
 *     },
 *   },
 *   players: {
 *     [arena]: {
 *       [github]: true,
 *     },
 *   },
 *   users: {
 *     [github]: {
 *       avatar: [auth.github.profileImageURL],
 *       name: [auth.github.displayName],
 *     },
 *   },
 * }
 */
import Firebase from 'firebase'
import _ from 'lodash'
import { browserHistory } from 'react-router'

const resolve = (...args) => _.flatten(_.compact(args)).join('/').replace(/\/\//g, '/')

export const URL = `https://3sc-arena.firebaseio.com/`
export const ENDPOINTS = {
  arenas: (...paths) => resolve('arenas', paths),
  editors: (...paths) => resolve('editors', paths),
  players: (...paths) => resolve('players', paths),
  users: (...paths) => resolve('users', paths),
}

export const ref = new Firebase(URL)
export const arenasRef = ref.child(ENDPOINTS.arenas())
export const editorsRef = ref.child(ENDPOINTS.editors())
export const playersRef = ref.child(ENDPOINTS.players())
export const usersRef = ref.child(ENDPOINTS.users())

const handleError = (err) => {
  if (!err) return

  switch (err.code) {
    case 'PERMISSION_DENIED':
      browserHistory.push('/login')
      break
    default:
      throw new Error(err)
  }
}

// ------------------------------------
// Auth
// ------------------------------------

export const getActiveUser = () => userFromAuth(ref.getAuth())

export const login = () => {
  ref.authWithOAuthPopup('github', (err, authData) => {
    if (err) {
      handleError(err)
    } else {
      const { github, ...rest } = userFromAuth(authData)
      updateUser(github, {
        lastLogin: Date.now(),
        ...rest,
      })
    }
  })
}

export const logout = () => ref.unauth()

export const onAuth = (callback) => {
  ref.onAuth(authData => {
    callback(userFromAuth(authData))
  })
}

const userFromAuth = (authData) => {
  if (!authData) return null

  const { displayName, profileImageURL, username } = authData.github
  return {
    github: username,
    name: displayName,
    avatar: profileImageURL,
  }
}

// ------------------------------------
// Arenas
// ------------------------------------

export const joinArena = (arena) => {
  const { github } = getActiveUser()

  editorsRef
    .child(resolve(arena, github, 'value'))
    .set('', handleError)

  playersRef
    .child(resolve(arena, github))
    .set(true, handleError)

  usersRef
    .child(resolve(github, 'lastPlay'))
    .set(Date.now(), handleError)
}

export const leaveArena = (arena) => {
  const { github } = getActiveUser()

  editorsRef
    .child(resolve(arena, github))
    .remove(handleError)

  playersRef
    .child(resolve(arena, github))
    .remove(handleError)
}

// ------------------------------------
// Editors
// ------------------------------------

export const updateEditor = (arena, github, data) => {
  editorsRef
    .child(resolve(arena, github))
    .update(data, handleError)
}

// ------------------------------------
// Users
// ------------------------------------

export const updateUser = (github, data) => {
  usersRef
    .child(github)
    .update(data)
    .catch(handleError)
}
