import Database from "better-sqlite3";

const db = new Database(process.env.SQLITE_PATH ?? "festival.db");
db.pragma("foreign_keys = ON");

// Migrations ultra-simples (idempotentes)
db.exec(`
CREATE TABLE IF NOT EXISTS artists(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS concerts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  starts_at TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK(capacity >= 0)
);
CREATE TABLE IF NOT EXISTS reservations(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  concert_id INTEGER NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK(qty > 0),
  UNIQUE(concert_id, email)
);
`);
export default db;
