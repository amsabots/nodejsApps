const router = require("express").Router();
const { UpdateMessageStatus } = require("../controllers/clientAreaLogs");
router.post("/status", (req, res) => {
  UpdateMessageStatus(req.body)
    .then(result => console.log("status"))
    .then(err => console.log(err));
});
module.exports = router;
