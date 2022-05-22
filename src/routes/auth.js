const User = require("../models/User")
const router = require("express").Router()
const jwt = require("jsonwebtoken")
const { decrPassword, encrPassword } = require("../utils/utils")
const { json } = require("express")

// REGISTER (miss! error: wrong model)
router.post("/register", async (req, res) => {
  //Check miss infor
  if (!req.body.username || !req.body.email || !req.body.password)
    return res.status(404).send({ error: "Please input full infor" })

  //Save to db
  const { username, email, password } = req.body
  const encrPwd = encrPassword(password)
  const user = new User({
    username,
    email,
    password: encrPwd,
  })

  try {
    const savedUser = await user.save()
    res.status(201).send(savedUser)
  } catch (error) {
    //Error wrong model require
    res.status(500).send({ error })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  //Check miss infor
  if (!req.body.username || !req.body.password)
    return res.status(404).send({ error: "Please input full infor" })

  try {
    const { username, password: pwdLogin } = req.body

    //Check username
    const user = await User.findOne({ username })
    if (!user) return res.status(401).json("Wrong  credentials!")

    //Check password
    const decrPwd = decrPassword(user.password)
    if (decrPwd !== pwdLogin) return res.status(401).json("Wrong  credentials!")

    //Push Jwt key
    const { _id: id, isAdmin } = user
    const accessToken = jwt.sign({ id, isAdmin }, process.env.SEC_JWT)

    //Login sucess (!not send pwd)
    const { password, ...other } = user._doc
    res.status(200).json({ ...other, accessToken })
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
