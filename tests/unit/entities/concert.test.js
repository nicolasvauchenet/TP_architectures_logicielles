import { Concert } from "../../../src/business/entities/concert.js";

describe("Entity: Concert", () => {
  test("mappe row -> domaine", () => {
    const row = {
      id: 7,
      artist_id: 3,
      starts_at: "2025-12-31T21:00:00.000Z",
      capacity: 500,
    };
    expect(Concert(row)).toEqual(row);
  });
});
