# Refresh Ahead Cache

Cache expuire hone se pahle usko background mein fresh data se
update kar dena kar

# Problem

Maan lo TTL = 60 sec

```ts
Redis
User:1
TTL = 60 sec
```

50 sec sab mat chal raha tha abb
Lekin 60 sec hote hi key expired

# Abb next request

User --- > Redis ----> Miss ---> DB ----> Redis ----> Response

ye slow ho gaya

# To refresh ahead kya karta hai

yaha expire katam hone ka wait nahi karta hai

_maan lo TTL = 60 sec_

Jab
_TTL = 10 sec_
bachta hai

Background mein hi:

Mongodb ---> latest Data ---> redis save ( redis update ) ---> ttl reset = 60sec

Abb yaha kabhi expire nahi hoga aur user ko hamesa updated data milega
yanhi hamesa Cache Hit! meilega
