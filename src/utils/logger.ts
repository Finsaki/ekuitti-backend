/**
 * With this file info, error and debug messages can be separeted and used instead of console.log
 */

const info = (...params: String[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('[INFO]', ...params)
  }
}

const error = (...params: String[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('[ERROR]', ...params)
  }
}

const debug = (...params: String[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DEBUG]', ...params)
  }
}

export {
  info, error, debug
}