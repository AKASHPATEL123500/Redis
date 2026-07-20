# 🚀 Chapter 04 — Job Lifecycle

Ab tak humne sirf ye dekha.

Producer

↓

Queue

↓

Worker

Lekin BullMQ ke andar job ki life isse zyada interesting hoti hai.

Ek job kabhi seedha complete nahi hoti.

Uske stages hote hain.

Producer
│
▼
Waiting
│
▼
Active
│
▼
Completed

Aur agar error aa gaya.

Waiting

↓

Active

# Practical Job Lifecycle — Queue, Producer, Worker (deep, code-first)

This README is rewritten to be practical and detailed. Focus: code examples, events, job shape, and production-ready guidance. I will explain each line of example code so you can implement this in production.

Files you'll use in examples below:

- [src/queue/queue.ts](src/queue/queue.ts#L1)
- [src/producer/producer.ts](src/producer/producer.ts#L1)
- [src/worker/worker.ts](src/worker/worker.ts#L1)

If you want diagrams (SVG/ASCII) or a runnable demo repo, tell me and I'll add them.

---

## 1) Quick summary (one-liner)

- Producer creates jobs with `queue.add()`.
- Jobs live in Redis in different states: `delayed`, `waiting`, `active`, `completed`, `failed`.
- Worker picks jobs, processes them, and BullMQ changes job states automatically.

Now full practical deep-dive below.

---

## 2) Quick start code (minimal, runnable)

These three files are the minimal pieces. I'll explain every line after the code.

### src/queue/queue.ts

```ts
import { Queue } from "bullmq";

export const emailQueue = new Queue("email-queue", {
  connection: { host: "localhost", port: 6379 },
});

console.log("Queue is ready");
```

Line-by-line:

- `import { Queue } from "bullmq";` — get the Queue class.
- `new Queue("email-queue", {...})` — creates/opens a named queue in Redis.
- `connection` — Redis host/port. In production use TLS, auth, and a managed Redis.

### src/producer/producer.ts

```ts
import { emailQueue } from "../queue/queue.ts";

async function jobAddInQueue() {
  await emailQueue.add(
    "send-email",
    { userId: "u123", email: "user@example.com" },
    {
      attempts: 5,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { age: 3600 },
      removeOnFail: { age: 86400 },
      timeout: 30_000,
    },
  );

  console.log("Job added successfully in queue");
}

jobAddInQueue();
```

Line-by-line explanation of options (practical):

- `attempts: 5` — job will be tried up to 5 times before permanently failing.
- `backoff` — how long to wait before retry. `exponential` multiplies the delay.
- `removeOnComplete` / `removeOnFail` — keep Redis clean; remove old jobs after given seconds.
- `timeout` — if worker doesn't finish in this many ms, BullMQ will mark the job failed.

### src/worker/worker.ts

```ts
import { Worker, Job } from "bullmq";

const emailWorker = new Worker(
  "email-queue",
  async (job: Job) => {
    // 1) Logging + tracing
    console.log("Start job", job.id, "user:", job.data.userId);

    // 2) Business logic (simulate call)
    // Example: call external email API with retries inside implementation
    await sendEmail(job.data);

    // 3) Optionally return result which BullMQ stores
    return { sent: true, ts: Date.now() };
  },
  {
    connection: { host: "localhost", port: 6379 },
    concurrency: 5,
  },
);

emailWorker.on("completed", (job) => {
  console.log("Completed: jobId=", job.id);
});

emailWorker.on("failed", (job, err) => {
  console.error("Failed: jobId=", job?.id, "error=", err.message);
});

async function sendEmail(data: any) {
  // This function should be idempotent and handle transient errors internally.
  await new Promise((r) => setTimeout(r, 2000));
  if (Math.random() < 0.2) throw new Error("Simulated send error");
}

console.log("Worker started");
```

Line-by-line:

- `Worker("email-queue", processor, opts)` — creates worker that pulls jobs and runs `processor`.
- `job: Job` — the job object. `job.data` is the payload; `job.id` is unique id.
- `concurrency` — how many jobs this process will run in parallel.
- `emailWorker.on("completed", ...)` — event fired on successful completion for this worker instance.
- `emailWorker.on("failed", ...)` — fired when a job fails in this worker instance.

---

## 3) Events — what are events and why they matter

Short: Events are notifications emitted by Queue/Worker/Redis when job states change. They let you build monitoring, metrics, or extra side-effects (like audit logs). Events are important for observability and reacting to lifecycle changes.

Where to listen:

- `Worker` instance emits local events (only for jobs processed by that worker process).
- `QueueEvents` is a global listener that observes all state changes in Redis for that queue (useful for central monitoring).

### Worker events (local)

Common worker events and what to use them for:

- `completed` (job) — job finished successfully. Use to ack metrics, send notifications, or chain jobs.
- `failed` (job, err) — job failed. Use for logging, alerts, and debugging.
- `active` (job) — job just started processing by this worker. Useful to mark start-time metrics.
- `progress` (job, progress) — worker can report progress; useful for long-running tasks.
- `error` (err) — internal worker error (e.g., Redis unreachable) — critical alert.

Example (worker local events):

```ts
emailWorker.on("active", (job) => console.log("Active", job.id));
emailWorker.on("progress", (job, progress) =>
  console.log("Progress", job.id, progress),
);
emailWorker.on("error", (err) => console.error("Worker error", err));
```

Line-by-line:

- `active` tells you the worker has claimed the job and is processing it now.
- `progress` lets you flow intermediate state back to Redis so frontends can poll.

### Global events (QueueEvents)

Use `QueueEvents` to get queue-wide events from any process. This is best for dashboards and centralized logging.

```ts
import { QueueEvents } from "bullmq";

const queueEvents = new QueueEvents("email-queue", {
  connection: { host: "localhost", port: 6379 },
});

queueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log("Global completed: jobId=", jobId, "return=", returnvalue);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log("Global failed: jobId=", jobId, "reason=", failedReason);
});

queueEvents.on("waiting", ({ jobId }) => console.log("Waiting: jobId=", jobId));
queueEvents.on("delayed", ({ jobId, delay }) =>
  console.log("Delayed: jobId=", jobId, "delay=", delay),
);
```

Important:

- `QueueEvents` gives event objects (e.g., `{ jobId, failedReason }`) — you do not get full `job.data` here, only identifiers and metadata. Use it to power dashboards and alerts without loading full job bodies.

---

## 4) Job object — what it contains and what companies store

`job` has useful fields; here's what they mean and typical usage in production systems.

- `id` — unique job id (string). Use for tracing and logs.
- `name` — job name (from `queue.add(name, data)`). Useful to route behaviour.
- `data` — the payload (JSON). Keep this small; store large blobs in object storage and reference by id.
- `opts` — job options (attempts, backoff, timeout, etc.). Useful for dynamic retry policies.
- `attemptsMade` — how many times it has been tried so far.
- `processedOn` / `finishedOn` — timestamps recorded by BullMQ.
- `returnvalue` — what the processor returned (accessible via job.finished() or in QueueEvents returnvalue).

What big companies include in `job.data`:

- `correlationId` / `traceId` — for end-to-end tracing.
- `userId` / `accountId` — business owner of the job.
- `payloadRef` — pointer to large payload in S3/Blob storage.
- `idempotencyKey` — ensures safe retries.
- `priority` — for routing high-priority jobs.
- `createdByService` — origin service name.

Example `data` shape:

```json
{
  "userId": "u123",
  "email": "user@example.com",
  "correlationId": "req-7b3f",
  "payloadRef": "s3://bucket/attachments/abc.json",
  "idempotencyKey": "send-email:u123:2026-07-14"
}
```

Best practices:

- Keep `data` small and serializable.
- Use `payloadRef` for big attachments.
- Always include `correlationId` for tracing.

---

## 5) Retries, backoff, delay — how staging changes

- When you add a job with `delay`, it goes into `delayed` state until time passes; then Redis scheduler moves it to `waiting`.
- When a worker processes and throws, the job goes to `failed` and — if `attempts` left — gets scheduled for retry (moved back to `waiting` or `delayed` depending on backoff). That's the staging you asked about.

Producer example with delay & retries (explicit):

```ts
await emailQueue.add(
  "send-email",
  { userId: "u123", email: "user@example.com" },
  {
    delay: 60_000, // start after 60s
    attempts: 4,
    backoff: { type: "exponential", delay: 5000 },
  },
);
```

Staging walkthrough for this job:

1. Immediately after add: state = `delayed` (not visible to workers yet).
2. After 60s: Redis moves to `waiting` (visible to workers).
3. Worker picks → `active`.
4. If success → `completed`.
5. If fail and `attempts` left → placed in `waiting` (after backoff delay) or `delayed` depending on scheduling.
6. If `attempts` exhausted → `failed` (final).

---

## 6) Worker internals: what workers do in production (deep)

Real worker responsibilities (beyond just calling APIs):

1. Validation & quick rejects

- Validate `job.data` schema quickly. If data is invalid, fail fast and do NOT retry (use `job.moveToFailed()` with `ignoreRetry: true`).

2. Idempotency

- Use `idempotencyKey` stored in DB/cache to ensure repeated processing does not duplicate side-effects.

3. Circuit breaking + rate limiting

- Throttle outgoing calls to downstream (email API) to avoid overload.

4. Observability

- Emit structured logs with `jobId`, `correlationId`, `attemptsMade`.
- Push metrics (duration, success/fail counters).

5. Error categorization

- Differentiate between transient (network) vs permanent errors (invalid email). Retry only transient errors.

Example worker with idempotency & transient-vs-permanent error handling:

```ts
import { Worker, Job } from "bullmq";
import { getIdempotency, setIdempotency } from "./idempotency-store"; // example

const w = new Worker("email-queue", async (job: Job) => {
  const { idempotencyKey } = job.data;

  // 1) Fast validation
  if (!job.data.email) {
    // permanent failure — don't retry
    throw Object.assign(new Error("Invalid payload: missing email"), {
      retry: false,
    });
  }

  // 2) Idempotency check
  const cached = await getIdempotency(idempotencyKey);
  if (cached) {
    return cached; // safe to return already-done result
  }

  try {
    const res = await callExternalEmailService(job.data);
    await setIdempotency(idempotencyKey, res);
    return res;
  } catch (err: any) {
    // 3) categorize error
    if (isTransient(err)) {
      throw err; // let BullMQ retry
    } else {
      // permanent error — move to failed without retry
      throw Object.assign(err, { retry: false });
    }
  }
});

w.on("failed", (job, err) => {
  // If err.retry === false then mark as failed and don't retry
  if ((err as any)?.retry === false) {
    job.moveToFailed({ message: err.message }, true);
  }
});
```

Notes:

- `getIdempotency` / `setIdempotency` could use Redis or a DB with TTL.
- `isTransient()` should detect network timeouts, 5xx responses, rate limit errors.

---

## 7) Monitoring & Observability (practical)

1. Use `QueueEvents` for global event stream and feed to metrics pipeline.
2. Use Bull Board for quick UI to inspect jobs (local/development). Minimal snippet:

```ts
// small express server with bull-board
import express from "express";
import { BullMQAdapter } from "bull-board/bullMQAdapter";
import { createBullBoard } from "bull-board";
import { emailQueue } from "./queue/queue";

const app = express();
const { router } = createBullBoard([new BullMQAdapter(emailQueue)]);
app.use("/admin/queues", router);
app.listen(3000);
```

3. Emit metrics: job duration histogram, failure count, retry count. Use `queueEvents` to increment counters.

Example: capture durations

```ts
queueEvents.on("completed", async ({ jobId }) => {
  const job = await emailQueue.getJob(jobId);
  if (!job) return;
  const duration = (job.finishedOn ?? 0) - (job.processedOn ?? job.timestamp);
  metrics.histogram("job_duration_seconds", duration / 1000, {
    queue: "email-queue",
  });
});
```

Note: reading the job (emailQueue.getJob) is an extra Redis call — balance frequency versus cost.

---

## 8) Production checklist (concrete)

- Secure Redis (AUTH/TLS) and network rules.
- Use `removeOnComplete` & `removeOnFail` to avoid unbounded job growth.
- Set `attempts`, `backoff`, `timeout` sensibly.
- Make worker idempotent and instrumented.
- Limit concurrency and shard workers per downstream capacity.
- Centralize `QueueEvents` consumer for metrics and alerts.

---

## 9) Common pitfalls and fixes

- Stuck jobs in `active`: check worker crashes and long-running event-loop blocking. Use `timeout` and `heartbeat` monitoring.
- Too many retries: tighten conditions for what should retry (transient only).
- Large payloads: move to external storage and store refs.

---

## 10) Next steps I can do for you

- Add ASCII / SVG diagrams embedded in README.
- Modify `src/producer` and `src/worker` to include idempotency example and `attempts/backoff` in code.
- Add Bull Board setup and `docker-compose` for Redis + demo.

Tell me which of the above you want next and I will implement it.

---

## Code examples (producer, queue, worker)

Below example matches the code in this chapter. Har file ke baad line-by-line short explanation diya gaya hai.

Files:

- [src/producer/producer.ts](src/producer/producer.ts#L1)
- [src/worker/worker.ts](src/worker/worker.ts#L1)
- [src/queue/queue.ts](src/queue/queue.ts#L1)

### src/queue/queue.ts

```ts
import { Queue } from "bullmq";

export const emailQueue = new Queue("email-queue", {
  connection: { host: "localhost", port: 6379 },
});

console.log("Queue is ready");
```

- `import { Queue } from "bullmq";` — BullMQ ka Queue class import.
- `new Queue("email-queue", {...})` — Redis ke saath named queue create karta.
- `connection` — Redis host/port; production mein credentials/use TLS zaruri.

### src/producer/producer.ts

```ts
import { emailQueue } from "../queue/queue.ts";

async function jobAddInQueue() {
  await emailQueue.add("send-wellcome-mail", {
    name: "Shivam Patel",
    email: "Shivam@patel.in",
  });

  console.log("Job added successfully in queue");
}

jobAddInQueue();
```

- `emailQueue.add(name, data)` — Producer job Redis queue mein add karta.
- `await` ensure karta ki job creation complete ho gaya before moving on. Helpful for consistency in producers.

### src/worker/worker.ts

```ts
import { Worker } from "bullmq";

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    console.log("🚀 Job Started:", job.id);
    console.log("⏳ Working...");

    // Simulate work
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("✅ Job Completed:", job.id);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

console.log("🚀 Worker Started...");
```

- `new Worker(queueName, processor, opts)` — Worker create karega aur jobs process karega.
- `job.id` and `job.data` — job identifier aur payload.
- `setTimeout` — example ka synchronous simulation; real work will be I/O calls.

---

## Practical flows and staging explained (easy language)

1. Producer adds job → Staging: Waiting

- Jab producer `queue.add()` call karta hai, job Redis me waiting state mein store hota.
- Agar delay set hota hai, job `delayed` list pe jayega — wahan se Redis scheduler use move karke waiting list me bhejta hai jab time aata.

2. Worker picks job → Staging: Active

- Worker Redis se job uthata.
- Jab worker job uthata, job state `active` hoti hai, matlab processing chal rahi hai.

3. Success → Staging: Completed

- Agar worker function bina error ke finish ho jata, BullMQ job ko `completed` mark karta aur results store kar sakta hai agar configured.

4. Error → Staging: Failed (then retry)

- Agar worker function `throw` kare ya rejected promise return kare, job `failed` mark ho jati.
- Agar job options me `attempts` set ho, BullMQ job ko retry logic ke tehat phir se `waiting` me daal dega (ya `delayed` agar backoff set hai).

5. Delay and Backoff

- Delay: `queue.add(name, data, { delay: 60000 })` — job 60s tak `delayed` list mein rahega.
- Backoff: `backoff: { type: 'exponential', delay: 2000 }` — retry ke beech exponential wait.

### Example with retries, delay, backoff (producer)

```ts
await emailQueue.add(
  "send-email",
  { email: "user@example.com" },
  {
    attempts: 5, // total tries
    backoff: { type: "exponential", delay: 2000 },
    timeout: 30000, // max processing time
  },
);
```

- `attempts` — agar job fail hota hai to yeh maximum baar retry karega.
- `backoff` — retry ke beech wait strategy.
- `timeout` — agar worker specified time me complete nahi karta to job fail ho jayega.

---

## Production best practices (concise)

- Use TLS/ACL for Redis in production.
- Use monitoring: Bull Board or Prometheus metrics.
- Make workers idempotent: repeated runs should be safe.
- Centralize logging and tracing (request id / job id).
- Use exponential backoff + jitter to avoid thundering herd.
- Limit concurrency per worker to match downstream capacity.

---

## Troubleshooting quick tips

- Jobs stuck in `active`: increase worker timeout or check for blocked event loop.
- Jobs in `failed` but not retried: check `attempts` and `backoff` settings.
- High memory on Redis: check retention of completed/failed jobs and configure `removeOnComplete`/`removeOnFail`.

---

If you want, I can:

- Add diagrams (SVG/ASCII) and embed into README.
- Patch the example code to include `attempts`, `backoff`, and `removeOnComplete` settings.
- Add a small monitoring snippet (Bull Board) and explain setup.

Bataye kya next karna hai?
host: "localhost",
port: 6379,
},
},
);

````

Ab.

Producer.

3 jobs bhejega.

Output.

```text
Job Start

{email:'a@gmail.com'}

Job End

------------

Job Start

{email:'b@gmail.com'}

Job End

------------

Job Start

{email:'c@gmail.com'}

Job End
````

Yaha.

Har job.

```text
Waiting

↓

Active

↓

Completed
```

---

# Ab Fail karte hain.

Worker.

```ts
async (job) => {
  console.log(job.data);

  throw new Error("SMTP Down");
};
```

Ab.

Producer.

Job bhejega.

Output.

```text
Error

SMTP Down
```

Aur.

Job.

```text
Waiting

↓

Active

↓

Failed
```

---

# Lekin ek problem 🤔

Question.

Job Failed.

Ab?

Delete?

😂

Nahi.

Retry?

Kaise?

Kitni baar?

Kab?

Ye BullMQ ka next feature hai.

Aur isi liye.

**Retry Jobs** exist karta hai.

---

# Is chapter ka assignment

Main chahta hu tum 2 experiments karo.

### Experiment 1

Worker.

```ts
console.log(job.data);
```

Bas.

Observe.

Sab jobs complete.

---

### Experiment 2

Worker.

```ts
throw new Error("Email Failed");
```

Observe.

Job fail.

---

# Aur ek chhota challenge 😎

Worker ke andar ye print karna:

```ts
console.log(job.id);
console.log(job.name);
console.log(job.data);
```

Aur mujhe batana.

- Job ID kya tha?
- Job Name kya tha?
- Job Data kya tha?

Uske baad hum **Retry Jobs** start karenge.

Aur wahi se BullMQ production level lagna shuru hoga. 🚀
