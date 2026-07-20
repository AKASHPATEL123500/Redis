import { QueueEvents } from "bullmq";

const queueEvent = new QueueEvents("email-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

// completed event tab active hoga
// jab worker job complete karega
queueEvent.on("completed", (job) => {
  console.log(`Job id:${job.jobId}`);
  console.log("Job Completed", job);
  console.log("Job Completed Event");
});

// failed event ager worker  ne faild de diya jise SMTP server down etc
// tab yaha active hoga

queueEvent.on("failed", ({ jobId, failedReason }) => {
  console.log("❌ Job Failed:", jobId);
  console.log("Reason:", failedReason);
});

// OutPut:
// ❌ Job Failed: 46
// Reason:
// SMTP Down
// 🚀 Job Started: 69
// ❌ Job Failed: 69
// Reason: SMTP Server is Down!

//Active Event
queueEvent.on("active", ({ jobId }) => {
  console.log("🚀 Job Started:", jobId);
  console.log("Job Active Event");
});

// mtlb: Worker ne job uthai.

// Progres Event

// Worker kuch chnages karna hoga chota sa
// await job.updateProgress(50)

// And then in Queue evnet
queueEvent.on("progress", ({ jobId, data }) => {
  console.log(`📊 Job ${jobId} Progress: ${data}%`);
});

// Ouput:
// Job 47
// 50% mtlb 50% progress ho gaya hai

// Uses:
// File Upload
// Video Processing
// Image Compression
// Jaise kaam me hota hai.

/*
Practical Flow:
Suppose.

Producer:
queue.add{ .... }

Worker:
console.log("Start");
await job.updateProgress(50);
await job.updateProgress(100);


Queue Event OutPut:

🚀 Active

Job 51
📈 Progress
50%

📈 Progress
100%

✅ Completed
51


Ager Error Ata hai to
throw new Error("SMTP Down");

🚀 Active

Job 52
❌ Failed
SMTP Down
*/

// awaiting event mein job queue mein to chali gayi hai
// lekin worker ne recivenahi kiya hai to
// uss case mein waitng active hoga
queueEvent.on("waiting", ({ jobId }) => {
  console.log(`🟡 Job Waiting: ${jobId}`);
  console.log("Job Waiting Event");
});

// job queue mein hai lekin producer ne delyed de diya hai ki
// ye job 10 second baad worker recive kare
// to iss case mein delyed
queueEvent.on("delayed", ({ jobId }) => {
  console.log("⏳ Delayed:", jobId);
  console.log("Job Delayed Event");
});

// note:
// jab hume delye diya mtlb producer mein 10second ka delay diya
// Abb mtlb worker iss job ko 10 second baad hi recive karega okey
// Then hamara queue event jo listen kar raha hai
// yaha per delayed event start hoga active hoga
// Output: delayed job : 70
// And notic abhi tak worker job recive nahi kiya hai mtlb waha 10 second ka wait kr raha hai
// issliy delyed event active hua okey
// iske sath  hi waiting event bhi active hoga kyu ki worker abhi wait kar raha hai job
// isliye jab delyed katam hoga
// tab waitng event waitng hoga bass itna hi hai
// awaitng event ka mtlb hai ki woker
// Job queue mein aa gayi hai
// lekin worker ne recive nahi ki hai

// Drained event

// Quesion: Queue emoty kab hota hai
// supose queue mein jobs hai : [ job1, job2 , job3 ]
// worker ne in jobs ko complte kar diya
// mtlb : job1 done, job2 done, job3 done

// Abb Queue empty ho gaya mtlb queue mein job thi wokrer ne compltete kar diya
// abb queue empty hai abb queue ein 0 hai
// abb isi time Drained listen hota hai active hota

queueEvent.on("drained", () => {
  console.log("🎉 Queue Empty");
});

//stalled
// worker koi kaam process kar raha hai aur beech mein crach ho gaya
// kisi karan se jise: server crash , docker stop etc
// then uss case mein stalled start hota hai
queueEvent.on("stalled", ({ jobId }) => {
  console.log("⚠️ Stalled:", jobId);
});
