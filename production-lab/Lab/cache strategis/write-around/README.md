# write around

post --> mongodb save ---> response

no save in redis

and next time

_USE CASE:_

Agr Data bahut kam read hota hai aur write jeyda hota hai to
to har write per redis bharne ka koi fyeda nahi hai

_EXAMPLE:_

1. Aduit logs
2. Event logs
3. Sensor Data

har seond lakho write aa rahi hai to iss case mein redis bharna koi sens nahi hai

_Isliye_

1. write ---> sirf DB
2. pheli read ---> DB ---> then save in redis
3. Baki reads ---> redis
