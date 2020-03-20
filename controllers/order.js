const order = require("../models/order");
const shop = require("../models/shop");
const message = {
  value: []
};
const sms = require("../controllers/sms");
const config = require("config");
function StartSession(twilio) {
  return new Promise((resolve, reject) => {
    let ObjectId = twilio.Body.split("#")[1];
    var checkId = new RegExp("^[0-9a-fA-F]{24}$");
    if (!checkId.test(ObjectId)) {
      message.value = [];
      message.value.push({
        desc:
          "The order can not be verified at the moment, *Paste* or *type* the correct order ID"
      });
      resolve(message);
    } else {
      order
        .findOne({ OrderID: ObjectId, User: twilio.From.split(":")[1] })
        .then(id => {
          if (id) {
            message.value = [];
            message.value.push({
              desc:
                "This order already exist🙄🙄, Place a new one or delete this one and place a new one🆕🆕"
            });
            resolve(message);
          } else {
            new order({
              OrderID: ObjectId,
              accountSid: twilio.accountSid,
              User: twilio.From.split(":")[1]
            })
              .save()
              .then(rec => {
                sms(
                  twilio,
                  `${
                    twilio.From.split(":")[1]
                  } has placed an order for product ID ${ObjectId}, please contact him for further info`
                )
                  .then(res => {
                    message.value = [];
                    shop.findOne({ _id: ObjectId }).then(result => {
                      message.value.push(
                        {
                          desc: ` ✔️✔️Order for item: *${result.title}*\n 🆔:*${ObjectId}* successfully _confirmed and submitted_, The platform provider has been notified and you might be contacted📞📞 later for further details`
                        },
                        {
                          desc: `❌❌Remember to cancel a specific order just send the keyword *cancel#orderId* i.e _(cancel#5e0a6ed0fae51a235a6da696)_`
                        }
                      );
                      resolve(message);
                    });
                  })
                  .catch(err => console.log(err));
              })
              .catch(err => reject(err));
          }
        });
    }
  });
}
function RemoveOrder(twilio) {
  return new Promise((resolve, reject) => {
    let ObjectId = twilio.Body.split("#")[1];
    var checkId = new RegExp("^[0-9a-fA-F]{24}$");
    if (!checkId.test(ObjectId)) {
      message.value = [];
      message.value.push({
        desc: "Invalid order id.Check Id and try again"
      });
      resolve(message);
    } else {
      order
        .deleteOne({ OrderID: ObjectId, User: twilio.From.split(":")[1] })
        .then(del => {
          message.value = [];
          message.value.push({
            desc: `Order  🆔: ${ObjectId} has been successfully removed`
          });
          resolve(message);
        })
        .catch(err => reject(err));
    }
  });
}
exports.StartSession = StartSession;
exports.RemoveOrder = RemoveOrder;
