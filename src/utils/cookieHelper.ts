/**
 * Parses the given cookie string into and object where different cookies can be found by their key value
 * @param cookies continuous cookie string provided by frontend
 * @returns object where cookies are divided by key and value
 */

const parseCookies = (cookies: string) => {
  const obj: { [key: string]: any } = {}

  const cookiesNoSpaces = cookies.replace(/\s+/g, '')

  cookiesNoSpaces.split(';').forEach((cookie) => {
    const [key, value] = cookie.split('=')
    obj[key] = value
  })

  return obj
}

export { parseCookies }
