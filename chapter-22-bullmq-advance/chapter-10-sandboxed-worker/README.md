Bhai ab ye topic **actually production-level** hai. 🔥

Aur isko practical se hi samjhte hain.

---

# Sandbox Worker kya hota hai?

Suppose normal worker hai.

```ts
new Worker("email-queue", async (job) => {
  // process job
});
```

Ye worker **tumhare main Node.js process ke andar hi run hota hai.**

Ab maan lo worker ke andar kisi library ne crash kar diya.

```ts
while (true) {}
```

ya

```ts
process.exit(1);
```

ya

Memory leak ho gaya.

To kya hoga?

👉 **Pura worker process crash ho sakta hai.**

---

# Is problem ka solution?

BullMQ bolta hai:

> "Job ko main process me mat chalao."

> "Uske liye ek **alag process** bana do."

Isi ko **Sandboxed Worker** bolte hain.

---

## Normal Worker

```text
Node Process

├── Express
├── Redis
├── BullMQ Worker
└── Job
```

Sab ek hi process me.

---

## Sandboxed Worker

```text
Node Process

├── Express
├── Redis
└── BullMQ

        │

        ▼

Child Process

└── Job Execute
```

Har job (ya worker execution environment) alag process me execute hota hai.

---

# Iska fayda?

Suppose image processing kar rahe ho.

```text
Upload Image

↓

Resize

↓

Compress

↓

Generate Thumbnail
```

Ye CPU-heavy kaam hai.

Agar normal worker me karoge.

👉 Express API bhi slow ho jayegi.

Sandbox me karoge.

👉 API alag.
👉 Job alag.

Ek crash hua to doosra nahi girega.

---

# Production me kaha use hota hai?

- 📹 Video Processing (FFmpeg)
- 🖼️ Image Processing (Sharp)
- 🤖 AI / ML Inference
- 📄 PDF Generation
- 📊 Excel Report Generation
- OCR
- ZIP Files
- CSV Import

Yani **heavy CPU work**.

---

# Practical

Abhi tak tum worker aise bana rahe the:

```ts
new Worker(
  "email-queue",
  async (job) => {
    console.log(job.data);
  },
  {
    connection: redisConnectionConfig,
  },
);
```

Sandbox me aisa nahi hota.

Job logic ko **alag file** me rakhte hain.

Example:

```
src/
│
├── worker.ts
└── processors/
      └── email.processor.ts
```

Aur Worker us processor file ko load karta hai.

Iska exact code hum agle step me likhenge.

---

# Kya hume har project me Sandbox use karna chahiye?

❌ Nahi.

Email bhejna?

Normal Worker. ✅

OTP bhejna?

Normal Worker. ✅

Redis update?

Normal Worker. ✅

Image resize?

Sandbox. ✅

Video encoding?

Sandbox. ✅

AI model chalana?

Sandbox. ✅

---
