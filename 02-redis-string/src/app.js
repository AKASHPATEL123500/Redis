import express from "express";
import route from "./routes/user.routes.js";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use("/api/v1", route);
export { app };
