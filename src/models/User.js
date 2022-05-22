const mongoose = require("mongoose")

//Check name senseCase, requirement for each field
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
)

//Unique field
UserSchema.index({ username: 1, email: 1 }, { unique: true })

module.exports = mongoose.model("User", UserSchema)
