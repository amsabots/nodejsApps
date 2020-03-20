const router = require("express").Router();
const _ = require("lodash");
const {
  Search,
  SaveToShop,
  IncrementFrequency
} = require("../controllers/shop");
const shop = require("../models/shop");
const config = require("config");
const { getAllLastText } = require("../controllers/getLastText");
const { getLocationSuggestion } = require("../helper/natural");
const natural = require("natural");
const stringSimilarity = require("string-similarity");
router.post("/save", (req, res) => {
  SaveToShop(req.body)
    .then(shop => res.send(shop))
    .catch(err => console.log(err));
});
router.post("/search", (req, res) => {});
router.post("/slice", (req, res) => {
  shop
    .findOne({ _id: "5e011bbe43033b2290090691" })
    .then(result => res.send(result));
});

module.exports = router;
