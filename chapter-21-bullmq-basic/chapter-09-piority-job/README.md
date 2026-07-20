# Piority Job

# Problem statement

#### Normal Queue FIFO use karta hai

- Mtlb: FIFO = First in First Out
- Example : Queue [ a,b,c,d,e]
- Mtlb: jo pahle aya hai wo pahle bhahar jayega

### Lekin Real World me?

Supose:
User1: Password Reset
User2: Weeklynewletter

Example:
Queue

- Weeklynewletter
- Weeklynewletter
- Weeklynewletter
- Weeklynewletter
- Password Reset
- Weeklynewletter

### Abb Iss queue mein khuch Jobs hai

- Jise ki Agr hum queue FIFO ko dekhe
- To NewSlttwr pahle compwelet hoga
- Aur user ne password reset kiay hai
- waha OTP ka wait kar raha hai
- Ab jab tak complete nahi hoga tak agge nahi badhega
- mtlb User ko OTp je liye wait karna hoga

### Isi Problem ko BullMQ solve krata hai with `Job` `piorty`

- Jobs piroty
- Bullmq bolta hai ki
- Job ko ek piority de do
- Jiski Piority jyeda hoga
- Usko pahle process karunga

`Basss!`

### BullMQ mein

Smaller number = Higher Priority

- Priority = 1 ⭐⭐⭐⭐⭐
- Priority = 2 ⭐⭐⭐⭐
- Priority = 3 ⭐⭐⭐
- Priority = 4 ⭐⭐
- Priority = 5 ⭐
- Priority = 6

Mtlb: - Priority = 1 ⭐⭐⭐⭐⭐

- High Priority
- Yaha Job sabse pahle excute hogi
