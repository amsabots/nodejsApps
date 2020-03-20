const ShopClass = require("../models/shop");
const _ = require("lodash");
const Messages = require("../models/logmessages");
const People = require("../models/logmessages");
function SaveToShop(params) {
  return new Promise((resolve, reject) => {
    new ShopClass(
      _.pick(params, ["email", "price", "desc", "title", "mediaurl"])
    )
      .save()
      .then(shop => resolve(shop))
      .catch(err => reject(err));
  });
}
function SearchRequest(email, text, From, page = 0) {
  let perpage = 5;
  let pager = page > 0 ? page : 0;
  return new Promise((resolve, reject) => {
    ShopClass.find(
      { email, $text: { $search: text } },
      { score: { $meta: "textScore" } }
    )
      .limit(perpage)
      .skip(perpage * pager)
      .sort({ score: { $meta: "textScore" } })
      .then(result => {
        resolve(result);
        if (result.length < 1) {
          People.updateOne({ From }, { $inc: { messagesFrequency: 1 } })
            .then(people => console.log(people))
            .catch(err => console.log(err));
        } else {
          People.updateOne(
            { From, messagesFrequency: { $gt: 0 } },
            { $inc: { messagesFrequency: -1 } }
          )
            .then(people => console.log(people))
            .catch(err => console.log(err));
        }
      })
      .catch(err => reject(err));
  });
}
function IncrementFrequency(user) {
  return new Promise((resolve, reject) => {
    ShopClass.updateOne({ From: user }, { $inc: { messagesFrequency: 1 } })
      .then(res => resolve(res))
      .then(err => reject(err));
  });
}
function FetchMore(phonenumber) {
  return new Promise((resolve, reject) => {
    Messages.aggregate([
      // Stage 1
      {
        $match: {
          From: phonenumber
        }
      },

      // Stage 2
      {
        $unwind: {
          path: "$message"
        }
      },

      // Stage 3
      {
        $sort: {
          message: -1
        }
      },

      // Stage 4
      {
        $limit: 1
      }
    ])
      .then(array => resolve(array))
      .catch(err => reject(err));
  });
}
exports.SaveToShop = SaveToShop;
exports.Search = SearchRequest;
exports.FetchMore = FetchMore;
exports.IncrementFrequency = IncrementFrequency;
