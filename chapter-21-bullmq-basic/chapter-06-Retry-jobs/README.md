# Is chapter ka final conclusion.

Tum ab confidently bol sakte ho.

Produce
↓
Queue

↓

Worker

↓

Job Fail

↓

BullMQ Retry

↓

Worker

↓

Job Fail

↓

BullMQ Retry

↓

Worker

↓

Job Fail

↓

Permanent Failed

Yehi Retry hai.

# Lekin...

Ek problem hai.
Abhi retry hua.
Kab hua?
😂
Immediately.

fail
retry
fail
retry
fail
retry

Milliseconds me.
Question.
Production me aisa karna chahiye?
Suppose Gmail ka SMTP server down hai.
Agar hum.
Agar hum.

Retry

Retry

Retry

0 millisecond me kar den.

Kya fayda?
Server to abhi bhi down hai.

# Isi problem ka solution.

Backoff Strategy
Ye BullMQ ka bahut powerful feature hai.

Flow

1. Attempt 1
   Fail
   wait 2sec
   then

2. Attempt 2
   Fail
   wait 2sec
   then

3. Attempt 3
   Fail

Failed
