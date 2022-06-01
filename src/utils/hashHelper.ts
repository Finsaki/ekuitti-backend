import crypto from 'crypto'

//Inspiration from https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/

//generates random string of characters i.e salt
const genRandomString = (length: number) => {
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex') //convert to hexadecimal format
    .slice(0,length) //return required number of characters
}

//hash password with sha512.
//can be used in either hashing the password or removing the hash from hashedpassword
const sha512 = (password: string, salt: string) => {
  const hash = crypto.createHmac('sha512', salt) //Hashing algorithm sha512
  hash.update(password)
  //returning the passwordhash in hexadecimal
  return hash.digest('hex')
}

export { genRandomString, sha512 }