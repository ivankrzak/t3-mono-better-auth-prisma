import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/client/client";

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL must be set to initialize Prisma.");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

export * from "./generated/client/client";

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
