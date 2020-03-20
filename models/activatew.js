const mongoose = require("mongoose");
const Whatsapp = mongoose.model(
  "whatsapp",
  new mongoose.Schema({
    plan: {
      name: String,
      amount: Number,
      isActive: Boolean,
      remainder: Number
    }
  })
);
module.exports = Whatsapp;
