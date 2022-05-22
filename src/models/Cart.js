const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    products: [
      {
        //Cho duplicated product ko ???}
        productId: {
          type: String,
          required: true,
        },
        //>=0
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

//Unique field
CartSchema.index({ userId: 1 }, { unique: true })

module.exports = mongoose.model("Cart", CartSchema)
