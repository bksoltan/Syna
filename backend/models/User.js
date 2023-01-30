const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  point: {
    type: Number,
    required: true,
  },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel, UserSchema };
