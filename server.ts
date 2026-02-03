import app from "./app";
import env from "./utils/envVariable";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
