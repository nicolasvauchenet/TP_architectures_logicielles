export const Concert = (row) => ({
  id: row.id,
  artist_id: row.artist_id,
  starts_at: row.starts_at,
  capacity: row.capacity,
});
