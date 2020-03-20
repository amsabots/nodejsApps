const lastText = require("../models/logmessages");
let moment = { value: null };
const config = require("config");
const Cron = require("node-cron");
const { User } = require("../models/user");
function getAllLastText() {
  return new Promise((resolve, reject) => {
    lastText
      .aggregate([
        {
          $project: {
            From: 1,
            last: { $arrayElemAt: ["$message", -1] }
          }
        }
      ])
      .then(message => resolve(message))
      .catch(err => resolve(err));
  });
}
let Message = { person: [] };
function ReturnLastText() {
  return new Promise((resolve, reject) => {
    var ONE_HOUR = 60 * 60 * 1000;
    getAllLastText()
      .then(text => {
        for (let index = 0; index < text.length; index++) {
          User.findOne({ "sms.sid": text[index].last.AccountSid }).then(
            user => {
              if (user) {
                let name = Boolean(user.info.businessname)
                  ? user.info.businessname
                  : "DiscoveryCity Services";
                let lasttext = new Date(text[index].last.Created).getTime();
                let now = new Date().getTime();
                let timeNow = getCurrentHour();
                let HoursAgo = Math.floor((now - lasttext) / ONE_HOUR);

                if (HoursAgo < 24) {
                  if (HoursAgo < 20) {
                    Message.person.push({
                      channel: "whatsapp",
                      to: `whatsapp:${text[index].From}`,
                      token: user.sms.token,
                      sid: text[index].last.AccountSid,
                      from: `whatsapp:+${user.whatsapp.number}`,
                      body: `${GetRandomResponse("timeago.lessthan10")}\n${
                        timeNow.value
                      }`
                    });
                  } else {
                  }
                }
              }
            }
          );
        }
        resolve(Message);
      })
      .catch(err => reject(err));
  });
}

//   } else if (HoursAgo > 20 && HoursAgo <= 23) {
//     User.findOne({ "sms.sid": element.last.AccountSid })
//       .then(user => {
//
//         Message.value = [];
//         Message.To = [];
//         Message.state = [];
//         Message.sender = [];
//         Message.value.push({
//           desc: `Your Active session with ${name}, is about *2 hours to expire*,You can say a simple _hi_ to keep it active for the next 24hrs.\n${timeNow}`
//         });
//         Message.state = "whatsapp";
//         Message.sender = element.last.AccountSid;
//         Message.To = element.From;
//         resolve(Message);
//       })
//       .catch(err => reject(err));
//   }
//else {
//   Message.value = [];
//   Message.To = [];
//   Message.state = [];
//   Message.sender = [];
//   Message.state = "sms";
//   Message.sender = element.last.AccountSid;
//   Message.To = element.From;
//   resolve(Message);
// }
// });
//})
//.catch(err => reject(err));

function getCurrentHour() {
  let hour = new Date().getHours();
  let minutes = new Date().getMinutes();
  if (hour < 7) moment.value = "Good Morning and enjoy the rest of the day";
  else if (hour > 7 && hour < 12)
    moment.value = "👍🏽👍🏽Enjoy your day today *#blessings*";
  else if (hour > 12 && hour < 18)
    moment.value = "Really Hope you are having  or you had a fantastic day👌🏽👌🏽";
  else if (hour > 18 && hour > 23)
    moment.value = "Have a great night ahead *goodnight*";
  else moment.value = "have a really great time ahead";
  return moment;
}
function GetRandomResponse(array) {
  let index = Math.floor(Math.random() * config.get(array).length);
  return config.get(array)[index];
}
function echossume() {
  return "hello world";
}
exports.ReturnLastText = ReturnLastText;
exports.getAllLastText = getAllLastText;
