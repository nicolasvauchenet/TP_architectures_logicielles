import express from "express";
import Database from "better-sqlite3";

const db = new Database("festival.db");
const app = express();
app.use(express.json());

// --- Schema --------------------------------------------------------------------------------------
db.exec(`
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS artists(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS concerts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  starts_at TEXT NOT NULL,              -- ISO datetime (string)
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

// --- Helpers --------------------------------------------------------------------------------------
const row = (sql, p = []) => db.prepare(sql).get(p);
const all = (sql, p = []) => db.prepare(sql).all(p);
const run = (sql, p = []) => db.prepare(sql).run(p);

const withTx = (fn) => db.transaction(fn);

// --- Requêtes réutilisables -----------------------------------------------------------------------
const concertStatsBase = `
SELECT c.id, a.name AS artist, c.starts_at, c.capacity,
       COALESCE(SUM(r.qty),0) AS reserved,
       (c.capacity - COALESCE(SUM(r.qty),0)) AS remaining,
       ROUND(100.0 * COALESCE(SUM(r.qty),0) / NULLIF(c.capacity,0), 2) AS fill_rate
FROM concerts c
JOIN artists a ON a.id = c.artist_id
LEFT JOIN reservations r ON r.concert_id = c.id
GROUP BY c.id
`;

const concertStatsOrdered = `
${concertStatsBase}
ORDER BY c.starts_at ASC, c.id ASC
`;

// --- Artists CRUD ---------------------------------------------------------------------------------
app.get("/artists", (req, res) => {
  res.json(all(`SELECT * FROM artists ORDER BY name ASC`));
});

app.post("/artists", (req, res) => {
  const { name } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ error: "name required" });
  try {
    const { lastInsertRowid } = run(`INSERT INTO artists(name) VALUES(?)`, [
      name.trim(),
    ]);
    res
      .status(201)
      .json(row(`SELECT * FROM artists WHERE id=?`, [lastInsertRowid]));
  } catch {
    res.status(409).json({ error: "artist already exists" });
  }
});

app.put("/artists/:id", (req, res) => {
  const { name } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ error: "name required" });
  const r = run(`UPDATE artists SET name=? WHERE id=?`, [
    name.trim(),
    req.params.id,
  ]);
  if (!r.changes) return res.status(404).json({ error: "not found" });
  res.json(row(`SELECT * FROM artists WHERE id=?`, [req.params.id]));
});

app.delete("/artists/:id", (req, res) => {
  const r = run(`DELETE FROM artists WHERE id=?`, [req.params.id]);
  if (!r.changes) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

// --- Concerts CRUD --------------------------------------------------------------------------------
app.get("/concerts", (req, res) => {
  res.json(all(concertStatsOrdered));
});

app.post("/concerts", (req, res) => {
  const { artist_id, starts_at, capacity } = req.body || {};
  if (!artist_id || !starts_at || capacity == null) {
    return res
      .status(400)
      .json({ error: "artist_id, starts_at, capacity required" });
  }
  const a = row(`SELECT id FROM artists WHERE id=?`, [artist_id]);
  if (!a) return res.status(400).json({ error: "artist_id invalid" });

  const { lastInsertRowid } = run(
    `INSERT INTO concerts(artist_id, starts_at, capacity) VALUES(?,?,?)`,
    [artist_id, String(starts_at), Number(capacity)]
  );
  res
    .status(201)
    .json(
      row(`SELECT * FROM (${concertStatsBase}) WHERE id=?`, [lastInsertRowid])
    );
});

app.put("/concerts/:id", (req, res) => {
  const { artist_id, starts_at, capacity } = req.body || {};
  const existing = row(`SELECT * FROM concerts WHERE id=?`, [req.params.id]);
  if (!existing) return res.status(404).json({ error: "not found" });

  const newArtist = artist_id ?? existing.artist_id;
  if (!row(`SELECT id FROM artists WHERE id=?`, [newArtist])) {
    return res.status(400).json({ error: "artist_id invalid" });
  }
  run(`UPDATE concerts SET artist_id=?, starts_at=?, capacity=? WHERE id=?`, [
    newArtist,
    String(starts_at ?? existing.starts_at),
    Number(capacity ?? existing.capacity),
    req.params.id,
  ]);
  res.json(
    row(`SELECT * FROM (${concertStatsBase}) WHERE id=?`, [req.params.id])
  );
});

app.delete("/concerts/:id", (req, res) => {
  const r = run(`DELETE FROM concerts WHERE id=?`, [req.params.id]);
  if (!r.changes) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

// --- Programmation disponible ---------------------------------------------------------------------
app.get("/programming", (req, res) => {
  res.json(
    all(
      `SELECT * FROM (${concertStatsBase}) WHERE remaining > 0 ORDER BY starts_at ASC, id ASC`
    )
  );
});

// --- Réservations ---------------------------------------------------------------------------------
app.get("/reservations", (req, res) => {
  res.json(
    all(
      `SELECT r.id, r.email, r.qty, r.concert_id, a.name AS artist, c.starts_at
       FROM reservations r
       JOIN concerts c ON c.id = r.concert_id
       JOIN artists a  ON a.id = c.artist_id
       ORDER BY c.starts_at ASC, r.id ASC`
    )
  );
});

app.post("/reservations", (req, res) => {
  const { concert_id, email, qty } = req.body || {};
  if (!concert_id || !email?.trim() || !qty) {
    return res.status(400).json({ error: "concert_id, email, qty required" });
  }
  const tx = withTx(() => {
    const c = row(`SELECT * FROM (${concertStatsBase}) WHERE id=?`, [
      concert_id,
    ]);
    if (!c) return { status: 400, json: { error: "invalid concert_id" } };
    if (
      row(`SELECT 1 FROM reservations WHERE concert_id=? AND email=?`, [
        concert_id,
        email,
      ])
    ) {
      return {
        status: 409,
        json: { error: "email already reserved for this concert" },
      };
    }
    if (qty > c.remaining)
      return { status: 400, json: { error: "not enough seats" } };
    const { lastInsertRowid } = run(
      `INSERT INTO reservations(concert_id,email,qty) VALUES(?,?,?)`,
      [concert_id, email.trim().toLowerCase(), Number(qty)]
    );
    const created = row(
      `SELECT id, concert_id, email, qty FROM reservations WHERE id=?`,
      [lastInsertRowid]
    );
    const stats = row(`SELECT * FROM (${concertStatsBase}) WHERE id=?`, [
      concert_id,
    ]);
    return { status: 201, json: { reservation: created, concert: stats } };
  });
  const out = tx();
  res.status(out.status).json(out.json);
});

// --- Rapports -------------------------------------------------------------------------------------
// A) KPIs globaux de remplissage
app.get("/reports/fill-rate", (req, res) => {
  const summary = row(
    `
    SELECT
      COUNT(*) AS concerts,
      SUM(capacity) AS total_capacity,
      SUM(reserved) AS total_reserved,
      ROUND(100.0 * SUM(reserved) / NULLIF(SUM(capacity), 0), 2) AS overall_fill_rate,
      SUM(CASE WHEN remaining = 0 THEN 1 ELSE 0 END) AS sold_out,
      MIN(fill_rate) AS min_fill_rate,
      MAX(fill_rate) AS max_fill_rate,
      ROUND(AVG(fill_rate), 2) AS avg_fill_rate
    FROM (${concertStatsBase})
    `
  );
  res.json(summary);
});

// B) Performance par artiste
app.get("/reports/by-artist", (req, res) => {
  const sql = `
    SELECT
      a.id AS artist_id,
      a.name AS artist,
      COUNT(c.id) AS concerts,
      COALESCE(SUM(c.capacity),0) AS capacity,
      COALESCE(SUM(r.qty),0) AS reserved,
      ROUND(100.0 * COALESCE(SUM(r.qty),0) / NULLIF(SUM(c.capacity),0), 2) AS fill_rate
    FROM artists a
    LEFT JOIN concerts c ON c.artist_id = a.id
    LEFT JOIN reservations r ON r.concert_id = c.id
    GROUP BY a.id
    ORDER BY fill_rate DESC NULLS LAST, reserved DESC, capacity DESC, artist ASC
  `;
  res.json(all(sql));
});

// C) Remplissage par jour
app.get("/reports/by-day", (req, res) => {
  const sql = `
    WITH stats AS (${concertStatsBase})
    SELECT
      date(starts_at) AS day,
      COUNT(*) AS concerts,
      SUM(capacity) AS total_capacity,
      SUM(reserved) AS total_reserved,
      ROUND(100.0 * SUM(reserved) / NULLIF(SUM(capacity),0), 2) AS fill_rate,
      SUM(CASE WHEN remaining = 0 THEN 1 ELSE 0 END) AS sold_out
    FROM stats
    GROUP BY date(starts_at)
    ORDER BY day ASC
  `;
  res.json(all(sql));
});

// D) Total des réservations
app.get("/reports/total-reservations", (req, res) => {
  const r = row(`SELECT COALESCE(SUM(qty),0) AS total FROM reservations`);
  res.json(r);
});

// --- Boot -----------------------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Festival monolith running on http://localhost:${PORT}`)
);
