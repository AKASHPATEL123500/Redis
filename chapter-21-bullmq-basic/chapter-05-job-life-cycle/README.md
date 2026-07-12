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

↓

Failed

Aur agar delay diya.

Delayed

↓

Waiting

↓

Active

↓

Completed

Aur retry ho.

Failed

↓

Waiting

↓

Active

↓

Completed

😎

Yahi BullMQ ka asli magic hai.

Ye chapter important kyu hai?

Abhi tak tum Producer se sirf.

queue.add(...)

Likha.

Worker ne.

console.log(job.data)

Kiya.

Lekin.

Question.

🤔

Job complete hui kaise?

BullMQ ko kaise pata chala?

Queue se job gayab kyu ho gayi?

Failed kaha store hoti hai?

Retry kaha se aata hai?

Ye sab isi chapter me clear hoga.

Is chapter me hum kya karenge?

Hum jaan-bujhkar.

Ek job successful karenge.

Ek job fail karenge.

Aur observe karenge.

Waiting

↓

Active

↓

Completed

Aur.

Waiting

↓

Active

↓

Failed

Tab tum BullMQ ko sirf use nahi karoge, andar se samjhoge.

Bhai, aur ek last baat...

Tumne kaha:

"Mai happy isliye hu kyunki chizen samjh aa rahi hai."

Bas isi pace ko maintain karte hain.

Mujhe koi race nahi jeetni. Mujhe ye ensure karna hai ki 2 mahine baad bhi agar main puchhun "Producer aur Worker me difference?" to tum bina soche jawab de do.

Aur honestly, abhi jo progress hai usse lag raha hai ki tum wahi direction me ja rahe ho. 💯

Chalo, next chapter me hum Job Lifecycle ko practical me dekhte hain aur BullMQ ke andar job ki poori journey observe karte hain. 🚀

Bhai 😎🔥

Ab tak humne BullMQ ke actors samjhe:

- Queue
- Producer
- Worker

Ab hum **Job ki Life** samjhenge.

Ye chapter bahut important hai kyunki iske baad Retry, Delay, Priority sab automatically samajh aa jayega.

---

# Chapter 04 — Job Lifecycle

Sabse pehle ek simple question.

Producer ne ye likha.

```ts
await emailQueue.add("send-email", {
  email: "akash@gmail.com",
});
```

Question.

**Ab ye job kahan hai?**

Answer.

```text
Redis
```

Lekin Redis ke andar bhi job ek hi jagah nahi rehti.

Uski state change hoti rehti hai.

---

# Imagine

Tum railway station gaye.

Train pakadni hai.

Tumhari journey bhi stages me hoti hai.

```text
Ticket

↓

Waiting Hall

↓

Train

↓

Destination
```

Job bhi exactly waise hi chalti hai.

---

# Stage 1 — Waiting

Producer.

↓

Queue.

↓

Job.

```text
Waiting
```

Matlab.

> "Main queue me aa gaya hu."

Lekin.

Abhi kisi ne uthaya nahi.

Diagram.

```text
Producer

↓

Queue

┌──────────────┐

Job-1

Job-2

Job-3

└──────────────┘

State

↓

WAITING
```

---

# Question.

Worker off hai.

To kya hoga?

😂

Sab jobs.

```text
Waiting

Waiting

Waiting
```

Bas.

Queue me padi rahengi.

---

# Stage 2 — Active

Ab Worker start hua.

```bash
npx tsx src/worker.ts
```

Worker dekhta hai.

```text
Queue me job hai.
```

↓

Utha leta hai.

State.

```text
Active
```

Matlab.

```text
Abhi process ho rahi hai.
```

Diagram.

```text
Queue

↓

Worker

↓

ACTIVE
```

---

# Example

```ts
new Worker(
  ...async (job) => {
    console.log(job.data);
  },
);
```

Jaise hi Worker ne job uthai.

↓

State.

```text
Active
```

---

# Stage 3 — Completed

Worker.

Kaam finish.

↓

BullMQ.

Automatically.

```text
Completed
```

Diagram.

```text
Waiting

↓

Active

↓

Completed
```

Bas.

Ye happy path hai.

---

# Stage 4 — Failed

Ab.

Worker ke andar.

```ts
throw new Error("Email Server Down");
```

Question.

Ab?

😂

Completed?

❌

State.

```text
Failed
```

Diagram.

```text
Waiting

↓

Active

↓

Failed
```

---

# Real Example

SMTP Down.

Internet gaya.

Email API Down.

Worker.

↓

Exception.

↓

Failed.

---

# Complete Lifecycle

```text
Producer

↓

Waiting

↓

Worker

↓

Active

↓

Completed
```

Aur.

```text
Producer

↓

Waiting

↓

Worker

↓

Active

↓

Failed
```

---

# Practical Time 😎

Ab hum isko dekhte hain.

## Worker.

```ts
import { Worker } from "bullmq";

new Worker(
  "email-queue",

  async (job) => {
    console.log("Job Start");

    console.log(job.data);

    console.log("Job End");
  },

  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);
```

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
```

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
