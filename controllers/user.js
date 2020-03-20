const { User } = require("../models/user");
const _ = require("lodash");
const FetchUserEmail = function(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .then(user => {
        resolve(user);
      })
      .catch(err => {
        reject(err);
      });
  });
};
const RegisterUser = function(req) {
  return new Promise((resolve, reject) => {
    new User(_.pick(req, ["email", "password"]))
      .save()
      .then(user => resolve(user))
      .catch(err => reject(err));
  });
};
const AddUserInfo = function(req) {
  return new Promise((resolve, reject) => {
    FetchUserEmail(req.email)
      .then(user => {
        if (!user) reject({ error: true, message: "Account not found" });
        else {
          User.updateOne(
            { email: req.email },
            {
              info: {
                desc: req.desc,
                businessname: req.business,
                location: req.location
              },
              geo: {
                lat: req.lat,
                long: req.long,
                proxy: req.proxy
              },
              whatsapp: {
                sandbox: req.sandbox,
                number: req.whatsappnumber
              },
              sms: {
                sid: req.sid,
                token: req.token,
                number: req.smsnumber
              },
              basicinfo: {
                phonenumber: req.phonenumber,
                fullname: req.fullname
              },
              plan: {
                name: req.planname,
                amount: req.amount,
                isActive: req.activate
              }
            }
          ).then(user => resolve(user));
        }
      })
      .catch(err => reject(err.message));
  });
};
exports.FetchUserEmail = FetchUserEmail;
exports.RegisterUser = RegisterUser;
exports.AddUserInfo = AddUserInfo;
