# RemoveOnComplete & RemoveOnFail

#### BullMQ:

###### When job complete:

- Bullmq Bolta hai jab job complete
- ho jaye tab usko remove kar do automatically

###### When job fail:

- Bullmq Bolta hai jab job fail
- ho jaye tab usko remove kar do automatically

```ts
{
    attempts:5,

    backoff:{
        type:"exponential",
        delay:2000
    },

    removeOnComplete:100,

    removeOnFail:500
}
```

```ts
removeOnComplete
↓
Completed Job ko automatically remove karo.
removeOnFail
↓
Failed Job ko automatically remove karo.
true
↓
Sab remove.
100
↓
Last 100 rakho.

```
