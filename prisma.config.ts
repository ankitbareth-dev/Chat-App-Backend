import { defineConfig } from "prisma/config";
import ENV from "./utils/envVariable";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: ENV.DATABASE_URL,
  },
});
