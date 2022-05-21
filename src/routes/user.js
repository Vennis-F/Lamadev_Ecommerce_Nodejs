const { verifyToken } = require("../middlewares/verifyToken")

const router = require("express").Router()

//UPDATE
router.post("/:id", verifyToken, (req, res) => {})

module.exports = router
