Perfect bhai. 🔥

Ab hum Redis ke **Production Side** me enter kar rahe hain.

Abhi tak humne jo padha:

- ✅ Strings
- ✅ TTL
- ✅ Hashes
- ✅ Lists
- ✅ Sets
- ✅ Sorted Sets
- ✅ Pub/Sub
- ✅ Transactions (`WATCH`)
- ✅ Pipeline
- ✅ Lua Scripts

Ye sab Redis **RAM** me karta hai.

Ab sabse bada question...

# 🤔 Agar Redis Server band ho gaya to?

Maan lo.

```text
Redis RAM

user:1
↓

Akash

wallet
↓

5000

leaderboard
↓

100 users

cache
↓

10000 records
```

Ab achanak:

```text
Power Cut ⚡

OR

Docker Stop

OR

Server Crash
```

Question...

RAM ka data kahan gaya?

👉 **Ud gaya.** 💨

RAM **volatile memory** hoti hai.

Isi problem ko solve karta hai:

# Chapter 12 — Persistence

Persistence ka matlab:

> **RAM ke data ko Disk par save karna**, taki Redis restart hone ke baad bhi data wapas mil jaye.

---

# Redis me 2 Main Persistence Methods hain

```text
Persistence

        │
   ┌────┴────┐
   │         │
   ▼         ▼

RDB       AOF
```

Bas yehi do methods industry me use hote hain.

---

# 1️⃣ RDB (Redis Database Backup)

Socho tum mobile me photo lete ho.

📸

Ek photo click ki.

Us time jo scene tha wahi save ho gaya.

Uske baad room badal gaya.

Photo nahi badlegi.

RDB bhi exactly aisa hi hai.

```text
12:00

Redis

↓

SAVE Snapshot

↓

dump.rdb
```

Ab.

12:10 pe data badal gaya.

12:20 pe bhi badal gaya.

Lekin.

```text
dump.rdb
```

Same rahegi.

Ye ek **Snapshot** hai.

---

# Visual

```text
Redis RAM

↓

SAVE

↓

dump.rdb

↓

Disk
```

---

# Agar Crash ho gaya

Redis restart.

↓

```text
dump.rdb

↓

RAM
```

Data wapas aa jayega.

---

# Fayda

✅ Fast backup

✅ Fast recovery

✅ Kam disk use

---

# Nuksan

Maan lo.

Snapshot hua.

```text
12:00
```

Crash hua.

```text
12:09
```

To.

```text
12:01

12:02

12:03

...

12:09
```

Ka data lose ho sakta hai.

Kyuki wo snapshot me tha hi nahi.

---

# 2️⃣ AOF (Append Only File)

Ye bilkul alag idea hai.

Snapshot nahi.

Ye har command likhta rehta hai.

Example.

Tumne.

```text
SET name Akash
```

File me.

```text
SET name Akash
```

Fir.

```text
SET age 22
```

File me.

```text
SET age 22
```

Fir.

```text
DEL age
```

File me.

```text
DEL age
```

Yani.

```text
Redis

↓

SET

↓

SET

↓

DEL

↓

INCR

↓

LPUSH

↓

ZADD

↓

...

Sab file me likhta rehta hai.
```

---

# Restart ke time

Redis kya karta hai?

File padhta hai.

Aur commands dobara execute karta hai.

```text
SET name Akash

↓

SET age 22

↓

DEL age

↓

INCR wallet

↓

Done
```

Aur RAM fir se ban jati hai.

---

# Fayda

Bahut kam data loss.

Kabhi-kabhi almost zero.

---

# Nuksan

File bahut badi ho sakti hai.

Isliye Redis background me usko compact bhi karta hai (rewrite).

---

# Simple Comparison

| Feature               | RDB          | AOF         |
| --------------------- | ------------ | ----------- |
| Kaise save karta hai? | Snapshot     | Har command |
| Speed                 | Bahut fast   | Thoda slow  |
| Disk Size             | Chhoti       | Badi        |
| Recovery              | Fast         | Thodi slow  |
| Data Loss             | Ho sakta hai | Bahut kam   |

---

# Industry me kya hota hai?

Production me aksar:

```text
Redis

↓

RDB

+

AOF
```

Dono enable rehte hain.

Kyun?

- RDB → Fast recovery
- AOF → Kam data loss

Best of both worlds.

---

# Hum kya karenge?

Ab theory kaafi ho gayi.

Jaise humne har chapter me practical kiya, waise hi isme bhi karenge.

### Lab-1

- Redis container start karenge.
- `dump.rdb` ko apni aankhon se dekhenge.
- Redis stop karenge.
- Restart karenge.
- Verify karenge ki data wapas aaya ya nahi.

### Lab-2

- AOF enable karenge.
- `appendonly.aof` file dekhenge.
- Uske andar actual Redis commands padhenge.
- Redis restart karke dekhenge ki wahi commands replay hokar data restore hota hai.

Ye chapter command ya API se zyada **Redis ke andar kya hota hai** samajhne ke liye hai. Iske baad tumhe Redis sirf use karna hi nahi, uski internals bhi samajh aayengi. 🚀
