import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const turso = createClient({
  url: databaseUrl ?? "file:local.db",
  authToken,
});

export const db = drizzle(turso, { schema });
