// email.proccess.ts
import { Job } from "bullmq";
export default async function (job: Job) {
  console.log("================================");
  console.log("Processor PID:", process.pid);
  console.log("Job Id:", job.id);
  console.log("Job Name:", job.name);
  console.log("Job Data:", job.data);
  console.log("================================");

  // Fake Work
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("Email Sent Successfully ✅");

  return {
    success: true,
  };
}
