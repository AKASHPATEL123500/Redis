# `sorted set` ( ZSET ) = unique + score

# set = unique data ko hi stroe karta tha bass

# LEADERBOARD

rank name score

1. Rohit 2500
2. Rahul 1200
3. Akash 850
4. Aman 600

Sorted set features:

1. Unique data
2. Score based sorting
3. always store data in sorted order
4. yaha ek user ke score ko update karne par uska rank bhi update ho jata hai automatically

| Command     | Use                  |
| ----------- | -------------------- |
| `ZADD`      | Score add/update     |
| `ZRANGE`    | Lowest → Highest     |
| `ZREVRANGE` | Highest → Lowest     |
| `ZSCORE`    | Kisi player ka score |
| `ZRANK`     | Rank (ascending)     |
| `ZREVRANK`  | Rank (descending)    |
| `ZREM`      | Remove player        |

| Command        | Use Case          |
| -------------- | ----------------- |
| ✅ `ZADD`      | Player add/update |
| ✅ `ZRANGE`    | Lowest → Highest  |
| ✅ `ZREVRANGE` | Highest → Lowest  |
| ✅ `ZREVRANK`  | Player ki rank    |
| ✅ `ZSCORE`    | Player ka score   |
| ✅ `ZREM`      | Player remove     |
