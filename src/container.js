// Abstract Factory + Facade
import { artistRepository } from "./repositories/artist.repository.js";
import { concertRepository } from "./repositories/concert.repository.js";
import { reservationRepository } from "./repositories/reservation.repository.js";
import { reportRepository } from "./repositories/report.repository.js";
import { makeArtistService } from "./business/services/artist.services.js";
import { makeConcertService } from "./business/services/concert.services.js";
import { makeReservationService } from "./business/services/reservation.services.js";
import { makeReportService } from "./business/services/report.services.js";

export function makeAppServices() {
  // Abstract Factory
  const services = {
    artist: makeArtistService({ artistRepository }),
    concert: makeConcertService({ concertRepository, artistRepository }),
    reservation: makeReservationService({
      reservationRepository,
      concertRepository,
    }),
    report: makeReportService({ reportRepository }),
  };

  return {
    services, // Facade
  };
}
