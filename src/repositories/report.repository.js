import db from "../db.js";

export const reportRepository = {
  occupancy() {
    return db
      .prepare(
        `
      SELECT c.id, c.starts_at, c.capacity, a.name AS artist_name,
             IFNULL(SUM(r.qty), 0) AS reserved_qty,
             ROUND(100.0 * IFNULL(SUM(r.qty),0) / c.capacity, 1) AS fill_rate
      FROM concerts c
      JOIN artists a ON a.id=c.artist_id
      LEFT JOIN reservations r ON r.concert_id=c.id
      GROUP BY c.id
      ORDER BY c.starts_at
    `
      )
      .all();
  },
};
