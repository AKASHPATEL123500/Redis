import { redisConnectionConfig } from "./flow-producers-queue.ts";
import { Worker } from "bullmq";

// Child 1 Worker
new Worker(
  "video-queue",
  async (job) => {
    console.log("⚙️ Processing 1080p video...", job.data);
    return { videoUrl: "s3://video.mp4" }; // Report to Father
  },
  { connection: redisConnectionConfig },
);

// Child 2 Worker
new Worker(
  "thumb-queue",
  async (job) => {
    console.log("🖼️ Generating Thumbnail...");
    return { thumbUrl: "s3://thumb.png" }; // Report to Father
  },
  { connection: redisConnectionConfig },
);

// Child 3 Worker
new Worker(
  "sub-queue",
  async (job) => {
    console.log("📝 Extracting Subtitles...");
    return { subUrl: "s3://sub.vtt" }; // Report to Father
  },
  { connection: redisConnectionConfig },
);

// 🔥 PARENT WORKER (Yeh sabse aakhiri mein chalega jab upar ke teeno khatam honge)
new Worker(
  "notification-queue",
  async (job) => {
    console.log("\n🎉 All children completed! Parent Worker starting...");

    // Bacchon ka bhej hua data (reports) nikalna:
    const reports = await job.getChildrenValues();
    console.log("Reports received from children:", reports);
    console.log("Jobs : ", job.data);
  },
  { connection: redisConnectionConfig },
);
