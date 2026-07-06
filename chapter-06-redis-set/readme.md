# Redis set = store only unique entry/data etc

Implement ye 5 APIs:

POST /posts/:postId/like
GET /posts/:postId/likes
GET /posts/:postId/likes/count
GET /posts/:postId/is-liked/:userId
DELETE /posts/:postId/like

# Vital commands

🧠 Engineering Knowledge

Notice karo.

Abhi tak humne Redis Set se 4 alag problems solve kar di.

Problem Command
Like karna SADD
Sab likes dekhna SMEMBERS
Total likes SCARD
User ne like kiya? SISMEMBER

Ye sab O(1) ya near O(1) operations hain, isliye Redis itna fast hai.
