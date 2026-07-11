# Redis chapter 1 to 7

## 🚀 Summary of what I learned

This README explains the Redis concepts you have covered so far, in a short and easy way.

- **Chapter 1: String**
  - Use Redis for simple values like OTP and cache.
  - One key stores one value.
- **Chapter 2: Hash**
  - Use Redis hash for user data and small objects.
  - One key stores many field/value pairs.
- **Chapter 3: List**
  - Use Redis list for activity feeds and queues.
  - Items stay in order, from first to last.
- **Chapter 4: Set**
  - Use Redis set for likes and membership.
  - Values are unique and duplicate values are not allowed.
- **Chapter 6: Set commands**
  - Practice adding and removing values.
- **Chapter 7: Sorted Set**
  - Use Redis sorted set for leaderboards.
  - Each member has a score and Redis orders them by score.

## 🧩 What I built

| Data Structure | Project       |
| -------------- | ------------- |
| String         | OTP / Cache   |
| Hash           | User Cache    |
| List           | Activity Feed |
| Set            | Like System   |
| Sorted Set     | Leaderboard   |

## 🔥 Redis data structure guide

### 1) String

- **What it does**: store a single value at one key.
- **When to use**: cache, OTP, simple counters, small text.
- **Command examples**:
  - `SET user:1:name "Akash"`
  - `GET user:1:name`
  - `INCR counter:visits`
- **Syntax**:

```text
SET key value
GET key
INCR key
```

### 2) Hash

- **What it does**: store many fields inside one key.
- **When to use**: user profile, object data, form values.
- **Command examples**:
  - `HSET user:1 name "Akash" age 25`
  - `HGET user:1 name`
  - `HGETALL user:1`
- **Syntax**:

```text
HSET key field1 value1 field2 value2
HGET key field
HGETALL key
```

### 3) List

- **What it does**: store values in order.
- **When to use**: activity feed, message queue, recent items.
- **Command examples**:
  - `LPUSH feed "new event"`
  - `RPUSH feed "last event"`
  - `LRANGE feed 0 -1`
- **Syntax**:

```text
LPUSH key value
RPUSH key value
LRANGE key start stop
```

### 4) Set

- **What it does**: store unique values without order.
- **When to use**: likes, tags, membership checks.
- **Command examples**:
  - `SADD likes user:1`
  - `SISMEMBER likes user:1`
  - `SMEMBERS likes`
- **Syntax**:

```text
SADD key member
SREM key member
SISMEMBER key member
SMEMBERS key
```

### 5) Sorted Set

- **What it does**: store unique values with a score.
- **When to use**: leaderboard, ranking, ordered scores.
- **Command examples**:
  - `ZADD leaderboard 100 Akash`
  - `ZRANGE leaderboard 0 -1 WITHSCORES`
  - `ZREVRANK leaderboard Akash`
- **Syntax**:

```text
ZADD key score member
ZRANGE key start stop [WITHSCORES]
ZREVRANK key member
```

## 💡 Easy difference between data structures

- **String**: one key = one value.
- **Hash**: one key = many fields.
- **List**: ordered values, allow duplicates.
- **Set**: unique values, no order.
- **Sorted Set**: unique values with score order.

## ✅ Quick note

- Use **Strings** for simple values.
- Use **Hashes** for object-like data.
- Use **Lists** for ordered feeds.
- Use **Sets** for unique collections.
- Use **Sorted Sets** for ranking and leaderboards.

# chapter 09 one topic is pending that is `WATCH`

```js
Redis Foundation
│
├── Connection
├── Strings
├── TTL
├── Hashes
├── Lists
├── Sets
├── Sorted Sets
├── Pub/Sub
├── Transactions
├── Pipeline
│
├── Lua Scripts
├── SCAN
├── Bitmaps
├── HyperLogLog
├── Geospatial
├── Streams
├── Memory Optimization
├── Eviction Policies
├── Persistence
├── Replication
├── Sentinel
├── Cluster
├── Monitoring
├── Slow Log
├── Security
├── Benchmarking
├── ...
│
└── BullMQ
      │
      ├── Producer
      ├── Worker
      ├── Retry
      ├── Delay
      ├── Priority
      ├── Rate Limit
      ├── Repeat Jobs
      ├── Dead Letter Queue
      └── Production Email Queue
```

_chapter 12 to 13_

`Persistence` = Data save permamently
`Redis` = data save into (HDD/SDD)

`There are wo ways in redis : `

1. RDB = redis database
   example : jise game mein "save" button game

example:
10.00AM----> Snapshot
10.05AM----> Snapshot
10.08AM----> Snapshot
10.10AM----> Snapshot

`Agr 8 per crash ho yajega to 10:05 wala data milega`

FAST = backup ke liye fast

2. AOF = Append only file
   ye har write command ko filemei likhta rahta hai

emaple:
SET name akahs
SET age 19
DEL age

carsh hua to ye command dubra chala lenge --- > Data loss bahut kaam

Memory management = RAM ko kkise mamge karna hai

# Evicition = puaran data hata kar naya data rakhna

`there are three way to delte data`

1. LRU (Least Recently Used) = sabse deer tak aisi konsi key hai usko find kar ke delete karna redis

2. LFU ( Least Frequently Used ) = Sabse kaam baar used key ko delete kar deta hai

3. TTL ( time to live )---> The expire filter = redisn un key ko delete karta hai jin per `EXPIRE` ka time laga ho

Bhai, ekdum lajawab! Tumne jo terminal ka output bheja hai, use dekh kar dil khush ho gaya. Tumhara `OBJECT ENCODING user:age` ka output `"int"` aaya hai, jo ye saaf-saaf validate karta hai ki Redis ne memory bachane ke liye piche se apna dimaag chala diya hai!

Aur ek aur mazedar baat dekho tumhare output mein:

- `maxmemory: 0` aur `maxmemory_human: 0B` dikha raha hai. Iska matlab abhi Redis ke paas koi limit nahi hai, ye tumhare computer ki saari RAM kha sakta hai.
- `maxmemory_policy: noeviction` dikha raha hai. Iska matlab agar RAM full hui, to ye kisi data ko laat nahi marega balki direct error de dega.

Tumne ekdum sahi socha—**Chapter 13 (Memory), Chapter 14 (Eviction), aur Chapter 15 (Replication) teeno ko ek sath mila kar padhte hain**, kyunki ye teeno milkar hi Redis ka asli production architecture banate hain.

Chalo haath mein chai ka ek bada sip lo, aur bina kisi jhanjhat ke, in dono bache hue chapters ki poori kahani aur unka live test ek sath samajhte hain!

---

## Chapter 14: Eviction Policies (Laat Maar Kar Nikalna) 🚫

Abhi tumne dekha ki tumhari policy `noeviction` hai. Lekin production mein jab RAM full hone lagti hai, tab hum Redis ko bolte hain ki _"Bhai, naya data aane par purane bekaar data ko delete karna shuru karo."_ Is delete karne ke tarike ko bolte hain **Eviction Policy**.

Redis mein main 3 tarike hote hain data ko chunkar nikalne ke:

1. **LRU (Least Recently Used) — _The Lazy Filter_:** Redis dekhta hai ki aisi kaun si key hai jise sabse lambe samay se kisi ne touch (na get, na set) nahi kiya hai. Jo sabse zyada der se soti padi hai, use laat maar kar nikal deta hai.
2. **LFU (Least Frequently Used) — _The Unpopular Filter_:** Redis dekhta hai ki kaun si key sabse kam baar use hui hai. Maan lo ek key 10 din purani hai par use log roz 1000 baar dekhte hain, aur ek key kal bani hai par use kisi ne nahi dekha, to kam use hone wali key ud jayegi.
3. **TTL (Time to Live) — _The Expiring Filter_:** Redis sirf un keys ko target karta hai jin par tumne `EXPIRE` ka timer lagaya tha. Wo dekhta hai ki kiska bacha hua time sabse kam hai, aur use pehle saaf kar deta hai.

---

## Chapter 15: Master-Slave Replication (Data Copy Paste Setup) 👥

Socho tumhara poora dhandha ek hi Redis server par chal raha hai. Agar us computer ka hardware kharab ho gaya ya crash ho gaya, to tumhaari poora system down ho jayega!

Isse bachne ke liye hum banate hain **Replication Architecture**:

- **Master Server:** Ye tumhaara main server hota hai. Tumhaara Express backend jo bhi naya data likhega (`SET`, `HSET`), wo isi Master ke paas jayega.
- **Slave (Replica) Server:** Ye Master ka ek chota bhai hota hai. Iska kaam sirf aur sirf Master ke data par nazar rakhna aur uski ek copy apne paas clone karke rakhna hai.
- **Fayda:** Agar kabhi Master server crash ho gaya, to tumhaara system down nahi hoga, Slave turant kood kar aage aayega aur naya Master ban jayega!

---

## 🔥 TEENO CHAPTERS KA EK SATH LIVE PRACTICAL (Bina Internet Waala Setup)

Chalo abhi jo tumhara container chal raha hai, usi ke andar hum RAM ko fake tarike se full karenge aur dekhenge ki Redis data ko kaise evict (delete) karta hai aur master-slave kaise configure hota hai.

Wapas apne `redis-cli` ke andar hi raho aur ye step-by-step commands chalao:

### Step 1: Max Memory Ko Sirf 100 KB Set Karo

Hum jaan-boojhkar limit ko ekdum chota kar dete hain taaki Redis turant full ho jaye:

```text
CONFIG SET maxmemory 100kb

```

### Step 2: Policy Ko Badalkar LRU Karo

Redis ko bolo ki jo sabse purani key ho use nikalna shuru kare:

```text
CONFIG SET maxmemory-policy allkeys-lru

```

### Step 3: Check Karo (Kya Setting Badli?)

Wapas se check karo ki kya hamari setting live update hui:

```text
INFO MEMORY

```

Tumhare output mein ab `maxmemory_human: 100.00K` aur `maxmemory_policy: allkeys-lru` saaf-saaf dikhega!

### Step 4: System Ko Slave Kaise Banate Hain?

Agar tumhe isi chalte hue server ko kisi dusre server ka slave banana ho, to ek single command lagti hai:

```text
REPLICAOF 127.0.0.1 6380

```

_(Ye likhte hi tumhara current Redis doosre port par chal rahe Redis ka gulam ban jayega aur wahan se data copy karne lagega. Abhi isko mat chalana kyunki hum ek hi container chala rahe hain, par interview ke liye ye command dimaag mein lock rakhna)._

---

Bhai, ye teeno chizen ek sath connect ho gayi:

1. **Memory:** `INFO MEMORY` se RAM check ki.
2. **Eviction:** Limit `100kb` lagakar policy `allkeys-lru` set kar di.
3. **Replication:** `REPLICAOF` command se master-slave ka logic samajh liya.

In commands ko apne chalte hue CLI mein fire karo aur dekho `INFO MEMORY` ka nazaara kaise badalta hai. Iske sath hi tumhaara Redis ka core setup aur concepts **100% complete** hote hain! Kaisa laga poora flow bhai?

### BullMQ me hum banayenge:

Email Queue
OTP Queue
Image Processing Queue
Retry
Delay Jobs
Repeatable Jobs
Priority Queue
Dead Letter Queue
Worker
Scheduler
Queue Events
Dashboard

Yahi production engineering hai.

### Ye strategy ko "Lazy Loading" kyu bolte hain?

````ts
Kyuki Redis me data pehle se nahi hota.

Jab first baar request aati hai tab hi load hota hai.

Isliye naam:

Lazy Loading
```

````
