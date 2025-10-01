import { Reservation } from "../../../src/business/entities/reservation.js";

describe("Entity: Reservation", () => {
  test("mappe row -> domaine", () => {
    const row = { id: 5, concert_id: 2, email: "a@b.com", qty: 3 };
    expect(Reservation(row)).toEqual(row);
  });
});
