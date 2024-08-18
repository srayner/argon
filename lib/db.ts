import { PrismaClient } from "@prisma/client";

declare global {
  var primsa: PrismaClient | undefined;
}
export const db = globalThis.primsa || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.primsa = db;
