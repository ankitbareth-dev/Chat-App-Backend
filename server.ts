import app from "./app";
import env from "./utils/envVariable";
import { createServer } from "http";
import { initializeSocket } from "./socket/index";

const PORT = env.PORT;

const httpServer = createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
