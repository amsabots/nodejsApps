const MessageSchema = require("../models/logmessages");
const _ = require("lodash");
function Log(request, message, page = 0) {
  return new Promise((resolve, reject) => {
    MessageSchema.findOne({ From: message.From.split(":")[1] })
      .then(user => {
        if (!user) {
          new MessageSchema({
            From: message.From.split(":")[1],
            message: [
              {
                MessageSid: message.MessageSid,
                AccountSid: message.AccountSid,
                body: request
              }
            ]
          })
            .save()
            .then(save => resolve(save))
            .catch(err => reject(err));
        } else {
          MessageSchema.updateOne(
            { From: message.From.split(":")[1] },
            {
              $push: {
                message: [
                  {
                    MessageSid: message.MessageSid,
                    AccountSid: message.AccountSid,
                    body: request,
                    page: page
                  }
                ]
              }
            }
          )

            .then(shop => resolve(shop))
            .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
  });
}
function UpdateTimeZone(twilio) {
  return new Promise((resolve, reject) => {
    MessageSchema.findOne({ From: twilio.From.split(":")[1] }).then(mydocs => {
      let arr = mydocs.message;
      arr.forEach((element, index, array) => {
        if (index === array.length - 1) {
          let messageSid = element.MessageSid;
          MessageSchema.updateOne(
            {
              From: twilio.From.split(":")[1],
              "message.MessageSid": messageSid
            },
            { $set: { "message.$.Created": Date.now() } }
          )
            .then(result => resolve(result))
            .catch(err => reject(err));
        }
      });
    });
  });
}
exports.LogMessage = Log;
exports.UpdateTimeZone = UpdateTimeZone;
