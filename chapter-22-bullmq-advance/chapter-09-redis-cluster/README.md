Bhai, direct heavy-duty DevOps aur Scaling wale topic par jump kiya hai aapne—Chapter-27: Redis Cluster.
Jab aapki app itni badi ho jati hai ki crores (millions) of jobs roz queue mein aane lagti hain, tab ek single Redis server handle nahi kar pata. Memory full ho jati hai ya CPU hit ho jata hai. Wahan kaam aata hai Redis Cluster.
Chalo isko ekdum mast tareeqe se samajhte hain ki BullMQ ke sath Redis Cluster kaise set kiya jata hai.

---

## 💡 Redis Cluster Kya Hai? (Ek Dum Asan Bhasha Mein)

Maan lo aapke paas ek badi dukandari hai aur pehle aapka ek hi dukan (Single Redis Server) thi. Saara maal usi mein rehta tha. Lekin grahak (jobs) itne badh gaye ki ek dukan choti pad gayi.
Toh aapne kya kiya? Ek hi shahar mein 6 nayi dukane (Redis Nodes) khol di aur unhe aapas mein connect kar diya. Ab aap maal ko distribute karke alag-alag dukano mein rakhte ho. Isi network ko hum Redis Cluster kehte hain.

- Sharding (Tukde Karna): Redis Cluster data ko alag-alag nodes par baant deta hai.
- High Availability (Hamesha ON): Agar ek node down bhi ho jaye, to dusra master node uska kaam sambhal leta hai.

---

## 🚨 BullMQ Aur Redis Cluster Ka Sabse Bada Twist (Hash Tags {})

Bhai, BullMQ background mein bohot saare Redis Lua Scripts chalata hai. Redis Cluster ka ek sakht kanoon (rule) hai: "Ek Lua Script sirf usi data par chal sakti hai jo ek hi node par maujud ho."
Agar BullMQ ki ek queue ka aadha data Node-A par hai aur aadha Node-B par, to Redis Cluster error throw kar dega: CROSSSLOT Keys in request don't hash to the same slot.

## 💡 Iska Ilaj Kya Hai?

BullMQ is problem ko solve karne ke liye Hash Tags {} ka use karta hai. Queue ka naam hamesha curly braces ke andar hona chahiye.

- ❌ Galat tareeqa: const myQueue = new Queue('reporting-queue');
- ✅ Sahi tareeqa: const myQueue = new Queue('{reporting}-queue');

## Curly braces {} ke andar jo likha hota hai, Redis sirf usi part ko dekh kar decide karta hai ki data kis node par jayega. Isse pure queue ka saara data guaranteed ek hi Redis node par rehta hai, aur error nahi aata!

## 🛠️ Production Ready Code: Redis Cluster Setup

BullMQ mein connect karne ke liye hum ioredis ka Cluster class use karte hain.

```ts
import { Queue, Worker } from 'bullmq';import Redis from 'ioredis';
// 1. Apne saare Redis Cluster nodes ki list taiyar karoconst clusterNodes = [
  { host: '127.0.0.1', port: 7000 },
  { host: '127.0.0.1', port: 7001 },
  { host: '127.0.0.1', port: 7002 },
  { host: '127.0.0.1', port: 7003 },
  { host: '127.0.0.1', port: 7004 },
  { host: '127.0.0.1', port: 7005 },
];
// 2. Cluster connection instance banaoconst clusterConnection = new Redis.Cluster(clusterNodes, {
  redisOptions: {
    maxRetriesPerRequest: null, // 🔥 BullMQ ke liye ye line compulsory hai!
  },
});
// 3. Queue banao (🔑 DHYAN SE: Curly braces lagana mat bhoolna!)const clusterQueue = new Queue('{orderProcessing}-queue', {
  connection: clusterConnection
});
async function addJobToCluster() {
  await clusterQueue.add('processOrder', { orderId: 8878, item: 'iPhone 15' });
  console.log('🚀 Job safely cluster ke sahi node par insert ho gayi!');
}
// 4. Worker setup (Ye bhi cluster connection use karega)const clusterWorker = new Worker(
  '{orderProcessing}-queue',
  async (job) => {
    console.log(`📦 Cluster Worker processing order: ${job.data.orderId}`);
  },
  { connection: clusterConnection }
);

addJobToCluster();

```

---

## 🧠 Redis Cluster Ke 3 Sunhere Niyam (Golden Rules)

1.  Max Retries Per Request: Connection settings mein maxRetriesPerRequest: null lagana hi padega, nahi to BullMQ error dega aur initialization fail ho jayegi.
2.  Prefix / Queue Name: Hamesha queue ke naam mein prefix ya main identity ko {} mein wrap karo (jaise: {notification}-queue, {email}-queue).
3.  Scale Responsibly: Ek single queue ka data ek hi node par rahega {} ki wajah se, lekin agar aapke paas multiple queues hain (jaise ek email ki, ek sms ki), to alag-alag {} tags ki wajah se wo alag-alag nodes par distribute ho jayengi, jisse aapka load perfectly share ho jayega.
