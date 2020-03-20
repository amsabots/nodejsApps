//whatsapp webhook
var express = require("express");
var app = express();
let router = require("express").Router();
let { User } = require("../models/user");
let {
  SendMessage,
  SendMedia,
  SendLocationMedia,
  SendDoubleTextMessage
} = require("../helpers/whatsapp");
let { SMS } = require("../helpers/sms");
const { MessagingResponse } = require("twilio").twiml;
const mimeTypes = require("mime-types");
const config = require("config");
router.post("/sms", (req, res) => {
  const { body } = req;
  User.findOne({ "sms.sid": body.AccountSid })
    .then(user => {
      if (!user.isActive) {
        SMS(
          user.sms.sid,
          user.sms.token,
          `+${user.basicinfo.phonenumber}`,
          `+${user.sms.number}`,
          config.get("smsInsufficient")
        )
          .then(result => console.log(result))
          .catch(err => console.log(err));
      } else {
        var message = null;
        if (checkCharacter(body.Body)) {
          let response = body.Body.split("#")[0]
            .toLowerCase()
            .trim();
          var allowed = [
            "feedback",
            "att",
            "attention",
            "order",
            "fd",
            "feed",
            "a"
          ];
          if (allowed.indexOf(response) === -1 || response == null) {
            message = config.get("responseError.invalid#");
          } else {
            var feedback = ["feedback, feed, fd"];
            var att = ["att", "attention", "atention", "attn", "a"];
            if (feedback.indexOf(response) !== -1) {
            }
            //end of feedback handler
            else if (att.indexOf(response) !== -1) {
              SMS(
                user.sms.sid,
                user.sms.token,
                `+${user.basicinfo.phonenumber}`,
                `+${user.sms.number}`,
                config.get("requestAtt")
              )
                .then(result => console.log(result))
                .catch(err => console.log(err));
            }
            //end of attention handler
          }
          SendMessage(user.sms.sid, user.sms.token, body.From, body.To, message)
            .then(result => console.log(result))
            .catch(err => console.log(err.message));
        }
        //   //end of if response contains a special character i.e # and /
        //   //start of if it does not contain any special character clause
        else {
          let response = body.Body.toLowerCase();
          //handle help me request
          message = [];

          if (loopTest(response, config.get("help"))) {
            message.push(`If you are stuck here are a few tips`);
          } else if (loopTest(response, config.get("hello"))) {
            message.push(
              `Hi welcome to, ${user.info.businessname}\n${user.info.desc}`
            );
            message.push(`Here are a few products we offer to get you started on your search and knowing more abouts us \n*[${user.tags}]*\n
              respond with anything in bold for more info`);
          } else if (loopTest(response, config.get("info"))) {
            message.push("hello info");
          } else if (loopTest(response, config.get("location"))) {
            message.push(`*Location Info:* ${user.info.location}`);
            message.push(
              `For more info, respond with *info* to see more details`
            );
          }
          SendDoubleTextMessage(
            user.sms.sid,
            user.sms.token,
            body.From,
            body.To,
            message
          )
            .then(result => console.log(result))
            .catch(err => console.log(err.message));
          //end of general infomation to be fetched
          if (loopTest(response, ["clothes"])) {
            SendTextMessage(
              user.sms.sid,
              user.sms.token,
              body.From,
              body.To,
              "king"
            )
              .then(result => console.log(result))
              .catch(err => console.log(err.message));
          }
        }
      }
    })
    .catch(err => res.send(err));
});
module.exports = router;

function checkCharacter(string) {
  var format = /#/;
  if (format.test(string)) {
    return true;
  } else {
    return false;
  }
}
function loopTest(str, condition) {
  for (var i = 0; i < condition.length; i++) {
    if (str.indexOf(condition[i]) !== -1) {
      return true;
    }
  }
  return false;
}
function CheckTest(str, condition) {
  let clean = str.replace(/[^a-zA-Z ]/g, "");
  let string = clean.split(" ");
  for (var i = 0; i < string.length; i++) {
    if (condition.indexOf(string[i]) !== -1) {
      return true;
    }
  }
  return false;
}
//proxy = `,
// SendMessage(
//   user.sms.sid,
//   user.sms.token,
//   body.From,
//   body.To,
//   "hello there"
// )
//   .then(result => console.log(result))
//   .catch(err => console.log(err));
