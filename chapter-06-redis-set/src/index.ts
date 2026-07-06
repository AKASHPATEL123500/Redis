import express from "express";
import type { Request, Response } from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 14000;
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function postLikeKey(postId: string) {
  return `post:${postId}:likes`;
}

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "server is ready",
  });
});

app.get("/redis", async (req: Request, res: Response) => {
  const replay = await redis.ping();
  return res.status(200).json({
    success: true,
    source: "redis",
    redis: replay,
  });
});

// Like a post
app.post("/posts/:postId/like", async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { postId } = req.params;

  if (!userId || !postId) {
    return res.status(400).json({
      success: false,
      message: "userId and postId are required",
    });
  }

  const resutl = await redis.sadd(postLikeKey(postId), userId);
  return res.status(200).json({
    success: true,
    message: `User ${userId} liked post ${postId}`,
    result: resutl,
  });
});

// Get all users who liked a post
app.get("/posts/:postId/likes", async (req: Request, res: Response) => {
  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({
      success: false,
      message: "postId is required",
    });
  }

  const likedUsers = await redis.smembers(postLikeKey(postId));
  return res.status(200).json({
    success: true,
    message: `Liked users for post ${postId}`,
    result: likedUsers,
    totalLikes: likedUsers.length,
  });
});

// Get the total number of likes for a post
app.get("/posts/:postId/likes/count", async (req: Request, res: Response) => {
  const { postId } = req.params;
  const totalLikes = await redis.scard(postLikeKey(postId));

  return res.status(200).json({
    success: true,
    message: `Total likes for post ${postId}`,
    totalLikes,
  });
});

// check if a user has liked a post or not
app.get("/posts/:postId/likes/check", async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.query;

  const checkIsUserAlreadyExistsOrNot = await redis.sismember(
    postLikeKey(postId),
    userId,
  );
  return res.status(200).json({
    success: true,
    message: `Check if user ${userId} has liked post ${postId}`,
    isLiked: Boolean(checkIsUserAlreadyExistsOrNot),
  });
});

// like and unlike a post mean reomve the like if already liked and add the like if not liked
app.post("/posts/:postId/like-remove", async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { postId } = req.params;

  const result = await redis.srem(postLikeKey(postId), userId);

  if (result === 1) {
    return res.status(200).json({
      success: true,
      message: `User ${userId} unliked post ${postId}`,
    });
  }

  if (result === 0) {
    return res.status(200).json({
      success: true,
      message: `User had no like this post`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// vital notes

/* 
Sets redis mein store hote hain aur ye unique values ko store karte hain.
Agar aap same value ko dobara add karne ki koshish karte hain to wo ignore ho jata hai.

difference between list and set in redis:
1. List: 
   - Ordered collection of elements.
   - Allows duplicate values.
   - Elements can be added to the head or tail of the list.
   - Example commands: LPUSH, RPUSH, LPOP, RPOP, LRANGE.
   - Used for scenarios where order matters, like queues or stacks.
   - use case: storing recent activities, message queues, etc.
2. Set:
   - Unordered collection of unique elements.
   - Does not allow duplicate values.
   - Elements can be added or removed from the set.
   - Example commands: SADD, SREM, SMEMBERS, SCARD.
   - Used for scenarios where uniqueness is important, like tracking unique users who liked a post.
*/
