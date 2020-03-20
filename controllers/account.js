const { User } = require("../models/user");
function getClient(message) {
  return new Promise((resolve, reject) => {
    User.findOne({ "sms.sid": message.AccountSid })
      .then(user => {
        resolve(user);
      })
      .catch(err => reject(err));
  });
}
function getClientbyEmail(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .then(user => {
        resolve(user);
      })
      .catch(err => reject(err));
  });
}
exports.getClient = getClient;
exports.getClientEmail = getClientbyEmail;
