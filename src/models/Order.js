const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
          required: true,
          unique: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        currPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema)
