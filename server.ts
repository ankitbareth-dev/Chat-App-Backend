import app from "./app";
import ENV from "./utils/envVariable";

const PORT = ENV.port;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
