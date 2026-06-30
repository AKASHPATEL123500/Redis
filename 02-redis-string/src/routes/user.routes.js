import { Router } from "express";
import redis from "../config/redis.js";

const route = Router();

route.post("/user", async (req, res) => {
  await redis.set("user:1", "Akash");

  res.json({
    success: true,
    message: "Data set successfully in redis",
  });
});

route.post("/user/v2", async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res
      .status(400)
      .json({ success: false, message: "id and name is required" });
  }

  const result = await redis.set(`user:${id}`, name);

  res.json({ success: true, result: result });
});

route.get("/user/v2/:id", async (req, res) => {
  const { id } = req.params || {};
  if (!id) {
    return res.status(400).json({ success: false, message: "id is req" });
  }

  const data = await redis.get(`user:${id}`);

  return res.status(200).json({
    success: true,
    message: " data factch succesfully from tha redis",
    data: data,
  });
});

route.get("/user", async (req, res) => {
  const data = await redis.get("user:1");

  res.json({
    success: true,
    data: data,
    message: "Data get successfully from the redis",
  });
});

route.delete("/user/:id", async (req, res) => {
  const exists = await redis.exists(`user:${req.params.id}`);
  const deleted = await redis.del(`user:${req.params.id}`);

  return res.status(200).json({
    success: true,
    message: "Data deleted successfully from the redis",
    deleted: deleted,
    exists: exists,
  });
});

// stringfy
route.post("/user/v3", async (req, res) => {
  const userData = {
    id: 1,
    name: "Akash",
    userName: "Akash_Reddy__01",
    email: "akash@ai.com",
  };

  const result = await redis.set("user:1", JSON.stringify(userData));

  return res.status(201).json({
    success: true,
    result: result,
    message: "Stringfy data set successfully in redis",
  });
});

// stringy data get
route.get("/user/v3", async (req, res) => {
  const data = await redis.get("user:1");

  if (!data) {
    return res.status(400).json({ message: "Data not found" });
  }
  console.log("Data: ", data);
  console.log(data.id);
  console.log(data.name);
  console.log(data.userName);
  console.log(data.email);

  const convertStringDataIntoObejct = JSON.parse(data);

  console.log(convertStringDataIntoObejct.id);
  console.log(convertStringDataIntoObejct.name);
  console.log(convertStringDataIntoObejct.userName);
  console.log(convertStringDataIntoObejct.email);

  return res.status(200).json({
    success: true,
    message: "Data get successfully from the redis",
    Data: convertStringDataIntoObejct,
  });
});
export default route;
