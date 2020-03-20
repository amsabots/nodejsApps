const twilio = require("twilio");
const { Logging } = require("../helper/send");
module.exports = function(twilio, account, message, type = "whatsapp") {
  return new Promise((resolve, reject) => {
    const client = require("twilio")(twilio.AccountSid, account.sms.token);
    let { title, desc, price, mediaurl, _id } = message;
    let { From, To } = twilio;
    let createbody = null;
    title = typeof title == "undefined" ? "" : `*${title}*\n`;
    price = typeof price == "undefined" ? "" : `\n_${price}_`;
    _id =
      typeof _id == "undefined"
        ? ""
        : `\n--------------------------------\n 🆔: *${_id}*`;

    if (type == "whatsapp") {
      createbody = title.concat(desc, price, _id);
      From = From;
      To = To;
    } else {
      //send sms
      From = From.split(":")[1];
      To = To.split(":")[1];
    }
    if (!mediaurl) {
      client.messages
        .create({
          friendlyName: "My First Messaging Service",
          from: To,
          body: createbody,
          to: From
        })
        .then(message => {
          Logging(message).then(log => console.log("client"));
        })
        .catch(err => reject(err));
    } else {
      client.messages
        .create({
          mediaUrl: [mediaurl],
          from: To,
          body: createbody,
          to: From
        })
        .then(message => {
          Logging(message).then(log => console.log("client"));
        })
        .catch(err => reject(err));
    }
  });
};
