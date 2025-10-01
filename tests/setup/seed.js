export function seedArtist(db, { name }) {
  const info = db.prepare(`INSERT INTO artists(name) VALUES(?)`).run(name);
  return db
    .prepare(`SELECT * FROM artists WHERE id=?`)
    .get(info.lastInsertRowid);
}

export function seedConcert(db, { artist_id, starts_at, capacity }) {
  const info = db
    .prepare(
      `INSERT INTO concerts(artist_id, starts_at, capacity) VALUES(?,?,?)`
    )
    .run(artist_id, starts_at, capacity);
  return db
    .prepare(`SELECT * FROM concerts WHERE id=?`)
    .get(info.lastInsertRowid);
}
