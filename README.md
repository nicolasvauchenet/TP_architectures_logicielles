Endpoints utiles (exemples)

POST /artists { "name":"Zarbi Trio" }

POST /concerts { "artist_id":1, "starts_at":"2025-10-21T20:00:00", "capacity":150 }

GET /concerts → programmation + stats

GET /programming → uniquement concerts avec places restantes

POST /reservations { "concert_id":1, "email":"alice@mail.com", "qty":2 }

GET /reports/fill-rate → taux par concert

GET /reports/total-reservations → total global

GET /reports/by-artist → performance par artiste (nb de concerts, capacité totale, réservations, taux de remplissage).

GET /reports/by-day → remplissage par jour (pour voir les pics de demande).