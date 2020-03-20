const _ = require("lodash");
const { getLocationSuggestion } = require("../helper/natural");
const router = require("express").Router();
const client = require("twilio")(
  "ACb67bbe8ec6d1e5cffd4dcfbf5f41b53a",
  `0f31d0704b3a29f568832c5c3fc92507`
);
router.post("/reply", (req, res) => {
  getLocationSuggestion(req.body.Body).then(response => {
    response.forEach(element => {
      client.messages
        .create({
          to: req.body.From,
          body: element,
          from: req.body.To
        })
        .then(message => console.log(message))
        .catch(err => console.log(err));
    });
  });
});
module.exports = router;
