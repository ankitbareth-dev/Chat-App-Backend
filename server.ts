import app from "./app";
import env from "./utils/envVariable";
import { createServer } from "http";
import { initializeSocket } from "./socket/index";
import prisma from "./utils/prisma";

const PORT = env.PORT;

const httpServer = createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});



const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  httpServer.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
