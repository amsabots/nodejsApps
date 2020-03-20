const mongoose = require("mongoose");

module.exports = mongoose.model(
  "order",
  new mongoose.Schema({
    accountSid: String,
    OrderID: { type: String, required: true },
    name: String,
    User: String,
    stage: { type: Number, default: 0 },
    created: {
      type: Date
    },
    session: {
      type: String,
      default: "pending"
    },
    quantity: Number
  })
);
