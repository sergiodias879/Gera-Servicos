import { defineConfig } from "drizzle-kit";

// Build connection string from environment variables
const host = process.env.DB_HOST || "sql308.infinityfree.com";
const port = process.env.DB_PORT || "3306";
const user = process.env.DB_USER || "ifo_40788079";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "ifo_40788079_db_servicos";

const connectionString = `mysql://${user}:${password}@${host}:${port}/${database}`;

if (!connectionString) {
  throw new Error("Database credentials are required to run drizzle commands");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
