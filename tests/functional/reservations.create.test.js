import request from "supertest";
import app from "../../src/app.js";
import { artistRepository } from "../../src/repositories/artist.repository.js";
import { concertRepository } from "../../src/repositories/concert.repository.js";

describe("Functional: POST /reservations", () => {
  let artist, concert;

  beforeEach(() => {
    artist = artistRepository.create({ name: "Radiohead" });
    concert = concertRepository.create({
      artist_id: artist.id,
      starts_at: "2025-11-15T20:00:00.000Z",
      capacity: 300,
    });
  });

  test("crée une réservation -> 201", async () => {
    const payload = {
      concert_id: concert.id,
      email: "fan@example.org",
      qty: 2,
    };
    const res = await request(app).post("/reservations").send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      concert_id: concert.id,
      email: "fan@example.org",
      qty: 2,
    });

    const row = global.__db__
      .prepare("SELECT * FROM reservations WHERE id=?")
      .get(res.body.id);
    expect(row.email).toBe("fan@example.org");
  });

  test("refuse un doublon (concert_id + email)", async () => {
    const payload = {
      concert_id: concert.id,
      email: "dup@example.org",
      qty: 1,
    };
    await request(app).post("/reservations").send(payload).expect(201);
    const res = await request(app).post("/reservations").send(payload);
    expect([400, 409]).toContain(res.status);
  });

  test("valide les champs requis", async () => {
    const artist = artistRepository.create({ name: "Alice" });
    const concert = concertRepository.create({
      artist_id: artist.id,
      starts_at: "2025-12-31T21:00:00.000Z",
      capacity: 500,
    });

    const res = await request(app).post("/reservations").send({
      concert_id: concert.id,
      qty: 20,
    });

    expect([400, 422]).toContain(res.status);
  });
});
