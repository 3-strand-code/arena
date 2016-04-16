import _ from 'lodash'
import stringify from 'json-stringify-safe'

/**
 * Pretty print objects with circular references and methods.
 * @param {{}} obj The object to pretty print.
 */
export const prettyPrint = (obj) => stringify(obj, (key, val) => {
  if (_.isFunction(val)) return `[${val.toString().match(/^.*\)/)} {...}]`

  if (_.isUndefined(val)) return 'undefined'

  // default
  return val
}, 2).replace(/"/g, '')
