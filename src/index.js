const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()
const userRoute = require("./routes/user.js")
const productRoute = require("./routes/product.js")
const cartRoute = require("./routes/cart.js")
const orderRoute = require("./routes/order.js")
const authRoute = require("./routes/auth.js")
const PORT = process.env.PORT || 3000
dotenv.config()

//Connect to database
mongoose
  .connect(process.env.MONGOO_URL, {
    autoIndex: true,
  })
  .then(() => console.log("DB connection sucess"))
  .catch((err) => console.log(err))

//Restful
app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/product", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
