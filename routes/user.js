const router = require("express").Router();
const { ValidateEmail } = require("../config/require");
const {
  FetchUserEmail,
  RegisterUser,
  AddUserInfo
} = require("../controllers/user");
const _ = require("lodash");
router.post("/register", (req, res) => {
  const { error } = ValidateEmail(req.body);
  if (error) res.status(400).send(error.details[0].message);
  FetchUserEmail(req.body.email)
    .then(user => {
      if (user) res.status(401).send("username already taken");
      else {
        RegisterUser(req.body)
          .then(user => res.send(user))
          .catch(err => res.send(err));
      }
    })
    .catch(err => res.send(err));
});
router.put("/updateinfo", (req, res) => {
  AddUserInfo(req.body)
    .then(user => res.send(user))
    .catch(err => res.send(err));
});
router.get("/getuser/:email", (req, res) => {
  FetchUserEmail(req.params.email)
    .then(user => res.send(user.info.location))
    .catch(err => res.send(err));
});

module.exports = router;
