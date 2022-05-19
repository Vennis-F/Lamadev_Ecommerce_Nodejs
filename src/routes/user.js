const router = require("express").Router()

router.get("/usertest", (req, res) => res.send("API user run sucess"))
router.post("/userposttest", (req, res) => {
  const username = req.body.username
  res.send("Your name is " + username)
})

module.exports = router
