import { CronJob } from "cron";
import Task from "../models/Task";
import User from "../models/User";
import { subHours } from "date-fns";

export const scheduleJob = () => {
  const job = new CronJob(
    "1 * * * * *",
    function () {
      checkAndAllocate();
    },
    null,
    true,
    "Asia/Kolkata"
  );
  job.start();
};

async function checkAndAllocate() {
  console.log("job run");
  const task = await Task.find({});
  for (let i = 0; i < task.length; i++) {
    let minusTime = task[i].length + task[i].buffer;
    let cutOff = subHours(task[i].deadLine, minusTime);
    let crrDate = new Date();
    if (task[i].active && crrDate < task[i].deadLine) {
      if (crrDate >= cutOff) {
        let users = await User.find({ managerId: task[i].managerId });
        let minBusyId = "";
        let minBusyTime = 168; // 7 days a week and 24 hrs a day
        for (let j = 0; j < users.length; j++) {
          let userTaskList = await Task.find({
            userId: users[j]._id,
            week: task[i].week,
          });
          let userTaskTime = 0;
          for (let k = 0; k < userTaskList.length; k++) {
            userTaskTime += userTaskList[k].length;
          }
          if (
            userTaskTime < minBusyTime &&
            minBusyTime + task[i].length <= users[j].workHrs
          ) {
            minBusyTime = userTaskTime;
            minBusyId = userTaskList[j]._id;
          }
        }
        await Task.findOneAndUpdate(
          { _id: task[i]._id },
          { userId: minBusyId, buffer: 0 }
        );
      }
    } else {
      await Task.findOneAndUpdate({ _id: task[i]._id }, { active: false });
    }
  }
}
