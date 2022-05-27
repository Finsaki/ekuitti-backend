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
