const {
  LogMessage,
  AddMessage,
  addNewClient_Customer
} = require("../controllers/clientAreaLogs");
const Log = require("../models/whasappClientLogs");
const AddAux = function(twilio, account, message) {
  return new Promise((resolve, reject) => {
    const client = require("twilio")(twilio.AccountSid, account.sms.token);
    client.messages
      .create({
        from: twilio.To,
        body: message,
        to: twilio.From
      })
      .then(message => {
        resolve(message);
      })
      .catch(err => reject(err));
  });
};
const Logger = function(message) {
  return new Promise((resolve, reject) => {
    Log.findOne({ accountSid: message.accountSid }).then(result => {
      if (!result) LogMessage(message).then(res => resolve(res));
      else {
        Log.findOne({
          accountSid: message.accountSid,
          "messages.to": message.to.split(":")[1]
        })
          .then(ret => {
            if (!ret) {
              addNewClient_Customer(message).then(result => resolve(result));
            } else {
              AddMessage(message).then(result => resolve(result));
            }
          })
          .catch(err => reject(err));
      }
    });
  });
};
exports.AddAux = AddAux;
exports.Logging = Logger;
