const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken")
const Order = require("../models/Order")
const router = require("express").Router()

//CREATE  (miss! error: wrong model --- error! nên giới hạn chỉ cho guest và user)
router.post("/", verifyToken, async (req, res) => {
  //Save to db
  const order = new Order(req.body)

  try {
    const savedOrder = await order.save()
    res.status(201).send(savedOrder)
  } catch (error) {
    //Error wrong model require
    res.status(400).send(error)
  }
})

//UPDATE (miss! error: wrong model, ivalid model --- ko cho update user id)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  //Not update anything
  if (Object.keys(req.body).length === 0)
    return res.status(404).json({ error: "Infor update is empty!" })

  //Update order
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      {
        userId: req.params.id,
      },
      { $set: req.body },
      { new: true, runValidators: true }
    )
    res.status(200).json(updatedOrder)
  } catch (err) {
    res.status(400).json(err)
  }
})

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findOneAndDelete({ userId: req.params.id })
    res.status(200).json("Order has been deleted")
  } catch (error) {
    res.status(500).json(err)
  }
})

//GET ORDER: everybody can see
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id })
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET PRODUCTs
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    let orders = await Order.find()
    //Check empty Orders
    const jsonData = orders.length === 0 ? "Empty Orders" : orders
    res.status(200).json(jsonData)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  //Xet truong hop thang 1 tru di 1
  const date = new Date()
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1))

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ])
    res.status(200).json(income)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
