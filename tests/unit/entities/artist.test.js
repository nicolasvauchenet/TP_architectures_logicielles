import { Artist } from "../../../src/business/entities/artist.js";

describe("Entity: Artist", () => {
  test("mappe row -> domaine", () => {
    const row = { id: 1, name: "Bjork" };
    expect(Artist(row)).toEqual({ id: 1, name: "Bjork" });
  });
});
