import app from "./app";
import env from "./utils/envVariable";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket";

const PORT = env.PORT;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

initializeSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
