import "dotenv/config";

process.env.SQLITE_PATH = ":memory:";

import db from "../../src/repositories/db.js";

function resetDb() {
  db.exec(`
    DELETE FROM reservations;
    DELETE FROM concerts;
    DELETE FROM artists;
    VACUUM;
  `);
}

beforeEach(() => resetDb());

global.__db__ = db;
global.__resetDb__ = resetDb;
