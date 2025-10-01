import { artistRepository } from "../../../src/repositories/artist.repository.js";
import { Artist } from "../../../src/business/entities/artist.js";

describe("Integration: artistRepository.create", () => {
  test("insère et retourne la row", () => {
    const row = artistRepository.create({ name: "PJ Harvey" });
    expect(row.id).toBeGreaterThan(0);
    expect(row.name).toBe("PJ Harvey");

    const fromDb = global.__db__
      .prepare("SELECT * FROM artists WHERE id=?")
      .get(row.id);
    expect(fromDb.name).toBe("PJ Harvey");

    expect(Artist(row)).toEqual({ id: row.id, name: "PJ Harvey" });
  });

  test("contrainte UNIQUE(name)", () => {
    artistRepository.create({ name: "Nina Simone" });
    expect(() => artistRepository.create({ name: "Nina Simone" })).toThrow();
  });
});
