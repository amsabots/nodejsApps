const Log = require("../models/whasappClientLogs");
const _ = require("lodash");
function LogMessage(logs) {
  return new Promise((resolve, reject) => {
    new Log({
      accountSid: logs.accountSid,
      messages: [
        {
          to: logs.to.split(":")[1],
          logs: _.pick(logs, [
            "body",
            "sid",
            "errorMessage",
            "dateUpdated",
            "dateCreated",
            "status",
            "numMedia"
          ])
        }
      ]
    })
      .save()
      .then(result => resolve({ error: false, message: "saved successfully" }))
      .catch(err => reject(err));
  });
}
function AddMessage(message) {
  return new Promise((resolve, reject) => {
    Log.updateOne(
      {
        accountSid: message.accountSid,
        "messages.to": message.to.split(":")[1]
      },
      {
        $push: {
          "messages.$.logs": _.pick(message, [
            "body",
            "sid",
            "errorMessage",
            "dateUpdated",
            "dateCreated",
            "status",
            "numMedia"
          ])
        }
      }
    )
      .then(res => {
        Increment(message).then(mss =>
          resolve({ error: false, message: "message added successfully" })
        );
      })
      .catch(err => reject(err));
  });
}
function Increment(message) {
  return new Promise((resolve, reject) => {
    Log.updateOne(
      { accountSid: message.accountSid },
      {
        $inc: { bulk: 1 }
      }
    )
      .then(user => resolve(user))
      .catch(errr => reject(errr));
  });
}
function addNewClient_Customer(message) {
  return new Promise((resolve, reject) => {
    Log.updateOne(
      {
        accountSid: message.accountSid
      },
      {
        $push: {
          messages: [
            {
              to: message.to.split(":")[1],
              logs: _.pick(message, [
                "body",
                "sid",
                "errorMessage",
                "dateUpdated",
                "dateCreated",
                "status",
                "numMedia"
              ])
            }
          ]
        }
      }
    )
      .then(res => {
        Increment(message).then(mss =>
          resolve({ error: false, message: "message added successfully" })
        );
      })
      .catch(err => reject(err));
  });
}
function UpdateMessageStatus(twilio) {
  return new Promise((resolve, reject) => {
    Log.updateOne(
      {
        accountSid: twilio.AccountSid
      },
      {
        $set: {
          "messages.$[message].logs.$[log].status": twilio.SmsStatus,
          "messages.$[message].logs.$[log].channel": twilio.ChannelPrefix
        }
      },
      {
        arrayFilters: [
          { "message.to": twilio.ChannelToAddress },
          { "log.sid": twilio.SmsSid }
        ],
        new: true
      }
    )
      .then(message => resolve(message))
      .catch(err => reject(err));
  });
}

exports.LogMessage = LogMessage;
exports.AddMessage = AddMessage;
exports.UpdateMessageStatus = UpdateMessageStatus;
exports.addNewClient_Customer = addNewClient_Customer;
