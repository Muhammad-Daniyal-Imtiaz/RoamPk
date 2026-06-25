import { config } from "dotenv";
config({ path: ".env.local" });
import { defineConfig } from "drizzle-kit";

const isTurso = Boolean(process.env.TURSO_DATABASE_URL);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: isTurso ? "turso" : "sqlite",
  dbCredentials: isTurso
    ? { url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN }
    : { url: "local.db" },
  strict: true,
  verbose: true,
});
