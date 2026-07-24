# 🚀 Chapter 15: Flow Producer (Parent-Child Jobs)

## 📌 Aasan Bhasha Mein Concept (Father-Children Logic)

##### FlowProducer = workflow bullder

BullMQ mein **Flow Producer** ka matlab hai ek aisa system jahan ek **Parent Job** hoti hai aur uske kai saare **Child Jobs** hote hain.

Isko tum apne real-world example se samajh sakte ho:

- Ek **Father (Parent)** ke paas ek bada kaam aaya.
- Unhone us kaam ko apne **Bacchon (Children)** mein baant diya.
- Har bacche ka apna ek alag aur fixed kaam hai (Limitation hai). Ek baccha doosre ke kaam mein dakhal nahi dega.
- Saare bacche apna-apna kaam **parallel (ek sath)** shuru kar dete hain.
- Jab saare bacche apna kaam khatam karke Father ko report de dete hain (`getChildrenValues()`), tabhi Father aakhiri step poora karta hai.

> ⚠️ **Rule:** Jab tak saare Child Jobs complete nahi hote, tab tak Parent Job `waiting-children` state mein chup-chaap baithi rehti hai.

---

## 🖼️ Architecture Diagram (The Tree Structure)

```text
                     ┌───────────────────────────┐
                     │ Parent: notify-user-ready │  <-- Sabse aakhiri mein chalega
                     └─────────────┬─────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Child 1:         │      │ Child 2:         │      │ Child 3:         │
│ transcode-1080p  │      │ generate-thumb   │      │ extract-subtitle │  <-- Teeno Ek Sath Chalenge
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## 🎯 Real-World Use Case (Video Processing platform)

Jab YouTube par video upload hoti hai:

1. Video ke formats bante hain (1080p, 720p).
2. Video ka Thumbnail banta hai.
3. Subtitles extract hote hain.
4. **Final Step (Parent):** Jab teeno kaam ho jaate hain, tabhi user ko notification jata hai ki _"Your video is ready to watch!"_.

---

## 📂 Code Structure & Implementation

### 1. `flow-producer.js` (Kaam Baantne Wala - Father)

```javascript
import { FlowProducer } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });
const flowProducer = new FlowProducer({ connection });

async function startFlow() {
  await flowProducer.add({
    name: "notify-user-ready", // 👈 PARENT JOB
    queueName: "notification-queue",
    data: { videoId: "vid_99", msg: "Video is live!" },
    opts: { failParentOnFailure: true }, // Ek bhi baccha fail hua toh flow ruk jayega
    children: [
      {
        name: "transcode-1080p",
        queueName: "video-queue",
        data: { videoId: "vid_99" },
      }, // 👈 CHILD 1
      {
        name: "generate-thumb",
        queueName: "thumb-queue",
        data: { videoId: "vid_99" },
      }, // 👈 CHILD 2
      {
        name: "extract-subtitle",
        queueName: "sub-queue",
        data: { videoId: "vid_99" },
      }, // 👈 CHILD 3
    ],
  });
  console.log("🚀 Flow created successfully!");
}
startFlow();
```

### 2. `workers.js` (Kaam Karne Wale - Children & Parent)

```javascript
import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });

// Child 1 Worker
new Worker(
  "video-queue",
  async (job) => {
    console.log("⚙️ Processing 1080p video...");
    return { videoUrl: "s3://video.mp4" }; // Report to Father
  },
  { connection },
);

// Child 2 Worker
new Worker(
  "thumb-queue",
  async (job) => {
    console.log("🖼️ Generating Thumbnail...");
    return { thumbUrl: "s3://thumb.png" }; // Report to Father
  },
  { connection },
);

// Child 3 Worker
new Worker(
  "sub-queue",
  async (job) => {
    console.log("📝 Extracting Subtitles...");
    return { subUrl: "s3://sub.vtt" }; // Report to Father
  },
  { connection },
);

// 🔥 PARENT WORKER (Yeh sabse aakhiri mein chalega jab upar ke teeno khatam honge)
new Worker(
  "notification-queue",
  async (job) => {
    console.log("\n🎉 All children completed! Parent Worker starting...");

    // Bacchon ka bhej hua data (reports) nikalna:
    const reports = await job.getChildrenValues();
    console.log("Reports received from children:", reports);
  },
  { connection },
);
```

---

## ❌ Common Mistakes (Galti mat karna!)

1. **Wrong Execution Assumption:** Log sochte hain parent pehle chalega. Nahi! Parent queue mein jata zaroor hai, par tab tak hold rehta hai jab tak saare bacche apna kaam khatam nahi kar dete.
2. **Forgetting `failParentOnFailure`:** Agar kisi child mein error aaya aur aapne ye option true nahi kiya, toh parent job queue mein phasee reh jayegi (Zombie Job ban jayegi).

## 🚀 Best Practices

- Hamesha `removeOnComplete: true` use karein kyunki Flow Producer Redis ke andar bohot saari relational keys banata hai. Kaam khatam hote hi memory saaf karna achhi aadat hai.
