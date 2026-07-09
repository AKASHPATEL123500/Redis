Lua = Redis ke andar chalne wala function jo multiple Redis commands ko ek hi atomic operation me execute karta hai.

# Lua syntax:

redis.eval( script, numberOfKeys, key1, key2, ... arg1, arg2 )

Ab Chapter 11 ka **Part 2** start karte hain.

---

# Part 2 — `KEYS` aur `ARGV`

Abhi tak humne hardcoded values likhi thi.

```lua
redis.call("SET","name","Akash")
```

Question...

Agar mujhe `"Akash"` ki jagah `"Rahul"` save karna ho?

Fir script change karoge?

❌ Nahi.

Jaise JavaScript function me parameters hote hain.

```ts
function createUser(name) {
  console.log(name);
}

createUser("Akash");
createUser("Rahul");
```

Waise hi Lua me bhi parameters hote hain.

Bas unke naam alag hain.

---

# Redis Lua me 2 types ke parameters hote hain

```
KEYS
ARGV
```

Ye dono bahut important hain.

---

# 1️⃣ KEYS

Isme sirf Redis Keys aati hain.

Example.

```
user:1

wallet:akash

otp:akash@gmail.com
```

Ye sab **keys** hain.

Lua me access:

```lua
KEYS[1]
```

Ya

```lua
KEYS[2]
```

---

# 2️⃣ ARGV

ARGV matlab.

Arguments.

Ye normal values hoti hain.

Example.

```
Akash

22

Admin

1000
```

Lua me.

```lua
ARGV[1]
```

```lua
ARGV[2]
```

---

# Visual

Suppose.

Node.js

```ts
await redis.eval(
  script,

  1,

  "user:1",

  "Akash",

  22,
);
```

Redis ke andar.

```
KEYS[1]

↓

"user:1"
```

Aur.

```
ARGV[1]

↓

"Akash"
```

```
ARGV[2]

↓

22
```

---

# Real Example

Node.js

```ts
const result = await redis.eval(
  `
redis.call("SET", KEYS[1], ARGV[1])

return redis.call("GET", KEYS[1])

`,

  1,

  "name",

  "Akash",
);
```

Question.

Redis ke andar.

```
KEYS[1]

=
?
```

Answer.

```
name
```

Aur.

```
ARGV[1]

=
?
```

Answer.

```
Akash
```

Script actually ban gayi.

```lua
redis.call("SET","name","Akash")

return redis.call("GET","name")
```

---

# Aur Example

```ts
await redis.eval(
  `

redis.call("SET",KEYS[1],ARGV[1])

return redis.call("GET",KEYS[1])

`,

  1,

  "city",

  "Lucknow",
);
```

Redis ke andar.

```
KEYS[1]

↓

city
```

```
ARGV[1]

↓

Lucknow
```

Result.

```
city = Lucknow
```

---

# 🤔 KEYS aur ARGV alag kyu banaye?

Ye bahut important hai.

Question.

Ye bhi to ho sakta tha.

```lua
ARGV[1]

↓

name

ARGV[2]

↓

Akash
```

Fir KEYS ki kya zarurat?

Reason.

Redis ko pehle se pata hona chahiye.

> Script kin keys ko touch karegi.

Ye baad me Cluster chapter me aur important hoga.

Isliye.

Keys.

Aur.

Arguments.

Alag rakhe gaye.

---

# Rule

```
Redis Key

↓

KEYS
```

```
Normal Value

↓

ARGV
```

Kabhi mix mat karna.

---

# Assignment

Ab sirf ye 3 scripts chalao.

## Script 1

```ts
await redis.eval(
  `
redis.call("SET",KEYS[1],ARGV[1])

return redis.call("GET",KEYS[1])

`,

  1,

  "framework",

  "Express",
);
```

Output?

```
Express
```

---

## Script 2

```ts
await redis.eval(
  `
redis.call("SET",KEYS[1],ARGV[1])

return redis.call("GET",KEYS[1])

`,

  1,

  "database",

  "Redis",
);
```

---

## Script 3

```ts
await redis.eval(
  `
redis.call("SET",KEYS[1],ARGV[1])

redis.call("INCR",KEYS[2])

return redis.call("GET",KEYS[2])

`,

  2,

  "username",

  "loginCount",

  "Akash",
);
```

Isme dhyan dena.

```
KEYS[1]

↓

username
```

```
KEYS[2]

↓

loginCount
```

```
ARGV[1]

↓

Akash
```

Output hoga.

```
1
```

Kyuki `loginCount` pehli baar create hoga aur `INCR` usko `1` bana dega.

---

# Lua me if

Syntax bahut simple hai.

```ts
if condition then

    -- code

end
```

Example.

```ts

local age = 20

if age >= 18 then
    return "Adult"
end

Bas

```

# Lua me Variable

avaScript

`js let balance = 1000; `

Lua

`local balance = 1000`

Yaha local ka matlab hai:

Ye variable sirf is Lua Script ke andar exist karega.

Redis me permanently save nahi hota.
