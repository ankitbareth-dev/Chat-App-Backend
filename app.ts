import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";

import env from "./utils/envVariable";
import { globalErrorHandler } from "./utils/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.send({
    status: "Server is running",
    message: "Ready to handle requests",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user/update-profile", userRouter);
app.use("/api/chats", chatRoutes);

app.use(globalErrorHandler);

export default app;
