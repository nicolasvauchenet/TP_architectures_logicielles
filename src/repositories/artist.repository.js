import db from "../db.js";

export const artistRepository = {
  create({ name }) {
    const info = db.prepare("INSERT INTO artists(name) VALUES(?)").run(name);
    return db
      .prepare("SELECT * FROM artists WHERE id=?")
      .get(info.lastInsertRowid);
  },
  findAll() {
    return db.prepare("SELECT * FROM artists ORDER BY name").all();
  },
  findById(id) {
    return db.prepare("SELECT * FROM artists WHERE id=?").get(id) ?? null;
  },
};
