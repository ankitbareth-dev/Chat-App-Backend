import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.send({
    status: "Server is running",
    message: "Ready to handle requests",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
