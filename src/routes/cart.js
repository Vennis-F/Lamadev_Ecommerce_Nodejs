const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken")
const Cart = require("../models/Cart")
const router = require("express").Router()

//CREATE  (miss! error: wrong model --- error! nên giới hạn chỉ cho guest và user)
router.post("/", verifyToken, async (req, res) => {
  //Save to db
  const cart = new Cart(req.body)

  try {
    const savedCart = await cart.save()
    res.status(201).send(savedCart)
  } catch (error) {
    //Error wrong model require
    res.status(400).send(error)
  }
})

//UPDATE (miss! error: wrong model, ivalid model --- ko cho update user id)
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //Not update anything
  if (Object.keys(req.body).length === 0)
    return res.status(404).json({ error: "Infor update is empty!" })

  //Update product
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      {
        userId: req.params.id,
      },
      { $set: req.body },
      { new: true, runValidators: true }
    )
    res.status(200).json(updatedCart)
  } catch (err) {
    res.status(400).json(err)
  }
})

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.id })
    res.status(200).json("Cart has been deleted")
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET PRODUCT: everybody can see
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.id })
    res.status(200).json(cart)
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET PRODUCTs
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    let carts = await Cart.find()
    //Check empty carts
    const jsonData = carts.length === 0 ? "Empty carts" : carts
    res.status(200).json(jsonData)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
