# Worker ka matlab hai

- Queue me jo jobs waiting me hain, unhe uthao aur process karo.
  Bas.

Bhai 😎🔥

Ab aa gaya **BullMQ ka Hero**.

Sach bolu?

Agar BullMQ me **Worker nahi hota**, to BullMQ ka koi matlab hi nahi hota.

Abhi tak hum sirf jobs jama kar rahe the.

Aaj pehli baar wo jobs **execute** hongi.

---

# Chapter 03 — Worker

Sabse pehle ek question.

Tumhare Redis me abhi kya hai?

```text
email-queue

├── Job 1
│    send-email
│
├── Job 2
│    send-email
│
└── Job 3
     send-email
```

Question.

Ye jobs kaun uthayega?

😂

Koi nahi.

Kyuki Worker hi nahi hai.

---

# Worker kya hota hai?

Definition yaad karne ki zarurat nahi.

Bas ye diagram yaad rakho.

```text
Producer

↓

Queue

↓

Worker

↓

Actual Work
```

Worker ka matlab hai

> **Queue me jo jobs waiting me hain, unhe uthao aur process karo.**

Bas.

---

# Real Life

Tumhare Short URL Project me.

Producer.

```text
Signup
```

↓

Queue.

```text
Send Welcome Email
```

↓

Worker.

```text
Nodemailer

↓

Email Send
```

---

# Step 1

`worker.ts`

```ts
import { Worker } from "bullmq";

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    console.log("📩 New Job Received");
    console.log(job.data);
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

Bas.

😂

Sirf itna.

---

# Ab line by line.

## Line 1

```ts
import { Worker } from "bullmq";
```

Worker class.

Simple.

---

## Line 2

```ts
new Worker(...)
```

Question.

Ye Queue banata hai?

❌

Ye Producer hai?

❌

Ye sirf Queue ko listen karta hai.

Matlab.

```text
Main email-queue ko dekh raha hoon.

Jaisi hi koi job aayegi,

main usko utha lunga.
```

---

# Pehla Argument

```ts
"email-queue";
```

Ye bahut important hai.

Question.

Ye naam same kyu hai?

Producer.

```ts
new Queue("email-queue");
```

Worker.

```ts
new Worker("email-queue");
```

Dono same.

Kyuki Worker ko pata hona chahiye.

Kis Queue ko sunna hai.

---

# Dusra Argument

Ye.

```ts
async (job) => {};
```

Isko bolte hain.

Processor.

Ya.

Job Handler.

Simple language me.

```text
Job mil gayi.

Ab kya karna hai?
```

Ye wahi jagah hai.

---

# Job

Question.

Ye.

```ts
job;
```

Kaha se aaya?

😂

Producer.

Yaad hai?

Tumne likha tha.

```ts
await emailQueue.add("send-email", {
  email: "akash@gmail.com",
  username: "Akash",
});
```

Ye object.

Automatically.

Worker ke paas.

```ts
job.data;
```

Ban ke aa gaya.

---

# Console

```ts
console.log(job.data);
```

Output.

```text
{
   email:"akash@gmail.com",
   username:"Akash"
}
```

Matlab.

Producer ne bheja.

Worker ne receive kar liya.

---

# Connection

Ye wahi Redis hai.

```ts
connection:{
 host:"localhost",
 port:6379
}
```

---

# Ab Experiment 😎

### Terminal 1

```bash
npx tsx src/worker.ts
```

Output.

```text
🚀 Worker Started...
```

Bas.

Worker wait kar raha hai.

---

### Terminal 2

```bash
npx tsx src/producer.ts
```

Producer.

3 jobs add karega.

---

### Terminal 1

Suddenly.

```text
🚀 Worker Started...

📩 New Job Received

{
 email:"a@gmail.com"
}

📩 New Job Received

{
 email:"b@gmail.com"
}

📩 New Job Received

{
 email:"c@gmail.com"
}
```

😎😎😎

Aur us moment pe tum samjh jaoge.

Producer.

↓

Queue.

↓

Worker.

Flow complete.

---

# Ek bahut important observation.

Question.

Producer aur Worker.

Ek hi file me hote hain?

❌

Kyun?

Kyuki production me.

```text
Backend Server

↓

Producer
```

Aur.

```text
Dusra Server

↓

Worker
```

Ho sakta hai.

Completely alag machine.

Sirf Redis common hota hai.

---

# Aaj ka Goal

Aaj bas ye samajhna hai.

- ✅ Worker queue ko listen karta hai.
- ✅ Worker job execute karta hai.
- ✅ `job.data` Producer se aata hai.
- ✅ Producer aur Worker alag processes ho sakte hain.

---

## Assignment 🚀

1. `worker.ts` banao.
2. Ek terminal me Worker chalao.
3. Dusre terminal me Producer chalao.
4. Observe karo:
   - Worker automatically jobs receive karta hai.
   - `job.data` wahi hota hai jo Producer ne bheja tha.

**Ek chhota challenge bhi:** Worker ke andar sirf `job.data` hi nahi, ye bhi print karna:

```ts
console.log(job.id);
console.log(job.name);
console.log(job.data);
```

Phir mujhe batana:

- `job.id` kya tha?
- `job.name` me kya aaya?
- `job.data` me kya aaya?

Uske baad hum BullMQ ke next concept par chalenge, jahan tum dekhoge ki **job complete hone ke baad BullMQ uska status kaise manage karta hai.** 🚀

# Aaj ka Goal

Aaj bas ye samajhna hai.

✅ Worker queue ko listen karta hai.
✅ Worker job execute karta hai.
✅ job.data Producer se aata hai.
✅ Producer aur Worker alag processes ho sakte hain.
