import { app } from "./app";
import "dotenv/config";

const PORT = process.env.PORT || 12000;

app.listen(PORT, () => {
  console.log("server is runnin on 11000");
});
