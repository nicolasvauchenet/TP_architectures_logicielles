import db from "./db.js";
export const concertRepository = {
  create({ artist_id, starts_at, capacity }) {
    const info = db
      .prepare(
        "INSERT INTO concerts(artist_id,starts_at,capacity) VALUES (?,?,?)"
      )
      .run(artist_id, starts_at, capacity);
    return db
      .prepare("SELECT * FROM concerts WHERE id=?")
      .get(info.lastInsertRowid);
  },
  findById(id) {
    return db.prepare("SELECT * FROM concerts WHERE id=?").get(id) ?? null;
  },
  list() {
    return db
      .prepare(
        `
      SELECT c.*, a.name AS artist_name
      FROM concerts c JOIN artists a ON a.id=c.artist_id
      ORDER BY c.starts_at
    `
      )
      .all();
  },
};
