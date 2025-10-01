import { Concert } from "../entities/concert.js";
import { DomainError } from "../../errors.js";
export function makeConcertService({ concertRepository, artistRepository }) {
  return {
    async create({ artist_id, starts_at, capacity }) {
      const artist = await artistRepository.findById(artist_id);
      if (!artist) throw new DomainError("ARTIST_NOT_FOUND");
      if (!starts_at) throw new DomainError("VALIDATION", "starts_at required");
      if (!(capacity >= 0))
        throw new DomainError("VALIDATION", "capacity >= 0");

      const row = await concertRepository.create({
        artist_id,
        starts_at,
        capacity,
      });
      return Concert(row);
    },
    async list() {
      return (await concertRepository.list()).map(Concert);
    },
    async get(id) {
      const c = await concertRepository.findById(id);
      if (!c) throw new DomainError("CONCERT_NOT_FOUND");
      return Concert(c);
    },
  };
}
