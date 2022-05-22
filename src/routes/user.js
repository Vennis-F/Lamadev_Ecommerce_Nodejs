const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken")
const User = require("../models/User")
const { encrPassword } = require("../utils/utils")

const router = require("express").Router()

//UPDATE (miss! error: wrong model, ivalid model)
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //Not update anything
  if (Object.keys(req.body).length === 0)
    return res.status(404).json({ error: "Infor update is empty!" })

  //If password update, hash it
  req.body.password && (req.body.password = encrPassword(req.body.password))

  //Update user
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    res.status(200).json(updatedUser)
  } catch (err) {
    res.status(500).json(err)
  }
})

//DELETE (! user tự xóa được ko ?)
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json("User has been deleted")
  } catch (error) {
    res.status(500).json(err)
  }
})

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...other } = user._doc
    res.status(200).json({ ...other })
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET USERs (|query new limit 5) (!question: thay _id thanh createdAt)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find()

    //Check empty users
    if (users.length === 0) return res.status(200).json("Don't have any user")

    //Not show password
    const usersFilter = users.map((user) => {
      const { password, ...other } = user._doc
      return other
    })
    res.status(200).json(usersFilter)
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET USERs STATs
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
  console.log(lastYear)
})

module.exports = router
