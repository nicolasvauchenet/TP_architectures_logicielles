export const Reservation = (row) => ({
  id: row.id,
  concert_id: row.concert_id,
  email: row.email,
  qty: row.qty,
});
