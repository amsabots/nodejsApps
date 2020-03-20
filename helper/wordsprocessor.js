const User = require("../models/user");
const config = require("config");
const shop = require("../models/shop");
const { FetchMore } = require("../controllers/shop");
const { LogMessage } = require("../controllers/logmessages");
const { Search } = require("../controllers/shop");
const { getClient } = require("../controllers/account");
const SendMessage = require("../controllers/send");
const { StartSession, RemoveOrder } = require("../controllers/order");
const { getLocationSuggestion } = require("../helper/natural");
let message = {
  value: []
};
function HashedRequests(word) {
  return new Promise((resolve, reject) => {
    message.value = [];
    let action = word.Body.split("#")[0];
    if (Boolean(action)) {
      if (EvaluateWord("feedback", action)) {
        message.value = [];
        let Client = { value: null };
        getClient(word).then(user => {
          Client.value = user.info.businessname;
        });
        message.value.push({
          desc: `Thank you for your feedback🙏🏾💙.The account owner *[${Client.value}]* has been notified`
        });
        resolve(message);
      } else if (EvaluateWord("ord", action)) {
        StartSession(word).then(result => {
          message.value = [];
          message.value.push(...result.value);
          resolve(message);
        });
      } else if (EvaluateWord("delete", action)) {
        RemoveOrder(word)
          .then(remove => {
            message.value = [];
            message.value.push(...remove.value);
            resolve(message);
          })
          .catch(err => console.log(err));
      } else if (EvaluateWord("find", action)) {
        getLocationSuggestion(word.Body.split("#")[1]).then(result => {
          result.forEach(element => {
            message.value.push({
              desc: element
            });
            resolve(message);
          });
        });
      }
    } else {
      message.value = [];
      message.value.push({
        desc: "invalid action request❗️❗️, Reply with *help* to find out why"
      });
      resolve(message);
    }
  });
}
function SpecialWords(word) {
  return new Promise((resolve, reject) => {
    if (EvaluateWord("more", word.Body)) {
      FetchMore(word.From.split(":")[1]).then(last => {
        LogMessage(last[0].message.body, word, 1 + last[0].message.page)
          .then(response =>
            console.log("ADDING USER-MESSAGE FROM MORE::", word.From)
          )
          .catch(err => console.log(err));
        getClient(word)
          .then(user => {
            Search(
              user.email,
              last[0].message.body,
              word.From.split(":")[1],
              1 + last[0].message.page
            ).then(result => {
              if (!result[0]) {
                message.value = [];
                message.value.push(
                  { desc: config.get("wholeDb") },
                  {
                    desc:
                      " 😏😏 No more Results Available for the query you requested above 👆🏽👆🏽 "
                  }
                );
              } else {
                if (result.length === 3) {
                  message.value = [];
                  message.value.push(
                    {
                      desc: `Respond with\n 🔷🔷 more\n or\n  🔷🔷 Next\n to view more`
                    },
                    ...result
                  );
                } else {
                  message.value = [];
                  message.value.push(...result);
                }
              }
              resolve(message);
            });
          })
          .catch(err => reject(err));
      });
    } else {
      if (EvaluateWord("hello", word.Body)) {
        message.value = [];
        getClient(word).then(res => {
          let desc = Boolean(res.info.desc)
            ? res.info.desc
            : `This is DiscoveryCity enabled chatBot for whatsapp business::\nIf you are not sure on the way forward *ask for help❓❓* by replying with *help*`;
          message.value.push({
            desc: `${GetRandomResponse("helloresponse")}${desc}`
          });
          resolve(message);
        });
      } else if (EvaluateWord("location", word.Body)) {
        message.value = [];
        message.value.push(
          {
            desc:
              "The business owner has not provided any location info for both geo location coordinates or relative description"
          },
          {
            desc:
              "Opening and closing hours for all business and enterprisesa are computed by the system and at the moment the system ins under maintenance"
          }
        );
        resolve(message);
      } else if (EvaluateWord("help", word.Body)) {
        message.value = [];
        message.value.push({
          desc: `${config.get("helpresponse")}`
        });
        resolve(message);
      }
    }
  });
}
exports.HashedRequests = HashedRequests;
exports.SpecialWords = SpecialWords;
function EvaluateWord(array, word) {
  if (
    config.get(array).indexOf(word.replace(/[^a-zA-Z ]/g, "").toLowerCase()) !==
    -1
  )
    return true;
  else return false;
}
function GetRandomResponse(array) {
  let index = Math.floor(Math.random() * config.get(array).length);
  return config.get(array)[index];
}
