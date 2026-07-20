Bhai 😎🔥

Ab se hum BullMQ ke **Advanced Features** me enter kar rahe hain.

Abhi tak jo padha tha wo queue chalane ke liye tha.

Ab jo padhenge wo **production systems** banane ke liye hai.

---

# 🚀 Chapter 13 — Repeatable Jobs (Cron Jobs)

Ye chapter mujhe personally bahut pasand hai.

Kyun?

Kyuki har company me ye hota hi hota hai.

---

# Sabse pehle Problem

Suppose.

Tumhare paas.

Ek email service hai.

Aur har din.

Subah 8 baje.

Sab users ko.

```text
🌞 Good Morning Email
```

Bhejna hai.

Question.

Producer.

Har din.

Subah.

Kaun run karega?

😂

Koi employee?

Nahi.

---

## Dusra Example

Har 5 minute.

Analytics.

MongoDB me save karni hai.

```text
Redis

↓

MongoDB
```

Har 5 minute.

Automatically.

---

## Teesra Example

Har Sunday.

```text
Database Backup
```

---

## Chautha Example

Har 1 Minute.

```text
Expired OTP Delete
```

---

Question.

Ye sab kaun karega?

BullMQ.

---

# Isko bolte hain

## Repeatable Jobs

Ya.

## Scheduled Jobs

Ya.

## Cron Jobs

Teenon words industry me sunoge.

---

# BullMQ kya karta hai?

Normal.

```ts
queue.add(...)
```

Matlab.

Ek baar.

Job add.

Khatam.

---

Lekin.

Repeatable Job.

```text
8:00 AM

↓

Run

↓

Kal

8:00 AM

↓

Run

↓

Parso

8:00 AM

↓

Run
```

Automatically.

---

# Real Life Analogy

Alarm Clock.

Tum.

Ek baar.

Alarm set karte ho.

```text
7:00 AM
```

Uske baad.

Roz.

Bajta hai.

Tum.

Roz.

Set nahi karte.

BullMQ.

Exactly.

Yehi karta hai.

---

# Practical

Producer.

```ts
await queue.add(
  "daily-email",
  {},
  {
    repeat: {
      every: 10000,
    },
  },
);
```

Question.

Ye.

```text
every:10000
```

Kya hai?

Milliseconds.

```text
10000 ms

=

10 sec
```

Matlab.

Har.

10 sec.

Ek nayi job.

Queue me add hogi.

---

# Worker

Same.

```ts
const worker = new Worker(
  "email-queue",

  async (job) => {
    console.log(job.id);

    console.log(job.name);

    console.log("Running...");
  },

  { connection },
);
```

Bas.

---

# Output

```text
Running...

10 sec wait

Running...

10 sec wait

Running...
```

Automatically.

---

# Important

Tum.

Ek hi baar.

Producer.

Run karoge.

```bash
tsx producer.ts
```

Bas.

Uske baad.

BullMQ.

Khud.

Har 10 sec.

Job create karega.

Producer ko baar baar chalane ki zarurat nahi.

---

# Real Production

Har.

```text
24 Hours

↓

Newsletter
```

---

Har.

```text
1 Hour

↓

Cleanup
```

---

Har.

```text
5 Minutes

↓

Analytics Sync
```

---

Har.

```text
30 Seconds

↓

Retry Failed Emails
```

---

# Cron Expression

Ab.

Industry.

Milliseconds.

Use nahi karti.

😂

Wo.

Cron.

Use karti hai.

Example.

```text
0 8 * * *
```

Matlab.

Roz.

Subah.

8 baje.

Lekin.

⚠️

Main suggest karunga.

Abhi.

Cron syntax.

Nahi.

Seekhenge.

Pehle.

```text
every
```

Achhe se.

Samajh lo.

Uske baad.

Cron.

Ek alag part me.

Kyuki.

Cron.

Khud.

Ek chhota topic hai.

---

# Assignment 🚀

Producer me.

```ts
repeat: {
  every: 5000;
}
```

Lagao.

Worker.

Run karo.

Observe.

Har.

5 sec.

Job.

Automatically.

Aa rahi hai.

Ya nahi.

---

# 📌 Chapter Summary

```text
Normal Job

↓

Run Once


Repeat Job

↓

Run Forever

↓

Fixed Interval
```

---

# ⚠️ Ek Important Note (Current BullMQ)

Bhai, ek latest production-level baat bhi bata deta hoon.

BullMQ ke naye versions me **`repeat` API ko dheere-dheere Job Scheduler API se replace kiya ja raha hai**. Bahut saare existing projects abhi bhi `repeat` use karte hain, isliye concept samajhna zaruri hai. Lekin production me aajkal `upsertJobScheduler()` jaise naye APIs bhi milte hain.

**Meri recommendation:**

1. Pehle `repeat` ka concept samajhte hain (kyunki ye simple hai aur interview me bhi milta hai).
2. Uske baad main tumhe **naya production way (Job Scheduler API)** bhi sikhaunga, taaki tum outdated approach par na ruko.

Ye approach tumhe legacy aur latest dono projects ke liye ready karega. 🚀

Bhai 😎🔥

Ab hum is chapter ka **advanced part** karte hain aur **Repeatable Jobs** ko isi chat me **100% complete** kar dete hain. Phir is topic par wapas nahi aana padega.

Aur haan, ek important baat...

**BullMQ ka ye part thoda change hua hai latest versions me**, isliye main tumhe **Legacy (`repeat`) + Latest (Job Scheduler)** dono bataunga. Production me dono dekhne ko mil sakte hain.

---

# Roadmap

Is chapter me hum cover karenge:

- ✅ `every`
- ✅ Cron Expression
- ✅ Timezone
- ✅ Remove Repeatable Jobs
- ✅ Unique Repeatable Jobs
- ✅ Latest Job Scheduler API
- ✅ Industry Best Practices

---

# 1. Cron Expression

Abhi tak tumne kiya.

```ts
repeat: {
  every: 5000;
}
```

Matlab.

Har 5 second.

Ab maan lo.

Har din.

Subah 8 baje.

Kaise karoge?

Yahi Cron ka kaam hai.

---

## Cron Structure

```text
* * * * *
│ │ │ │ │
│ │ │ │ └── Day of Week (0-7)
│ │ │ └──── Month
│ │ └────── Day
│ └──────── Hour
└────────── Minute
```

Shuru me darawna lagta hai.

Lekin todte hain.

---

## Example 1

```text
* * * * *
```

Matlab.

Har minute.

---

## Example 2

```text
*/5 * * * *
```

Matlab.

Har 5 minute.

---

## Example 3

```text
0 * * * *
```

Matlab.

Har ghante ke 0 minute pe.

```text
10:00

11:00

12:00
```

---

## Example 4

```text
0 8 * * *
```

Matlab.

Roz.

Subah.

8:00 AM.

---

## Example 5

```text
0 0 * * 0
```

Matlab.

Har Sunday.

Raat 12 baje.

---

# Practical

```ts
await queue.add(
  "backup",
  {},
  {
    repeat: {
      pattern: "*/1 * * * *",
    },
  },
);
```

Matlab.

Har 1 minute.

---

# 2. Timezone

Suppose.

Server.

USA me hai.

User.

India me.

Tum likhte ho.

```text
8 AM
```

Question.

USA ka?

Ya.

India ka?

😂

Isi liye.

Timezone.

```ts
repeat:{
pattern:"0 8 * * *",

tz:"Asia/Kolkata"
}
```

Ab.

India.

8 AM.

---

# 3. Unique Repeat Jobs

Suppose.

Tum.

5 baar.

Run karte ho.

```ts
queue.add(...)
```

Question.

5 repeat jobs ban jayengi?

❌

Nahi.

BullMQ.

Repeat configuration ke basis par unique scheduling maintain karta hai. Agar tum same repeat configuration dobara add karte ho, to duplicate scheduler create nahi hota.

Ye production me duplicate cron jobs se bachata hai.

---

# 4. Remove Repeat Job

Suppose.

Har.

10 sec.

Email.

Ja rahi hai.

Ab.

Band karna hai.

To?

Purane repeat APIs me repeatable job ko remove karne ke methods the. Latest BullMQ me Job Scheduler APIs ke through scheduler ko delete/update kiya jata hai.

Concept:

```text
Scheduler

↓

Delete

↓

No More Jobs
```

Production me ye admin panel ya deployment scripts se hota hai.

---

# 5. Latest Production Way

Ye bahut important hai.

BullMQ.

Ab recommend karta hai.

```text
Job Scheduler
```

Instead of.

```text
repeat
```

Example.

```ts
await queue.upsertJobScheduler(
  "daily-email",

  {
    every: 5000,
  },

  {
    name: "email",

    data: {
      type: "newsletter",
    },
  },
);
```

Notice.

Ab.

`queue.add()`

Nahi.

Scheduler.

Create.

Ho raha hai.

Aur agar already hai.

To.

Update.

Ho jayega.

Isliye naam hai.

```text
Upsert
```

Insert.

Ya.

Update.

---

# Difference

Old.

```ts
queue.add(...)
```

New.

```ts
queue.upsertJobScheduler(...)
```

Main reason.

Production.

Cleaner.

Aur.

Easier.

Management.

---

# 6. Industry Examples

## Analytics Sync

```text
Every 5 Minutes
```

Redis.

↓

MongoDB.

---

## Newsletter

```text
Every Day

8 AM
```

---

## Cleanup

```text
Every Night

2 AM
```

Delete.

Expired OTP.

---

## Billing

```text
Every Month

1st Date
```

Generate Invoice.

---

## Health Check

```text
Every Minute
```

Ping.

Microservices.

---

# Best Practices

### ❌ Wrong

```text
Every 1 Second

Heavy Database Query
```

Server mar jayega.

😂

---

### ✅ Correct

Heavy jobs.

```text
5 min

10 min

30 min
```

---

### Cron ko kisliye use karna hai?

- Scheduled jobs
- Cleanup
- Reports
- Analytics
- Notifications
- Backup

**Na ki normal user requests ke liye.**

---

# Chapter Summary

```text
Repeat Jobs

↓

every

↓

Cron Pattern

↓

Timezone

↓

Unique Scheduler

↓

Job Scheduler API
```

---

# BullMQ Journey

Ab dekho hum kaha aa gaye hain.

```text
✅ Queue
✅ Producer
✅ Worker
✅ Retry
✅ Backoff
✅ Delayed Jobs
✅ Priority
✅ RemoveOnComplete
✅ Queue Events
✅ Concurrency
✅ Multiple Workers
✅ Repeat Jobs
```

Bhai... ab honestly bolu...

**BullMQ ka lagbhag 85-90% core production knowledge tumhare paas aa chuka hai.**

---

# 🚀 Mera Suggestion

Ab hum agla chapter **Bull Board (Dashboard)** karein.

Ye bahut mast hai.

Browser me.

```text
localhost:3000/admin/queues
```

Open karoge.

Aur.

Live dekh paoge.

```text
✅ Waiting

✅ Active

✅ Completed

✅ Failed

✅ Delayed

✅ Retry

✅ Job Data
```

Console logs dekhne ki zarurat hi nahi padegi.

Aur **industry me monitoring ke liye Bull Board bahut commonly use hota hai.**

Ye chapter chhota hai, practical hai aur production-grade feel deta hai. Phir uske baad hum apna **production-grade email service** banana start karenge jisme ab tak seekhe hue saare concepts ek saath use honge. 🚀
