const Cron = require("node-cron");
const { ReturnLastText } = require("../controllers/getLastText");
let MorningNotificationTask = Cron.schedule(
  "*/10 * * * * *",
  () => {
    ReturnLastText()
      .then(r => {
        if (r.person.length !== 0) {
          NightNotificationTask.stop();
          r.person.forEach((element, index, array) => {
            // do {
            //   setTimeout(() => {
            //     console.log(element);
            //   }, 4000);
            // } while (index < array.length - 1);
          });
        }
      })
      .catch(err => console.log(err));
  },
  { scheduled: false }
);
let NightNotificationTask = Cron.schedule("50 13 * * *", () => {}, {
  scheduled: false
});
MorningNotificationTask.start();
NightNotificationTask.start();
exports.MorningNotificationTask = MorningNotificationTask;
exports.NightNotificationTask = NightNotificationTask;
