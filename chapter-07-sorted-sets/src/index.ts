import express, { json } from "express";
import Redis from "ioredis";
import type { Response, Request } from "express";

const app = express();
app.use(express.json());
const port = 3000;

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// leaderboard create using ZADD command
app.post("/leaderboard/score", async (req: Request, res: Response) => {
  const { player, score } = req.body;
  // ensure score is a number and pass score before member as required by ZADD
  const numericScore = Number(score);
  if (Number.isNaN(numericScore)) {
    return res.status(400).json({
      status: "error",
      success: false,
      message: "Score must be a valid number",
    });
  }

  const result = await redis.zadd("leaderboard", numericScore, player);

  if (result === 1) {
    return res.status(201).json({
      status: "success",
      success: true,
      message: "Player added successfully",
      result: result,
    });
  }

  if (result === 0) {
    return res.status(200).json({
      status: "success",
      success: true,
      message: "Player score updated successfully",
      result: result,
    });
  }
});

// get player in leaderboard lowest to highest using ZRANGE command
app.get(
  "/leaderboard/lowest-to-highest",
  async (req: Request, res: Response) => {
    const leaderboard = await redis.zrange("leaderboard", 0, -1, "WITHSCORES");
    return res.status(200).json({
      status: "success",
      success: true,
      result: leaderboard,
    });
  },
);

// get player in leaderboard highest to lowest using ZREVRANGE command
app.get(
  "/leaderboard/highest-to-lowest",
  async (req: Request, res: Response) => {
    const leaderboard = await redis.zrevrange(
      "leaderboard",
      0,
      -1,
      "WITHSCORES",
    );

    // const leaderboardWithNumericScores = leaderboard.map((value, index) =>
    //   index % 2 === 1 ? Number(value) : value,
    // );

    const formattedLeaderboard: {
      player: string;
      score: number;
    }[] = [];
    for (let i = 0; i < leaderboard.length; i += 2) {
      formattedLeaderboard.push({
        player: leaderboard[i],
        score: Number(leaderboard[i + 1]),
      });
    }

    return res.status(200).json({
      status: "success",
      success: true,
      result: formattedLeaderboard,
    });
  },
);

// get player rank in leaderboard using ZREVRANK command
app.get("/leaderboard/rank", async (req: Request, res: Response) => {
  const player: string = "Akash"; // Replace with the actual player name you want to check
  const rank = await redis.zrevrank("leaderboard", player);

  if (rank === null) {
    return res.status(404).json({
      status: "error",
      success: false,
      message: "Player not found in the leaderboard",
    });
  }

  return res.status(200).json({
    status: "success",
    success: true,
    result: {
      player: player,
      rank: rank + 1, // Ranks are zero-based in Redis, so we add 1 for user-friendly ranking
    },
  });
});

// get user current score in leaderboard using ZSCORE command
app.get("/leaderboard/score", async (req: Request, res: Response) => {
  const player: string = "Akash"; // Replace with the actual player name you want to check

  const score = await redis.zscore("leaderboard", player);
  const convertedScoreIntoNumber = score ? Number(score) : null;

  if (convertedScoreIntoNumber === null) {
    return res.status(404).json({
      status: "error",
      success: false,
      message: "Player not found in the leaderboard",
    });
  }

  return res.status(200).json({
    status: "success",
    success: true,
    result: {
      player: player,
      score: convertedScoreIntoNumber,
    },
  });
});

//get user by using ZRANK
app.get("/leaderbaord", async (req: Request, res: Response) => {
  const result = await redis.zrank("leaderboard", "Krish");

  return res.json(result);
});
// delete player in the leaderboard using ZREM command
app.delete("/leaderboard/delete", async (req: Request, res: Response) => {
  const player: string = "Aman";
  const result = await redis.zrem("leaderboard", player);

  if (result === 1) {
    return res.status(200).json({
      status: "success",
      success: true,
      message: "User deleted successfully",
      resutl: result,
    });
  }

  if (result === 0) {
    return res.status(404).json({
      status: "error",
      success: false,
      message: "User not found",
      resutl: result,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
