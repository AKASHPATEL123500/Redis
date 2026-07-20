## Multiple Workers (Horizontal Scaling)

Bhai 😎🔥

Agar tumne Concurrency ka practical kar liya hai aur output dekh liya hai, to **Concurrency chapter complete.** ✅

Ab hum BullMQ ke ek aur production-level concept par aate hain.

---

# 🚀 Chapter 12 — Multiple Workers (Horizontal Scaling)

⚠️ Sabse pehle.

Ye **Concurrency se alag concept hai.**

Bahut log dono ko same samajhte hain.

---

# Pehle Difference Samjho

## Concurrency

Ek Worker.

```text
Worker-1

├── Job1
├── Job2
├── Job3
├── Job4
```

Ek hi process.

Uske andar multiple jobs.

---

## Multiple Workers

```text
Worker-1

↓

Worker-2

↓

Worker-3

↓

Worker-4
```

Alag-alag Node.js processes.

Sab ek hi Queue ko dekh rahe hain.

---

# Real Example

Queue me.

```text
Job1

Job2

Job3

Job4

Job5

Job6
```

Aur.

3 Workers.

```text
Worker1

Worker2

Worker3
```

BullMQ automatically distribute karega.

Example.

```text
Worker1 → Job1

Worker2 → Job2

Worker3 → Job3

Worker1 → Job4

Worker2 → Job5

Worker3 → Job6
```

Notice.

Tumhe manually kuch nahi karna.

Redis hi coordination karta hai.

---

# Practical

Ab tak.

Ek hi terminal tha.

```text
node worker.js
```

Ab.

3 terminals kholo.

Terminal 1

```bash
node worker.js
```

Terminal 2

```bash
node worker.js
```

Terminal 3

```bash
node worker.js
```

Bas.

Aur kuch nahi.

😂

---

# Worker Code

Sirf ye print karna.

```ts
console.log(`Worker PID: ${process.pid} | Job: ${job.id}`);
```

`process.pid` se pata chalega kis process ne job uthayi.

---

# Producer

```ts
for (let i = 1; i <= 20; i++) {
  await queue.add("email", {
    number: i,
  });
}
```

---

# Expected Output

Terminal-1

```text
Worker PID: 12450 | Job 1

Worker PID: 12450 | Job 4

Worker PID: 12450 | Job 8
```

Terminal-2

```text
Worker PID: 13622 | Job 2

Worker PID: 13622 | Job 5

Worker PID: 13622 | Job 9
```

Terminal-3

```text
Worker PID: 14890 | Job 3

Worker PID: 14890 | Job 6

Worker PID: 14890 | Job 10
```

Observe.

Sab Workers.

Ek hi Queue se.

Jobs le rahe hain.

---

# BullMQ ko kaise pata chalta hai?

Ye magic nahi hai.

Redis ke andar BullMQ atomic operations use karta hai taaki **ek hi job do workers ko na mile.**

Flow.

```text
Queue

↓

Redis

↓

Worker1 → Job 1

↓

Worker2 → Job 2

↓

Worker3 → Job 3
```

Har worker Redis se safely next job claim karta hai.

---

# Concurrency + Multiple Workers

Ab maan lo.

```text
3 Workers
```

Aur.

Har Worker.

```ts
concurrency: 5;
```

To.

Total.

```text
3 Workers

×

5 Concurrency

=

15 Jobs

Same Time
```

Yehi production systems me hota hai.

---

# Industry Example

Swiggy.

```text
Redis Queue

↓

Worker-1

↓

Worker-2

↓

Worker-3

↓

Worker-20
```

Har worker.

20 jobs.

Ek saath.

Matlab.

Hundreds of jobs.

Ek hi time me.

---

# Real Use Cases

- 📧 Email Service
- 📱 Push Notifications
- 📄 PDF Generation
- 🖼️ Image Processing
- 🎥 Video Encoding
- 📊 Analytics Processing

Jab load badhta hai.

Naya Worker add.

Bus.

Architecture change nahi.

---

# Assignment 🚀

1. Ek hi `worker.ts` file rakho.
2. 3 terminals kholo.
3. Teeno me same worker run karo.
4. Producer se 20 jobs add karo.
5. Har worker me `process.pid` print karo.
6. Observe:
   - Kya jobs evenly distribute hui?
   - Kya kisi job ko do workers ne process kiya?
   - Agar har worker me `concurrency: 2` kar do, to total kitni jobs ek saath process ho rahi hain?

---

# 📌 Chapter Summary

```text
Concurrency

=

Ek Worker

↓

Multiple Jobs


Multiple Workers

=

Multiple Processes

↓

Same Queue


Final Capacity

=

Workers × Concurrency
```

---

## 🔥 Ab ek update

Is chapter ke baad BullMQ ke **core production concepts** lagbhag complete ho jayenge.

Uske baad hum dekhenge:

- **Repeatable / Scheduled Jobs (Cron)**
- **Bull Board** (Queue Dashboard & Monitoring)
- **Production Email Service Project** (sab concepts ek saath)
- Aur phir tumhare **Short URL Project** me BullMQ ko production-grade tareeke se integrate karenge.

Ab hum tutorial mode se nikal kar real backend architecture mode me enter kar rahe hain. 🚀
