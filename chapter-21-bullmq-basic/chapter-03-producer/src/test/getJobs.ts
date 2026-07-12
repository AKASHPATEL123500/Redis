import { queue } from "../queue.ts";

const job = await queue.getJobs();
console.log("JOBS : ", job);
