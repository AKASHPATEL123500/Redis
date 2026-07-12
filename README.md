   <div align="center">

# ⚡ Redis & BullMQ Mastery Series
### Zero to Production — Backend Engineering Lab

*Real-world Redis architecture, queue systems, and caching strategies used in high-scale production systems.*

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-FF4500?style=for-the-badge&logo=redis&logoColor=white)

![Stars](https://img.shields.io/github/stars/AKASHPA/redis?style=social)
![Forks](https://img.shields.io/github/forks/AKASHPA/redis?style=social)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

</div>

---

## 📌 Why This Repo Exists

Most Redis tutorials stop at `SET` and `GET`. This one doesn't.

This is a **hands-on lab**, not a theory dump — every chapter is a working folder with runnable code covering the exact patterns used in production systems: caching layers, distributed locks, rate limiters, session stores, real-time leaderboards, and a full **BullMQ job-queue system** built from scratch.

If you're prepping for backend/system-design interviews, or building something that needs to survive real traffic — this is built for you.

---

## 🗂️ What's Inside

| # | Chapter | What You'll Build |
|---|---------|-------------------|
| 01 | Redis Basics | Docker setup + first connection |
| 02 | Strings | GET/SET fundamentals |
| 03 | TTL & Expiry | Auto-expiring keys |
| 04 | Lists | Queue & stack operations |
| 05 | Hashes | User profile object caching |
| 06 | Sets | Unique element storage |
| 07 | Sorted Sets | Ranking systems (ZSET) |
| 08 | Pub/Sub | Real-time messaging |
| 09 | Transactions | Atomicity with MULTI/EXEC/WATCH |
| 10 | Pipelines | Batching for performance |
| 11 | Lua Scripts | Atomic server-side logic |
| 12 | Persistence | RDB snapshots + AOF logs |
| 13 | Memory Management | Lazy vs active deletion |
| 14 | Eviction Policies | LRU, LFU, TTL-based recovery |
| 15 | Caching Strategies | Design patterns overview |
| 16 | Distributed Locking | SETNX-based concurrency control |
| 17 | Rate Limiting | Traffic throttling |
| 18 | Session Store | Scalable auth sessions |
| 19 | Leaderboards | High-speed gaming/score boards |
| 20 | Real-Time Analytics | Live tracking & metrics |
| 21 | BullMQ | Producers, workers, job lifecycle |

**Bonus — Production Cache Lab:** Cache-Aside, Read-Through, Write-Through, Write-Around, Write-Behind, and Refresh-Ahead — all implemented side-by-side so you can compare tradeoffs directly.

---

## 📁 Full Directory Structure

```
redis/
├── 01-redis/
├── 02-redis-string/
├── chapter-03-expire-ttl/
├── redis-list/
├── user-profile-cache/
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

| Layer | Tool |
|-------|------|
| Runtime | Node.js / Bun |
| Language | TypeScript |
| Framework | Express.js |
| Cache/Broker | Redis 7 (Alpine) |
| Queue Engine | BullMQ |
| Client Library | ioredis |
| Container | Docker |

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

**3. Spin up Redis with persistence enabled**
```bash
docker run -d --name redis-master -p 6379:6379 \
  -v redis_data:/data redis:7-alpine \
  redis-server --appendonly yes --save 60 1
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

<div align="center">

**Built by [Akash](https://github.com/AKASHPA)** — MERN Stack Developer

</div>
