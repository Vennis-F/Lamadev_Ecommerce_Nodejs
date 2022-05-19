const CryptoJS = require("crypto-js")
const dotenv = require("dotenv")
dotenv.config()
const secureKey = process.env.SEC_KEY

//ENCRYPT PASSWORD
const encrPassword = (password) =>
  CryptoJS.AES.encrypt(password, secureKey).toString()

//DECRYPT PASSWORD
const decrPassword = (password) =>
  CryptoJS.AES.decrypt(password, secureKey).toString(CryptoJS.enc.Utf8)

module.exports = { encrPassword, decrPassword }
