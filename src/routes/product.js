const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken")
const Product = require("../models/Product")

const router = require("express").Router()

//CREATE  (miss! error: wrong model)
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  //Check miss infor
  if (
    !req.body.title ||
    !req.body.desc ||
    !req.body.img ||
    !req.body.categories ||
    !req.body.price
  )
    return res.status(404).send({ error: "Please input full infor product" })

  //Save to db
  const product = new Product(req.body)

  try {
    const savedProduct = await product.save()
    res.status(201).send(savedProduct)
  } catch (error) {
    //Error wrong model require
    res.status(500).send({ error })
  }
})

//UPDATE (miss! error: wrong model, ivalid model)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  //Not update anything
  if (Object.keys(req.body).length === 0)
    return res.status(404).json({ error: "Infor update is empty!" })

  //Update product
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    res.status(200).json(updatedProduct)
  } catch (err) {
    res.status(500).json(err)
  }
})

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json("Product has been deleted")
  } catch (error) {
    res.status(500).json(err)
  }
})

//GET PRODUCT: everybody can see
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET PRODUCTs (|query new limit 5) (!question: thay _id thanh createdAt)
router.get("/", async (req, res) => {
  const qNew = req.query.new
  const qCategory = req.query.category
  try {
    let products
    if (qCategory && qNew) {
      products = await Product.find({ categories: { $in: [qCategory] } })
        .sort({ createdAt: -1 })
        .limit(3)
    }
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(3)
    } else if (qCategory) {
      products = await Product.find({ categories: { $in: [qCategory] } })
    } else {
      products = await Product.find()
    }

    //Check empty products
    const jsonData = products.length === 0 ? "Don't have any user" : products
    res.status(200).json(jsonData)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
