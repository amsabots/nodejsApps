const mongoose = require("mongoose");
const log = mongoose.model(
  "whatsappLog",
  new mongoose.Schema({
    accountSid: {
      type: String,
      required: true,
      unique: true
    },
    bulk: {
      type: Number,
      default: 1
    },
    messages: [
      {
        to: String,
        logs: [
          {
            body: String,
            numMedia: Number,
            errorMessage: String,
            dateUpdated: Date,
            dateCreated: Date,
            status: String,
            sid: String,
            channel: String
          }
        ]
      }
    ]
  })
);
module.exports = log;
