import express from "express";
import "dotenv/config";
import { route } from "./routes/route.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello from server</h1>");
});

app.use("/api/v1", route);

export { app };
