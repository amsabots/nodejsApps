const natural = require("natural");
const Shops = require("../models/shop");
const { User } = require("../models/user");
//create search tags from database entries
let ItemsString = "";
function setNewTags(email) {
  ItemsString = "";
  return new Promise((resolve, reject) => {
    Shops.find({ email })
      .then(items => {
        items.forEach(element => {
          ItemsString += `${element.desc} ${element.title} `;
        });
        natural.PorterStemmer.attach();
        let TagString = ItemsString.tokenizeAndStem().join(" ");
        User.updateOne(
          { email },
          { $set: { tags: TagString } }
        ).then(response => resolve(response));
      })
      .catch(err => reject(err));
  });
}
let ServiceResponse = [];
function getLocationSuggestion(words, limit = 10) {
  return new Promise((resolve, reject) => {
    natural.PorterStemmer.attach();
    let stringify = words.tokenizeAndStem().join(" ");
    User.find(
      { $text: { $search: stringify } },
      { score: { $meta: "textScore" } }
    )
      .limit(limit)
      .sort({ score: { $meta: "textScore" } })
      .then(probableResult => {
        ServiceResponse = [];
        probableResult.forEach(element => {
          let desc = Boolean(element.info.desc)
            ? element.info.desc
            : "Verified Business Establishment";
          ServiceResponse.push(
            `${element.info.businessname}\n ${desc}\nhttps://api.whatsapp.com/send?phone=${element.whatsapp.number}&text=join%20${element.whatsapp.sandbox}`
          );
        });
        resolve(ServiceResponse);
      })
      .catch(err => reject(err));
  });
}
exports.getLocationSuggestion = getLocationSuggestion;
