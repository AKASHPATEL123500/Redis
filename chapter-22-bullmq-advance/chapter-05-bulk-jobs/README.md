Bhai, direct jump Chapter-19: Bulk Jobs par! Ekdum sahi topic chuna hai. Jab humein ek ya do nahi, balki ek sath hazaron (thousands) jobs queue mein daalni hoti hain, tab Bulk Jobs ka use hota hai.
Chalo isko ekdum simple aur aasan bhasha mein samajhte hain ki iska asli maza kya hai.

---

## 💡 Bulk Jobs Kya Hai? (Problem aur Solution)

Maan lo aapke paas 10,000 users ki ek list hai aur aapko un sabhi ko ek sath welcome email bhejna hai.

- Purana Tarika (Loop Chalana): Aap ek for loop chaloge aur 10,000 baar queue.add() ko call karoge.
- Nuksan: Har ek queue.add() Redis database par ek alag request (network call) bhejta hai. 10,000 baar Redis se baat karne mein aapka server slow ho jayega, network par load badhega aur application hang ho sakti hai.
- BullMQ Bulk Jobs (Naya Tarika): BullMQ humein deta hai queue.addBulk(). Isme aap saari 10,000 jobs ka ek array banate ho aur sirf ek single network call mein poora data Redis ko bhej dete ho. Kaam ek jhatke mein khatam!

---

## 🛠️ Live Example: Bulk Email Sending System

Maan lo humein ek sath bohot saare users ko notification bhejna hai. Chalo addBulk ka code dekhte hain.

## 1. Producer Code (Ek sath saari jobs add karna)

```ts
import { Queue } from "bullmq";
import IORedis from "ioredis";
const connection = new IORedis({ maxRetriesPerRequest: null });
const notificationQueue = new Queue("NotificationQueue", { connection });
async function sendBulkNotifications() {
  // 1. Jobs ka ek array (list) banaya
  const jobsList = [
    {
      name: "sendEmail",
      data: { to: "rahul@example.com", msg: "Hello Rahul!" },
    },
    { name: "sendEmail", data: { to: "amit@example.com", msg: "Hello Amit!" } },
    {
      name: "sendEmail",
      data: { to: "priya@example.com", msg: "Hello Priya!" },
    },
    {
      name: "sendEmail",
      data: { to: "sneha@example.com", msg: "Hello Sneha!" },
    },
  ];

  // 2. addBulk use karke ek baar mein saari jobs Redis mein daal di
  const createdJobs = await notificationQueue.addBulk(jobsList);

  console.log(
    `🚀 Total ${createdJobs.length} jobs ek sath queue mein daal di gayi hain!`,
  );
  process.exit(0);
}

sendBulkNotifications();
```

## 2. Consumer Code (Workers unhe kaise process karenge)

Worker ke liye kuch nahi badalta! Worker normal tarike se hi ek-ek karke ya parallelly jobs ko uthayega aur process karega.

```ts
import { Worker } from 'bullmq';import IORedis from 'ioredis';
const connection = new IORedis({ maxRetriesPerRequest: null });
// Worker ko ghanta farak nahi padta ki job bulk se aayi ya single, wo apna kaam karegaconst notificationWorker = new Worker('NotificationQueue', async (job) => {
  console.log(`📨 Processing: Sending message to ${job.data.to}`);
}, { connection });
```

---

## 🔥 Bulk Jobs Ke Pro-Tips Aur Khaas Rules

1.  Performance Booster: addBulk use karne se Redis par load 90% tak kam ho jata hai kyunki network round-trips bach jaate hain.
2.  Per-Job Options: Aap har ek job ke andar uska alag option bhi de sakte ho (jaise kisi ek user ke email ko delay karna ho ya priority deni ho):

```ts
   {
     name: 'sendEmail',
     data: { to: 'vip@example.com' },
     opts: { priority: 1 } // Is VIP user ki job pehle chalegi!
   }
```

3.  Limit Yaad Rakhna: Halanki ye bohot fast hai, par ek sath lakhon (millions) jobs ka array mat bana dena, nahi to Node.js ki memory full ho jayegi. Agar 1 lakh jobs hain, to 5,000 - 5,000 ke chunks (tukde) karke addBulk chalana sabse best practice hai.
