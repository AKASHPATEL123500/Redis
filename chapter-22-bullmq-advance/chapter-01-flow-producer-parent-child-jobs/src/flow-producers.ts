import { flowProducer } from "./flow-producers-queue.ts";

async function flowProucer() {
  await flowProducer.add({
    name: "notify-user-ready", // Parent Queue
    queueName: "notification-queue",
    data: {
      videoId: 1,
      name: "Youtube Video Funny",
      msg: "video is live",
    },
    opts: { failParentOnFailure: true },
    children: [
      // childern queue
      {
        name: "transcode-1080p",
        queueName: "video-queue", // child 1
        data: { videoId: 1 },
      },
      {
        name: "genrate-thubnail",
        queueName: "thumb-queue", // chil 2
        data: { videoId: 1 },
      },
      {
        name: "extract-subtitle",
        queueName: "sub-queue", // child 3
        data: { videoId: 1 },
      },
    ],
  });
}

flowProucer();
