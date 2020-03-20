const router = require("express").Router();
const { User } = require("../models/user");
const config = require("config");
const { getClient } = require("../controllers/account");
const { Search } = require("../controllers/shop");
const _ = require("lodash");
const SendMessage = require("../controllers/send");
const { LogMessage } = require("../controllers/logmessages");
const { AddAux } = require("../helper/send");
//const sms = require("../controllers/sms");
const { UpdateTimeZone } = require("../controllers/logmessages");
const People = require("../models/logmessages");
var value = {
  message: [],
  number: 10
};
const { HashedRequests, SpecialWords } = require("../helper/wordsprocessor");
router.post("/reply", (req, res) => {
 console.log(req.body);
  let request = null,
    page = 0;
  getClient(req.body)
    .then(user => {
      if (Boolean(req.body.Body) && req.body.NumMedia < 1) {
        if (user.isActive) {
          const email = user.email;
          const not_allowed = config
            .get("hello")
            .concat(
              config.get("more"),
              config.get("location"),
              config.get("help")
            );
          if (
            not_allowed.indexOf(
              req.body.Body.replace(/[^a-zA-Z ]/g, "").toLowerCase()
            ) === -1 &&
            !checkCharacter(req.body.Body)
          ) {
            Search(email, req.body.Body, req.body.From.split(":")[1]).then(
              result => {
                if (!result[0]) {
                  value.message = [];
                  People.findOne({ From: req.body.From.split(":")[1] }).then(
                    ppl => {
                      if (ppl.messagesFrequency % 3 === 0) {
                        value.message.push(
                          {
                            desc: `😏😏 Sorry, No results matching your query\n${config.get(
                              "typo"
                            )}`
                          },
                          {
                            desc: config.get("wholeDb")
                          }
                        );
                      } else {
                        console.log("not zero", ppl.messagesFrequency);
                        value.message.push({
                          desc: `😏😏 Sorry, No results matching your query\n${config.get(
                            "typo"
                          )}`
                        });
                      }
                      console.log(value);
                      value.message.forEach(element => {
                        SendMessage(req.body, user, element)
                          .then(callback => console.log("SENDING>>>>>>>>"))
                          .catch(err => console.log(err));
                      });
                    }
                  );
                } else {
                  if (result.length === 3) {
                    value.message = [];
                    value.message.push(...result, {
                      desc: `Respond with\n 🔷🔷 more\n or\n  🔷🔷 Next\n to view more`
                    });
                  } else {
                    const found = result.some(el => el._doc.score >= 1);
                    if (found) {
                      value.message = [];
                      value.message.push(
                        ...result.filter(el => el._doc.score >= 1)
                      );
                    } else {
                      value.message = [];
                      value.message.push(
                        {
                          desc: `😏😏 I could not find the exact thing you are looking for but here are some *suitable suggestions*`
                        },
                        ...result
                      );
                    }
                  }
                }
                //console.log(value.message);
                value.message.forEach(element => {
                  SendMessage(req.body, user, element)
                    .then(callback => console.log("SENDING>>>>>>>>"))
                    .catch(err => console.log(err));
                });
              }
            );
            request = req.body.Body;
            LogMessage(request, req.body, page)
              .then(response =>
                console.log("Adding RequestBody To::", req.body.From)
              )
              .catch(err => console.log(err));
          }
          //end of search function
          else {
            if (checkCharacter(req.body.Body)) {
              //words with the hash prefix
              HashedRequests(req.body)
                .then(response => {
                  response.value.forEach(element => {
                    SendMessage(req.body, user, element)
                      .then(callback => console.log("SENDING>>>>>>>>"))
                      .catch(err => console.log(err));
                  });
                })
                .catch(err => console.log(err));
            } else {
              SpecialWords(req.body)
                .then(special => {
                  special.value.forEach(element => {
                    SendMessage(req.body, user, element)
                      .then(callback => console.log("SENDING>>>>>>>>"))
                      .catch(err => console.log(err));
                  });
                })
                .catch(err => console.log(err));
            }
            UpdateTimeZone(req.body)
              .then(result => console.log(result))
              .catch(err => console.log(err));
          }
        } else {
          //use admin account to  send messages
          // sms(user, {
          //   to: user.basicinfo.phonenumber,
          //   body: config.get("smsInsufficient")
          // })
          //   .then(message => console.log(message))
          //   .catch(err => console.log(err));
        }
      } else {
        console.log("some extra evaluation");
      }
    })
    .catch(err => console.log(err));
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
