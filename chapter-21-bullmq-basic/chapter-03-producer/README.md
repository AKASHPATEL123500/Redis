# Producer

1. Producer hota kya hai?

- producer wahi hota hai jo queue mein job dalta hai

2. Example:
   User ---> Signup ----> Express ( Producer) ----> Queue.add() ---> response

- Yaha Producer ( Express ) hi hai
- Express ka kaam hai
- Queue mein job ko add karna

# Prodcuer

```ts
import { queue } from "./queue.ts";

async function jobAddInQueue() {
  await queue.add("send-wellcome-mail", {
    name: "Akash Patel",
    email: "Akash@patel.in",
    age: "20",
  });

  console.log("Job added successfully in queue");
}

jobAddInQueue();
```

1. `Queue.add()`
   `emailQueue.add(...)`

Ye sabse important function hai.
Question.
Ye karta kya hai?
Ye Redis ke andar ek Job store karta hai.
Bas.

1. "send-welcome-email"

- Ye Queue ka naam nahi hai.
- Yaha _Job name hai_

# Aaj ka Goal

Sirf ye samajhna tha:

- Queue.add() = Job ko Redis Queue me daalna.
- Queue job ko execute nahi karti.
- Job Name aur Queue Name alag cheezein hain.
- Job ka data object hota hai jo baad me Worker ko milega.
