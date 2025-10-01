import db from "./db.js";
export const reservationRepository = {
  findByConcertAndEmail(concertId, email) {
    return (
      db
        .prepare("SELECT * FROM reservations WHERE concert_id=? AND email=?")
        .get(concertId, email) ?? null
    );
  },
  countByConcert(concertId) {
    return db
      .prepare("SELECT COUNT(*) AS c FROM reservations WHERE concert_id=?")
      .get(concertId).c;
  },
  sumQtyByConcert(concertId) {
    return db
      .prepare(
        "SELECT IFNULL(SUM(qty),0) AS s FROM reservations WHERE concert_id=?"
      )
      .get(concertId).s;
  },
  create({ concert_id, email, qty }) {
    const info = db
      .prepare("INSERT INTO reservations(concert_id,email,qty) VALUES (?,?,?)")
      .run(concert_id, email, qty);
    return db
      .prepare("SELECT * FROM reservations WHERE id=?")
      .get(info.lastInsertRowid);
  },
  listByConcert(concertId) {
    return db
      .prepare("SELECT * FROM reservations WHERE concert_id=? ORDER BY id DESC")
      .all(concertId);
  },
};
