# 📘 Chapter 08 — Redis Pub/Sub

Is chapter me hum seekhenge ki Redis me ek message ko kaise real-time me broadcast kiya jata hai.

Pub/Sub ka matlab hota hai:

- Publisher → jo message bhejta hai
- Subscriber → jo message sunta hai
- Channel → woh route ya topic jahan message bheja jata hai

Agar simple language me samjhein, to jaise ek radio station hota hai:

- station ek channel hai
- broadcaster message bhejta hai
- jo log station sun rahe hain, sabko same message milta hai

---

## 🎯 Is chapter ka target

Aap ye samajh jaoge:

- Pub/Sub kya hota hai
- Publisher aur Subscriber ka kaam kya hota hai
- Normal subscriber aur pattern subscriber me difference kya hota hai
- Redis me channel ko kaise subscribe aur publish karte hain
- Pub/Sub aur Queue me difference

---

## 🧠 Pub/Sub ka simple concept

Redis Pub/Sub me ek message ek channel par publish hota hai aur us channel ko subscribe karne wale sab log us message ko receive karte hain.

### Flow

1. Subscriber channel ko subscribe karta hai
2. Publisher us channel par message bhejta hai
3. Redis us message ko sab subscribers tak pahunchata hai

### Example

```text
Publisher -> Channel -> Subscriber 1
                     -> Subscriber 2
                     -> Subscriber 3
```

Yeh real-time broadcasting ki tarah kaam karta hai.

---

## 🔔 Real-life example

Socho aap ek live notification system bana rahe ho.

Jab koi naye user register karta hai, to aap usko sabko notify karna chahte ho.

Example:

- User register hua
- Publisher ne message bheja: "New user registered"
- Sab subscribers ne woh message receive kiya

Isse aap real-time alerts bana sakte ho.

---

## 🧩 Important terms

### 1. Publisher

Publisher wo component hota hai jo message bhejta hai.

```ts
await publisher.publish("user-event", JSON.stringify({ name: "Aman" }));
```

### 2. Subscriber

Subscriber wo component hota hai jo channel ko listen karta hai.

```ts
await subscriber.subscribe("user-event");
```

### 3. Channel

Channel ek named topic hota hai jahan message bheje jaate hain.

Example:

- user-event
- payment-event
- notification-event

---

## 🔁 Normal Subscriber vs Pattern Subscriber

Yeh dono important hai. In dono me difference samajhna zaroori hai.

### 1) Normal Subscriber

Ye sirf ek exact channel ko listen karta hai.

Example:

```ts
await subscriber.subscribe("user-event");
```

Agar aap "user-event" channel par message bhejoge, to yeh receive karega.

### 2) Pattern Subscriber

Ye pattern ke basis par multiple channels ko listen kar sakta hai.

Example:

```ts
await subscriber.psubscribe("user-*");
```

Iska matlab hai:

- user-created
- user-updated
- user-deleted

Sabhi channels match honge aur subscriber un sabko receive karega.

### Quick difference

| Type               | Use              | Example                 |
| ------------------ | ---------------- | ----------------------- |
| Normal Subscriber  | Exact channel    | subscribe("user-event") |
| Pattern Subscriber | Matching pattern | psubscribe("user-\*")   |

---

## 🗂️ Project structure

Is chapter me aapko ye files milengi:

```text
src/
  redis.ts
  pub/
    publisher.ts
  sub/
    subscriber.ts
    subscriberA.ts
    subscriberB.ts
    subscriberC.ts
  unsubscribe/
    unsubscribe.ts
  pub-sub-stats-or-count/
    pubsub.ts
```

---

## ⚙️ Setup karna

### 1. Redis start karo

Agar aap Docker use kar rahe ho:

```bash
docker compose up -d redis
```

### 2. Check karo ki Redis chal raha hai

```bash
redis-cli ping
```

Agar output aata hai:

```bash
PONG
```

To matlab Redis kaam kar raha hai. ✅

### 3. Dependencies install karo

```bash
npm install
```

---

## ▶️ Run karne ke commands

### A. Subscriber ko chalu karo

Aap ek terminal me subscriber run karo:

```bash
node src/sub/subscriber.ts
```

Yeh channel ko listen karta rahega.

### B. Publisher se message bhejo

Dusre terminal me publisher run karo:

```bash
node src/pub/publisher.ts
```

Ya phir aap Redis CLI se bhi test kar sakte ho.

---

## 🧪 Redis CLI se direct test

### Subscribe karo

```bash
redis-cli
SUBSCRIBE user-event
```

### Dusre terminal me publish karo

```bash
PUBLISH user-event '{"name":"Aman","status":"active"}'
```

Output subscriber terminal me dikhega.

---

## 📚 Redis Pub/Sub commands cheat sheet

### 1) PUBLISH

**Syntax**

```bash
PUBLISH <channel> <message>
```

**Kya lete hain?**

- channel ka naam
- message ka string content

**Kya return karte hain?**

- kitne subscribers ne us message ko receive kiya, woh integer me return hota hai

**Example**

```bash
PUBLISH user-event '{"event":"login","user":"Aman"}'
```

**Return example**

```text
(integer) 2
```

Yeh means 2 subscribers ne message receive kiya.

---

### 2) SUBSCRIBE

**Syntax**

```bash
SUBSCRIBE <channel> [channel ...]
```

**Kya lete hain?**

- ek ya ek se zyada channel names

**Kya return karte hain?**

- subscription confirmation messages

**Example**

```bash
SUBSCRIBE user-event notification-event
```

**Return example**

```text
1) "subscribe"
2) "user-event"
3) (integer) 1
```

Yeh matlab aap user-event channel par subscribe ho gaye.

---

### 3) PSUBSCRIBE

**Syntax**

```bash
PSUBSCRIBE <pattern> [pattern ...]
```

**Kya lete hain?**

- ek ya zyada pattern jaise `user-*`

**Kya return karte hain?**

- pattern subscription confirmation

**Example**

```bash
PSUBSCRIBE "user-*"
```

**Return example**

```text
1) "psubscribe"
2) "user-*"
3) (integer) 1
```

Yeh matlab aap user-\* pattern ke saare channels ko listen karenge.

---

### 4) UNSUBSCRIBE

**Syntax**

```bash
UNSUBSCRIBE [channel [channel ...]]
```

**Kya lete hain?**

- optional channel names
- agar koi channel diya na jaye, to sab channels se unsubscribe ho jaoge

**Kya return karte hain?**

- unsubscribe confirmation

**Example**

```bash
UNSUBSCRIBE user-event
```

**Return example**

```text
1) "unsubscribe"
2) "user-event"
3) (integer) 0
```

Yeh matlab aap user-event se unsubscribe ho gaye.

**Sabhi channels se unsubscribe karne ke liye**

```bash
UNSUBSCRIBE
```

---

### 5) PUNSUBSCRIBE

**Syntax**

```bash
PUNSUBSCRIBE [pattern [pattern ...]]
```

**Kya lete hain?**

- optional pattern names
- agar koi pattern diya na jaye, to sab pattern subscriptions se unsubscribe ho jaoge

**Example**

```bash
PUNSUBSCRIBE "user-*"
```

---

### 6) PUBSUB commands

#### a) Active channels dikhane ke liye

```bash
PUBSUB CHANNELS
```

#### b) Kisi channel ke subscribers count ke liye

```bash
PUBSUB NUMSUB user-event
```

**Example return**

```text
1) "user-event"
2) (integer) 2
```

Yeh matlab user-event par 2 subscribers active hain.

---

## 🎯 Pattern subscriber example

### Pattern subscribe karo

```bash
redis-cli
PSUBSCRIBE "user-*"
```

### Ab publish karo

```bash
PUBLISH user-created '{"event":"created"}'
PUBLISH user-updated '{"event":"updated"}'
```

Pattern subscriber in sab ko receive karega.

---

## 🔓 Unsubscribe karna — simple explanation

### 1. Normal channel se unsubscribe

**CLI me**

```bash
UNSUBSCRIBE user-event
```

**Node.js me**

```ts
await subscriber.unsubscribe("user-event");
```

### 2. Pattern se unsubscribe

**CLI me**

```bash
PUNSUBSCRIBE "user-*"
```

**Node.js me**

```ts
await subscriber.punsubscribe("user-*");
```

### 3. Sabhi subscriptions se unsubscribe

**CLI me**

```bash
UNSUBSCRIBE
PUNSUBSCRIBE
```

**Node.js me**

```ts
await subscriber.unsubscribe();
await subscriber.punsubscribe();
```

> Important baat: unsubscribe karne ke baad aapka subscriber us channel ya pattern ko sunna band kar dega.

---

## 📊 Pub/Sub vs Queue

Ye difference samajhna bahut important hai.

| Feature                               | Pub/Sub             | Queue                         |
| ------------------------------------- | ------------------- | ----------------------------- |
| Message kis ko milta hai?             | Sab subscribers ko  | Sirf ek worker ya consumer ko |
| Message stored hota hai?              | Nahi                | Haan                          |
| Offline subscriber ko message milega? | Nahi                | Haan, pending me rahega       |
| Best use case                         | Real-time broadcast | Background jobs               |

### Simple example

- Pub/Sub → live notification, chat, stock updates
- Queue → email send, OTP send, payment processing

> Important baat: Pub/Sub me message store nahi hota. Agar subscriber offline tha to woh message miss kar sakta hai.

---

## 📌 Is chapter me kya seekhenge

- `PUBLISH` ka use
- `SUBSCRIBE` ka use
- `PSUBSCRIBE` ka use
- Publisher setup
- Subscriber setup
- Real-time event flow
- Pub/Sub ki limitations
- Queue se difference

---

## 📝 Quick revision notes

### 1. One line summary

Pub/Sub me publisher message bhejta hai aur sab subscribers ko real-time me deliver hota hai.

### 2. Real-world analogy

Jaise radio station par ek hi news sab sunte hain, waise hi Redis Pub/Sub me ek hi message sab subscribers ko milta hai.

### 3. Important memory trick

- Publish = send
- Subscribe = listen
- Channel = topic/path
- Pattern subscribe = multiple topics listen karna

### 4. Interview style questions

- Pub/Sub aur Queue me difference kya hai?
- Normal subscriber aur pattern subscriber me kya farq hai?
- Agar subscriber offline ho to kya message milega?
- Pub/Sub me message store hota hai ya nahi?

### 5. Fast recap

- Ek message ek channel par jata hai
- Sab subscribed clients usko receive karte hain
- Ye real-time events ke liye best hai
- Reliable background jobs ke liye queue better hota hai

---

## 🧠 Code files ka simple explanation

### [src/redis.ts](src/redis.ts)

Yahan Redis connection banaya gaya hai.

### [src/pub/publisher.ts](src/pub/publisher.ts)

Yahan publisher functions hain jo channel par message bhejti hain.

### [src/sub/subscriber.ts](src/sub/subscriber.ts)

Yeh normal subscriber example hai.

### [src/sub/subscriberA.ts](src/sub/subscriberA.ts), [src/sub/subscriberB.ts](src/sub/subscriberB.ts), [src/sub/subscriberC.ts](src/sub/subscriberC.ts)

Ye alag-alag subscribers ke examples hain.

### [src/unsubscribe/unsubscribe.ts](src/unsubscribe/unsubscribe.ts)

Yahan unsubscribe aur punsubscribe ka demo hai.

### [src/pub-sub-stats-or-count/pubsub.ts](src/pub-sub-stats-or-count/pubsub.ts)

Yeh active channels aur subscribers count check karne ke liye example hai.

---

## ✅ Quick summary

Pub/Sub ka simple idea yeh hai:

- publisher message bhejta hai
- subscriber usko sunta hai
- channel message ka path hota hai

Agar aap real-time updates chahte ho, to Pub/Sub perfect hai.

Agar aap reliable background processing chahte ho, to Queue better hai.

---

## 🚀 Next step

Aap is chapter ko samajh ke next chapter me BullMQ aur queues ka comparison aur implementation dekhoge.

Agar chaho to main next step me is README ko aur bhi zyada visual aur student-friendly style me convert kar sakta hoon.
