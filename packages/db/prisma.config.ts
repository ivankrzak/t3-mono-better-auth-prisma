import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
    seed: "pnpm db:seed",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
