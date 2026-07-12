# Aaj sirf ye samajhna tha:

1. BullMQ kya hai?
2. Redis aur BullMQ ka relation kya hai?
3. Project structure kaisa hoga?
4. Kya install karna hai?

5. BullMQ kya hai?

- BullMQ khud queue nahi hai.
- BullMQ sirf ek Node.js Library hai.
- Asli Qeueue redis ke ander banta hai
- BullMQ redis se baat karta hai,
- Redis Queue maintain karta hai,

2. Redis aur BullMQ ka relation kya hai?

- BullMQ ek library hai jo redis se baat karta hai
- Redis ek in memory db cache hai
- Redis queue provide karata hai

4. Kya install karna hai?

- With NPM
- `npm i -y`
- `npm i bullmq ioredis`

- With BUN
- `bun install`
- `bun add bullmq ioredis`

# Sirf samjhenge ki `Queue` object hota kya hai.

1. Step 1 — BullMQ ke 3 Main Objects
   BullMQ me bahut classes hain.
   Lekin 90% projects me tum ye 3 use karoge.

1. Queue
1. Worker
1. QueueEvents
   Aaj sirf Queue.

# Queue

Imagine

- Ek app hai jaha user signup karta hai,
- Abb tumhe email greet message send karna hai
- `Question`
- Kya queue email send karegin nahi
- `Queue` keval jobs ko store karta hai
- Send karne ka kaam `woker` ka hota hai

# Sabse pehle Queue banate hain.

```ts
import { Queue } from "bullmq";

const queue = new Queue("email-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

export { queue };
```

1. Line 1

```ts
import { Queue } from "bullmq";
```

BullMq se hum queue class import kar rahe hai

2. Line 2

```ts
new Queue()

- ye redis mein queue create karega
- Question queue kaa naam kya hai
- To queue ka naam "email-queue" hai
- And woker issi naam ko sunege listen karegnge
```

3. Line 3

```ts
connection{
    host:"",
    port:"",
}

- Ye redis se connection banayega
- redis se baat karne ke liye isk use hota hai
- hume two chizen chiye hoti hai
- 1. HOST = "localhost"
- 2. PORT = redis port ( 6379 )
```
