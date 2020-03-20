const { getClient } = require("../controllers/account");
module.exports = function SendSms(twilio, message) {
  return new Promise((resolve, reject) => {
    getClient(twilio).then(user => {
      let { sid, token, number } = user.sms;
      const client = require("twilio")(sid, token);
      client.messages
        .create({
          to: twilio.From.split(":")[1],
          body: message,
          statusCallback: "http://f6a1d4b1.ngrok.io/sms/status",
          from: number
        })
        .then(message => resolve(message))
        .catch(err => reject(err));
    });
  });
};
