import { Reservation } from "../entities/reservation.js";
import { DomainError } from "../../errors.js";

export function makeReservationService({
  reservationRepository,
  concertRepository,
}) {
  return {
    async create({ concert_id, email, qty }) {
      const concert = await concertRepository.findById(concert_id);
      if (!concert) throw new DomainError("CONCERT_NOT_FOUND");
      if (!email?.includes("@"))
        throw new DomainError("VALIDATION", "invalid email");
      if (!(qty > 0)) throw new DomainError("VALIDATION", "qty > 0");

      const exists = await reservationRepository.findByConcertAndEmail(
        concert_id,
        email
      );
      if (exists) throw new DomainError("RESERVATION_EXISTS");

      const reserved = await reservationRepository.sumQtyByConcert(concert_id);
      if (reserved + qty > concert.capacity)
        throw new DomainError("CAPACITY_EXCEEDED");

      return Reservation(
        await reservationRepository.create({ concert_id, email, qty })
      );
    },
    async listByConcert(concert_id) {
      return (await reservationRepository.listByConcert(concert_id)).map(
        Reservation
      );
    },
  };
}
