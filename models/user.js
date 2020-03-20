const mongoose = require("mongoose");
const USerSchema = new mongoose.Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: false
  },
  info: {
    desc: String,
    businessname: String,
    location: String
  },
  geo: {
    lat: Number,
    long: Number,
    proxy: String
  },
  whatsapp: {
    sandbox: String,
    number: Number
  },
  sms: {
    sid: String,
    token: String,
    number: String
  },
  created: {
    type: Date,
    default: Date.now()
  },
  basicinfo: {
    phonenumber: String,
    fullname: String
  },
  plan: {
    name: String,
    amount: Number,
    isActive: Boolean,
    remainder: Number
  },
  tags: { type: String }
});
USerSchema.index({ tags: "text" });
let UserClass = mongoose.model("User", USerSchema);
exports.User = UserClass;
exports.USerSchema = USerSchema;
