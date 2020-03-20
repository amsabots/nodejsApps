const express = require("express");
const mongoose = require("mongoose");
const app = express();
const config = require("config");
const Cron = require("node-cron");
const port = process.env.PORT || 5000;
const {
  NightNotificationTask,
  MorningNotificationTask
} = require("./helper/cron");
const { User } = require("./models/user");
const SendMessage = require("./controllers/send");
mongoose
  .connect(config.get("MongoUri"), {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true
  })
  .then(() => console.log("connected successfully..."))
  .catch(err => console.log("ERROR::", err));
//middleware initialisation
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

app.use("/users", require("./routes/user"));
app.use("/sms", require("./routes/sms"));
app.use("/webhook", require("./routes/whatsapp"));
app.use("/shop", require("./routes/shop"));
app.use("/whatsapp", require("./routes/whatsappstatus"));
app.listen(port, console.log(`app listening on port ${port}`));
