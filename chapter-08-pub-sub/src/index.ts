import express from "express";
import { publishLoginEvent } from "./pub/publisher.ts";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.post("/login", async (req, res) => {
  const { id, username, event } = req.body;

  const payload = {
    event: event || "USER-LOGIN",
    id: id,
    username: username,
    creadetAt: new Date().toISOString(),
  };

  const string = JSON.stringify(payload);
  const result = await publishLoginEvent(string);

  return res.json({
    success: true,
    message: "Login successful",
    result: result,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
