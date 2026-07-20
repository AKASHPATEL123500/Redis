## Concurrency

#### Is chapter me hum seekhenge

- Concurrency kya hoti hai?
- Worker me concurrency option kaise use hota hai?
- 1 vs 5 vs 10 concurrency ka difference.
- Kab concurrency badhani chahiye.
- Kab nahi badhani chahiye (ye bahut important hai, kyunki har workload me zyada concurrency acchi nahi hoti).

#### Problem Statement

- Abhi tumhara worker
- job1 --> Done
- job2 --> Done
- job3 --> Done
- isko bolte hai Sequential Processing
- Ek Time per rk hi job karta hai
- Question:
- Ager 1000 email queue mein aa jaye
- to ek ek kar ke bahaut slow
- bahaut slow kaam karega

#### Solution

###### BullMQ:

- Bolta hai ki ek worker
- ek time per
- keval 5 job hi process karega

###### Ya:

- ek time per 10 job
- ek sath process karega

###### Ya:

- ek time per 20 job
- ek sath process karega

###### Ya:

- ek time per 50 job
- ek sath process karega

##### Now:

`Isko hi bolte hai Concurrency`

#### Visual Exaplation

###### Without Concurrency:

- job 1
- job 2
- job 3
- job 4

###### With Concurrency:

job1 job2 job3 job4

- ye sare job same time per process honge
- ye hai Concurrency

#### BullMQ ka Solution

BullMQ bolta hai.
"Ek hi worker.
Ek hi time me.
Multiple jobs process kar sakta hai."

Isi ko bolte hain.
Concurrency
