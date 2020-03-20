const mongoose = require("mongoose");
const message = mongoose.model(
  "people",
  new mongoose.Schema({
    From: String,
    messagesFrequency: { type: Number, default: 0 },
    message: [
      {
        MessageSid: String,
        AccountSid: String,
        Created: {
          type: Date,
          default: Date.now()
        },
        body: String,
        page: {
          type: Number,
          default: 0
        }
      }
    ]
  })
);
const number = mongoose.model(
  "contact",
  new mongoose.Schema({
    accountSid: String
  })
);
module.exports = message;
