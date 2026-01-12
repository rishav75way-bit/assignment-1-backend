import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDb } from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import fileRoutes from "./modules/files/file.routes";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();
connectDb();

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
