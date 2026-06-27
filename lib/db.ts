import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './db/schema';

// Maintain a global singleton pattern
const globalForDb = globalThis as unknown as {
  db: BetterSQLite3Database<typeof schema> | undefined;
};

const sqliteUrl = process.env.DATABASE_URL?.replace("file:", "") || "./dev.db";

// Instantiate the DB
export const db = globalForDb.db ?? drizzle(new Database(sqliteUrl), { schema });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
