//With this file info and error messages can be separeted and used instead of console.log

const info = (...params: String[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}
  
const error = (...params: String[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

const debug = (...params: String[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...params)
  }
}
  
export {
  info, error, debug
}