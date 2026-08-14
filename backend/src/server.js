import dotenv from "dotenv";
dotenv.config();

import dns from "node:dns";
import app from "./app.js";
import connectDB from "./config/db.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server is running on port ${PORT}`
  );
});