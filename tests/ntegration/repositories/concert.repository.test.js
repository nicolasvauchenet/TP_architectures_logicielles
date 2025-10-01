import { artistRepository } from "../../../src/repositories/artist.repository.js";
import { concertRepository } from "../../../src/repositories/concert.repository.js";
import { Concert } from "../../../src/business/entities/concert.js";

describe("Integration: concertRepository.create", () => {
  test("insère un concert lié à un artist", () => {
    const artist = artistRepository.create({ name: "Massive Attack" });
    const created = concertRepository.create({
      artist_id: artist.id,
      starts_at: "2025-12-31T21:00:00.000Z",
      capacity: 500,
    });

    expect(created.id).toBeGreaterThan(0);
    expect(created.artist_id).toBe(artist.id);

    const fromDb = global.__db__
      .prepare("SELECT * FROM concerts WHERE id=?")
      .get(created.id);
    expect(fromDb.starts_at).toBe("2025-12-31T21:00:00.000Z");

    expect(Concert(created)).toMatchObject({
      id: created.id,
      artist_id: artist.id,
      capacity: 500,
    });
  });
});
