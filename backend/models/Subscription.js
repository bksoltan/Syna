const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriptionSchema = Schema({
  full_name: String,
  // metamask account number
  address: {
    type: String,
    required: true,
  },
  phone: String,
  email: String,
  earned_points: {
    type: Number,
    required: true,
  },
});

const SubscriptionModel = mongoose.model("subscription", SubscriptionSchema);

module.exports = { SubscriptionModel, SubscriptionSchema };
