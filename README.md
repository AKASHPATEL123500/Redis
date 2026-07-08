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
