import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes";
import { PORT } from "./config/env";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://mcityxai.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/chat", chatRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
