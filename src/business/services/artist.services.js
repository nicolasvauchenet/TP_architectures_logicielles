import { Artist } from "../entities/artist.js";
import { DomainError } from "../../errors.js";
export function makeArtistService({ artistRepository }) {
  return {
    async create({ name }) {
      if (!name?.trim())
        throw new DomainError("VALIDATION", "name is required");
      return Artist(await artistRepository.create({ name: name.trim() }));
    },
    async list() {
      return (await artistRepository.findAll()).map(Artist);
    },
  };
}
