const User = require("../models/User")
const router = require("express").Router()
const { decrPassword, encrPassword } = require("../utils/utils")

// REGISTER
router.post("/register", async (req, res) => {
  //Check miss infor
  if (!req.body.username || !req.body.email || !req.body.password)
    return res.status(404).send({ error: "Please input full infor" })
  console.log(encrPassword("hello"))

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

module.exports = router
