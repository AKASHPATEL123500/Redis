# Lock kya hota hai

Distributed locking system ka mtlb hai ki multiple server me ek hi
resource ko ek time par sirf ek server access kar sakta hai

_REAL LIFE EX:_

ek room mein ek hi key hai.
user A romm mein jata hai and lock kar deta hai

ABb user B uss romm meon jata hai and ekhta hai lock laga hai
mtlb user B no entry

### mtlb

userA ---> lock ----> read ----> update ----> unlock

tab tak userB ko wait karna padega

# Kya sikhenge

1. SET NX EX kya hota hai :
   SET lock:user:10 locked NX EX 10 ( NX = only is Not exists) agr kry pahle se hai to set mat karo
2. Lock acquire kise karta hai

```ts
const await redis.set(
    "lock:user:10",
    "random-token",
    "NX",
    "EX",
    10
)

_RETRUN_ kya karega

`case1 lock mill gaya to`
result : ok,
mtlb: Lock Aquire

`case2 lock already hai `
result : null
mtlb: some already own the lock

*iisliye hum karte hai *

if(result === null){
    retrun res.status(409).json(
        {
            message:"Resource is locked"
        }
    )
}

console.log("Lock mill gaya")


Bas itna hi aquire hai


## lock
lock ki value kabhi "locked" mat rakho.
Hamesha quniue ( UUID ) rakho
taki sirf lock ko asli owner hi usko relseae kar sake



```

3. Lock release safly kise karte hai

```ts
## lock
lock ki value kabhi "locked" mat rakho.
Hamesha quniue ( UUID ) rakho
taki sirf lock ko asli owner hi usko relseae kar sake

import { randomUUID} from "crypto"
const token =  randomUUID()

Aur

const await redis.set(
    "lock:user:10",
    token,
    "NX",
    "EX",
    10
)

```

4. random token kyu use hota hai

```ts
## lock
lock ki value kabhi "locked" mat rakho.
Hamesha quniue ( UUID ) rakho
taki sirf lock ko asli owner hi usko relseae kar sake

import { randomUUID} from "crypto"
const token =  randomUUID()

Aur

const await redis.set(
    "lock:user:10",
    token,
    "NX",
    "EX",
    10
)

```

5. Redlock algorithm kya hai
6. Node js + ioredis practical implement
7. Real Example:
   Payment
   Seat booking
   inventory
   Cupon claim
   Wallet blance
