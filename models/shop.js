const mongoose = require("mongoose");
const ShopShema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  mediaurl: String,
  desc: String,
  price: String,
  title: String,

  created: {
    type: Date,
    default: Date.now()
  },
  updatedate: Date
});
ShopShema.index({
  desc: "text",
  title: "text",
  price: "text"
});
const ShopModel = mongoose.model("shop", ShopShema);
module.exports = ShopModel;
