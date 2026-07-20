  <div align="center">

# ⚡ Redis & BullMQ Mastery Series

### Zero to Production — Backend Engineering Lab

_Real-world Redis architecture, queue systems, and caching strategies used in high-scale production systems._

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-FF4500?style=for-the-badge&logo=redis&logoColor=white)

![Stars](https://img.shields.io/github/stars/AKASHPA/redis?style=social)
![Forks](https://img.shields.io/github/forks/AKASHPA/redis?style=social)

</div>

---

<!-- 📸 Add a real screenshot, GIF, or architecture diagram here before publishing.
     Example: ![Architecture Diagram](./assets/architecture.png)
     A quick demo GIF of a worker processing a job, or a cache-hit/miss flow diagram, works great. -->

## 🤔 Why Redis?

- DB reads are slow under repeat traffic → Redis lives in RAM → answers in **microseconds**
- Not just a cache — it's also a **queue**, **pub/sub bus**, **lock manager**, and **rate limiter**
- This repo covers all four roles, not just caching

---

## 📌 Why This Repo

- Most tutorials stop at `SET`/`GET` — this one goes to production patterns
- Every chapter = a **working, runnable folder**, not just notes
- Covers caching, locking, rate limiting, sessions, leaderboards, and a full BullMQ queue system
- Built for **interview prep** and **real projects**

---

## ⚔️ Redis vs Memcached

|                  | Redis                               | Memcached           |
| ---------------- | ----------------------------------- | ------------------- |
| Data types       | Strings, Lists, Sets, Hashes, ZSets | Strings only        |
| Persistence      | ✅                                  | ❌                  |
| Pub/Sub          | ✅                                  | ❌                  |
| Works as a queue | ✅                                  | ❌                  |
| Best for         | Caching + queues + real-time        | Simple caching only |

**TL;DR:** Memcached = lighter, dumb cache. Redis = cache + queue + pub/sub + leaderboards. That's why this repo runs on Redis.

---

## 🗂️ What's Inside

| #   | Chapter             | What You'll Build                 | Level           | Used In Real Life By                     |
| --- | ------------------- | --------------------------------- | --------------- | ---------------------------------------- |
| 01  | Redis Basics        | Docker setup + first connection   | 🟢 Beginner     | Every Redis-backed app, ever             |
| 02  | Strings             | GET/SET fundamentals              | 🟢 Beginner     | Basic caching layers                     |
| 03  | TTL & Expiry        | Auto-expiring keys                | 🟢 Beginner     | OTP systems, temp login tokens           |
| 04  | Lists               | Queue & stack operations          | 🟢 Beginner     | Notification queues                      |
| 05  | Hashes              | User profile object caching       | 🟡 Intermediate | Instagram-style profile caching          |
| 06  | Sets                | Unique element storage            | 🟡 Intermediate | "Who liked this post" (dedup)            |
| 07  | Sorted Sets         | Ranking systems (ZSET)            | 🟡 Intermediate | Gaming leaderboards, trending feeds      |
| 08  | Pub/Sub             | Real-time messaging               | 🟡 Intermediate | Live chat, notification fan-out          |
| 09  | Transactions        | Atomicity with MULTI/EXEC/WATCH   | 🟡 Intermediate | Wallet/payment balance updates           |
| 10  | Pipelines           | Batching for performance          | 🟡 Intermediate | Bulk analytics writes                    |
| 11  | Lua Scripts         | Atomic server-side logic          | 🔴 Advanced     | Custom rate limiters at scale            |
| 12  | Persistence         | RDB snapshots + AOF logs          | 🟡 Intermediate | Crash-safe production Redis              |
| 13  | Memory Management   | Lazy vs active deletion           | 🔴 Advanced     | Tuning Redis under memory pressure       |
| 14  | Eviction Policies   | LRU, LFU, TTL-based recovery      | 🔴 Advanced     | CDN & cache-full recovery                |
| 15  | Caching Strategies  | Design patterns overview          | 🟡 Intermediate | System design interview staple           |
| 16  | Distributed Locking | SETNX-based concurrency control   | 🔴 Advanced     | Preventing double-charging in payments   |
| 17  | Rate Limiting       | Traffic throttling                | 🟡 Intermediate | Twitter/API-style request throttling     |
| 18  | Session Store       | Scalable auth sessions            | 🟡 Intermediate | Multi-server login sessions              |
| 19  | Leaderboards        | High-speed gaming/score boards    | 🟡 Intermediate | PUBG/Free Fire-style rankings            |
| 20  | Real-Time Analytics | Live tracking & metrics           | 🔴 Advanced     | Live viewer counts (YouTube-style)       |
| 21  | BullMQ              | Producers, workers, job lifecycle | 🔴 Advanced     | Email queues, video processing pipelines |

**Bonus — Production Cache Lab:** Cache-Aside, Read-Through, Write-Through, Write-Around, Write-Behind, and Refresh-Ahead — all implemented side-by-side so you can compare tradeoffs directly.

---

## 📁 Full Directory Structure

```
redis/
├── 01-redis/
├── 02-redis-string/
├── chapter-03-expire-ttl/
├── redis-list/.               # chapter 04
├── user-profile-cache/        # chapter 05
├── chapter-06-redis-set/
├── chapter-07-sorted-sets/
├── chapter-08-pub-sub/
├── chapter-09-Transactions/
├── chapter-10-piplines-performance/
├── chapter-11-lua-scripts-atomic-logic/
├── chapter-12-persistence-RDB-AOF/
├── chapter-13-memory-management/
├── chapter-14-evication-policies/
├── chapter-15-caching-strategies/
├── chapter-16-distributed-locking/
├── chapter-17-rate-limiting/
├── chapter-18-session-store/
├── chapter-19-leaderboards/
├── chapter-20-real-time-analytics/
│
├── production-lab/
│   └── Lab/cache-strategies/
│       ├── aside-pattern/
│       ├── read-through/
│       ├── refresh-ahead/
│       ├── write-around/
│       ├── write-behind/
│       └── write-through/
│
├── chapter-21-bullmq-basic/
│   ├── 01-installation/
│   ├── 02-first-job-queue/
│   ├── 03-producer/
│   ├── 04-worker/
│   └── 05-job-life-cycle/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer          | Tool             |
| -------------- | ---------------- |
| Runtime        | Node.js / Bun    |
| Language       | TypeScript       |
| Framework      | Express.js       |
| Cache/Broker   | Redis 7 (Alpine) |
| Queue Engine   | BullMQ           |
| Client Library | ioredis          |
| Container      | Docker           |

---

## ⚡ Quick Start

**1. Clone the repo**

```bash
git clone https://github.com/AKASHPA/redis.git
cd redis
```

**2. Install dependencies**

```bash
bun install
# or
npm install
```

**3. Spin up Redis using the included `docker-compose.yml`**

```bash
docker-compose up -d
```

Ships with persistence + port mapping + volume already configured — nothing to set up manually.

Stop it anytime:

```bash
docker-compose down
```

**4. Run any chapter**

```bash
bun run src/index.ts
```

**5. Stay updated**

```bash
git pull origin main
```

---

## 💻 Popular Commands, Explained

| Command                      | What It Does                                                  |
| ---------------------------- | ------------------------------------------------------------- |
| `SET key value EX 60`        | Value auto-deletes in 60s — powers OTPs & temp sessions       |
| `SETNX key value`            | Set only if key doesn't exist — the base of distributed locks |
| `EXPIRE key seconds`         | Adds a countdown to an existing key                           |
| `MULTI ... EXEC`             | Runs a batch atomically — all or nothing                      |
| `LPUSH` / `RPUSH`            | O(1) push to a list — the raw primitive behind queues         |
| `ZADD board 100 "p1"`        | Adds a ranked member — powers leaderboards instantly          |
| `PUBLISH` / `SUBSCRIBE`      | Instant real-time messaging, no polling                       |
| `EVAL <lua-script>`          | Runs custom logic atomically inside Redis                     |
| `queue.add("job", data)`     | BullMQ — drops a job in without blocking your app             |
| `worker.on("completed", cb)` | Fires the moment a background job finishes                    |

---

## 🧠 Checkpoint — Test Yourself

Before moving to the next chapter, you should be able to answer these without looking back:

- Why is `SETNX` the foundation of distributed locks, and not just plain `SET`?
- If two servers both call `EXPIRE` on the same key at different times, which one wins?
- What breaks if you use `LPUSH`/`RPOP` for a job queue instead of `BullMQ`, at scale?
- Why does `MULTI/EXEC` **not** roll back on a runtime error the way a SQL transaction does?
- Between LRU and LFU eviction, which one would you pick for a "trending posts" cache — and why?

If you can explain these out loud to someone else, you've actually learned the chapter — not just copy-run the code.

  <div align="center">

# ⚡ Redis & BullMQ Mastery Series

### Zero to Production — Backend Engineering Lab

_Real-world Redis architecture, queue systems, and caching strategies used in high-scale production systems._

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-FF4500?style=for-the-badge&logo=redis&logoColor=white)

![Stars](https://img.shields.io/github/stars/AKASHPA/redis?style=social)
![Forks](https://img.shields.io/github/forks/AKASHPA/redis?style=social)

</div>

---

<!-- 📸 Add a real screenshot, GIF, or architecture diagram here before publishing.
     Example: ![Architecture Diagram](./assets/architecture.png)
     A quick demo GIF of a worker processing a job, or a cache-hit/miss flow diagram, works great. -->

## 🤔 Why Redis?

- DB reads are slow under repeat traffic → Redis lives in RAM → answers in **microseconds**
- Not just a cache — it's also a **queue**, **pub/sub bus**, **lock manager**, and **rate limiter**
- This repo covers all four roles, not just caching

---

## 📌 Why This Repo

- Most tutorials stop at `SET`/`GET` — this one goes to production patterns
- Every chapter = a **working, runnable folder**, not just notes
- Covers caching, locking, rate limiting, sessions, leaderboards, and a full BullMQ queue system
- Built for **interview prep** and **real projects**

---

## ⚔️ Redis vs Memcached

|                  | Redis                               | Memcached           |
| ---------------- | ----------------------------------- | ------------------- |
| Data types       | Strings, Lists, Sets, Hashes, ZSets | Strings only        |
| Persistence      | ✅                                  | ❌                  |
| Pub/Sub          | ✅                                  | ❌                  |
| Works as a queue | ✅                                  | ❌                  |
| Best for         | Caching + queues + real-time        | Simple caching only |

**TL;DR:** Memcached = lighter, dumb cache. Redis = cache + queue + pub/sub + leaderboards. That's why this repo runs on Redis.

---

## 🗂️ What's Inside

| #   | Chapter             | What You'll Build                 | Level           | Used In Real Life By                     |
| --- | ------------------- | --------------------------------- | --------------- | ---------------------------------------- |
| 01  | Redis Basics        | Docker setup + first connection   | 🟢 Beginner     | Every Redis-backed app, ever             |
| 02  | Strings             | GET/SET fundamentals              | 🟢 Beginner     | Basic caching layers                     |
| 03  | TTL & Expiry        | Auto-expiring keys                | 🟢 Beginner     | OTP systems, temp login tokens           |
| 04  | Lists               | Queue & stack operations          | 🟢 Beginner     | Notification queues                      |
| 05  | Hashes              | User profile object caching       | 🟡 Intermediate | Instagram-style profile caching          |
| 06  | Sets                | Unique element storage            | 🟡 Intermediate | "Who liked this post" (dedup)            |
| 07  | Sorted Sets         | Ranking systems (ZSET)            | 🟡 Intermediate | Gaming leaderboards, trending feeds      |
| 08  | Pub/Sub             | Real-time messaging               | 🟡 Intermediate | Live chat, notification fan-out          |
| 09  | Transactions        | Atomicity with MULTI/EXEC/WATCH   | 🟡 Intermediate | Wallet/payment balance updates           |
| 10  | Pipelines           | Batching for performance          | 🟡 Intermediate | Bulk analytics writes                    |
| 11  | Lua Scripts         | Atomic server-side logic          | 🔴 Advanced     | Custom rate limiters at scale            |
| 12  | Persistence         | RDB snapshots + AOF logs          | 🟡 Intermediate | Crash-safe production Redis              |
| 13  | Memory Management   | Lazy vs active deletion           | 🔴 Advanced     | Tuning Redis under memory pressure       |
| 14  | Eviction Policies   | LRU, LFU, TTL-based recovery      | 🔴 Advanced     | CDN & cache-full recovery                |
| 15  | Caching Strategies  | Design patterns overview          | 🟡 Intermediate | System design interview staple           |
| 16  | Distributed Locking | SETNX-based concurrency control   | 🔴 Advanced     | Preventing double-charging in payments   |
| 17  | Rate Limiting       | Traffic throttling                | 🟡 Intermediate | Twitter/API-style request throttling     |
| 18  | Session Store       | Scalable auth sessions            | 🟡 Intermediate | Multi-server login sessions              |
| 19  | Leaderboards        | High-speed gaming/score boards    | 🟡 Intermediate | PUBG/Free Fire-style rankings            |
| 20  | Real-Time Analytics | Live tracking & metrics           | 🔴 Advanced     | Live viewer counts (YouTube-style)       |
| 21  | BullMQ              | Producers, workers, job lifecycle | 🔴 Advanced     | Email queues, video processing pipelines |

**Bonus — Production Cache Lab:** Cache-Aside, Read-Through, Write-Through, Write-Around, Write-Behind, and Refresh-Ahead — all implemented side-by-side so you can compare tradeoffs directly.

---

## 📁 Full Directory Structure

```
redis/
├── 01-redis/
├── 02-redis-string/
├── chapter-03-expire-ttl/
├── redis-list/.               # chapter 04
├── user-profile-cache/        # chapter 05
├── chapter-06-redis-set/
├── chapter-07-sorted-sets/
├── chapter-08-pub-sub/
├── chapter-09-Transactions/
├── chapter-10-piplines-performance/
├── chapter-11-lua-scripts-atomic-logic/
├── chapter-12-persistence-RDB-AOF/
├── chapter-13-memory-management/
├── chapter-14-evication-policies/
├── chapter-15-caching-strategies/
├── chapter-16-distributed-locking/
├── chapter-17-rate-limiting/
├── chapter-18-session-store/
├── chapter-19-leaderboards/
├── chapter-20-real-time-analytics/
│
├── production-lab/
│   └── Lab/cache-strategies/
│       ├── aside-pattern/
│       ├── read-through/
│       ├── refresh-ahead/
│       ├── write-around/
│       ├── write-behind/
│       └── write-through/
│
├── chapter-21-bullmq-basic/
│   ├── 01-installation/
│   ├── 02-first-job-queue/
│   ├── 03-producer/
│   ├── 04-worker/
│   └── 05-job-life-cycle/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer          | Tool             |
| -------------- | ---------------- |
| Runtime        | Node.js / Bun    |
| Language       | TypeScript       |
| Framework      | Express.js       |
| Cache/Broker   | Redis 7 (Alpine) |
| Queue Engine   | BullMQ           |
| Client Library | ioredis          |
| Container      | Docker           |

---

## ⚡ Quick Start

**1. Clone the repo**

```bash
git clone https://github.com/AKASHPA/redis.git
cd redis
```

**2. Install dependencies**

```bash
bun install
# or
npm install
```

**3. Spin up Redis using the included `docker-compose.yml`**

```bash
docker-compose up -d
```

Ships with persistence + port mapping + volume already configured — nothing to set up manually.

Stop it anytime:

```bash
docker-compose down
```

**4. Run any chapter**

```bash
bun run src/index.ts
```

**5. Stay updated**

```bash
git pull origin main
```

---

## 💻 Popular Commands, Explained

| Command                      | What It Does                                                  |
| ---------------------------- | ------------------------------------------------------------- |
| `SET key value EX 60`        | Value auto-deletes in 60s — powers OTPs & temp sessions       |
| `SETNX key value`            | Set only if key doesn't exist — the base of distributed locks |
| `EXPIRE key seconds`         | Adds a countdown to an existing key                           |
| `MULTI ... EXEC`             | Runs a batch atomically — all or nothing                      |
| `LPUSH` / `RPUSH`            | O(1) push to a list — the raw primitive behind queues         |
| `ZADD board 100 "p1"`        | Adds a ranked member — powers leaderboards instantly          |
| `PUBLISH` / `SUBSCRIBE`      | Instant real-time messaging, no polling                       |
| `EVAL <lua-script>`          | Runs custom logic atomically inside Redis                     |
| `queue.add("job", data)`     | BullMQ — drops a job in without blocking your app             |
| `worker.on("completed", cb)` | Fires the moment a background job finishes                    |

---

## 🗺️ Roadmap

- [x] Core Redis data structures (Ch. 1–10)
- [x] Advanced patterns — Lua, persistence, eviction (Ch. 11–15)
- [x] Production patterns — locking, rate limiting, sessions (Ch. 16–18)
- [x] BullMQ job queue system (Ch. 21)
- [ ] Redis Streams (event sourcing patterns)
- [ ] Redis Cluster / horizontal scaling walkthrough
- [ ] Full mini-project: real-time chat app using everything in this repo

---

## 🎯 Who This Is For

- Backend devs prepping for **system design interviews**
- Developers who want to actually understand **caching internals**, not just use `redis.set()`
- Anyone building a **production job-queue system** with BullMQ
- Students who learn best by running real code, not reading slides

---

## 🤝 Contributing

Found a bug or want to add a new caching pattern? PRs are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Open a PR

---

## ⭐ Support

If this repo helped you understand Redis or BullMQ better, drop a **star** — it helps others find it too.

## 📬 Connect

Questions, feedback, or just want to talk backend architecture? Reach out:

- GitHub: [@AKASHPA](https://github.com/AKASHPA)
- LinkedIn: _add your link here_
- Portfolio: _add your link here_

<div align="center">

**Built by Akash** —

</div>
## 🧠 Checkpoint — Test Yourself

Before moving to the next chapter, you should be able to answer these without looking back:

- Why is `SETNX` the foundation of distributed locks, and not just plain `SET`?
- If two servers both call `EXPIRE` on the same key at different times, which one wins?
- What breaks if you use `LPUSH`/`RPOP` for a job queue instead of `BullMQ`, at scale?
- Why does `MULTI/EXEC` **not** roll back on a runtime error the way a SQL transaction does?
- Between LRU and LFU eviction, which one would you pick for a "trending posts" cache — and why?

If you can explain these out loud to someone else, you've actually learned the chapter — not just copy-run the code.

---

## 🗺️ Roadmap

- [x] Core Redis data structures (Ch. 1–10)
- [x] Advanced patterns — Lua, persistence, eviction (Ch. 11–15)
- [x] Production patterns — locking, rate limiting, sessions (Ch. 16–18)
- [x] BullMQ job queue system (Ch. 21)
- [ ] Redis Streams (event sourcing patterns)
- [ ] Redis Cluster / horizontal scaling walkthrough
- [ ] Full mini-project: real-time chat app using everything in this repo

---

## 🎯 Who This Is For

- Backend devs prepping for **system design interviews**
- Developers who want to actually understand **caching internals**, not just use `redis.set()`
- Anyone building a **production job-queue system** with BullMQ
- Students who learn best by running real code, not reading slides

---

## 🤝 Contributing

Found a bug or want to add a new caching pattern? PRs are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Open a PR

---

## ⭐ Support

If this repo helped you understand Redis or BullMQ better, drop a **star** — it helps others find it too.

## 📬 Connect

Questions, feedback, or just want to talk backend architecture? Reach out:

- GitHub: [@AKASHPA](https://github.com/AKASHPA)
- LinkedIn: _add your link here_
- Portfolio: _add your link here_

<div align="center">

**Built by Akash** —

</div>
