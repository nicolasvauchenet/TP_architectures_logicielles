- **Presentation** : gère les requêtes HTTP via Express (routes + contrôleurs).
- **Business** : encapsule les règles métier dans des services (capacités, unicité email, etc.).
- **Data** : interagit avec SQLite via des repositories.
- **container.js** : point central de wiring (voir section Patterns).

---

## Fonctionnalités

### 1. Programmation

- Créer et lister des artistes
- Créer et lister des concerts
- Associer un concert à un artiste, une date/heure, une capacité

### 2. Réservations

- Réserver des places par email (1 réservation unique par concert/email)
- Vérification automatique des jauges et capacité restante
- Consulter les réservations par concert

### 3. Rapports statistiques

- Voir le taux de remplissage par concert
- Obtenir des indicateurs d’occupation (places réservées / capacité)

---

## API Endpoints

### Artistes

- **GET** `/artists` : liste des artistes
- **POST** `/artists` : créer un artiste

### Concerts

- **GET** `/concerts` : liste des concerts avec infos artiste
- **GET** `/concerts/:id` : détails d’un concert
- **POST** `/concerts` : créer un concert

### Réservations

- **POST** `/reservations` : créer une réservation
- **GET** `/reservations/by-concert/:id` : réservations d’un concert

### Rapports

- **GET** `/reports/occupancy` : taux de remplissage par concert

---

## Design Patterns intégrés

### Factory (Abstract Factory)

- **Fichier : `container.js`**
- Rôle : instancier tous les services en injectant leurs dépendances (repositories).
- Avantage : centralisation de la configuration, testabilité (mocks possibles).

```js
export function makeAppServices() {
  return {
    artist: makeArtistService({ artistRepository }),
    concert: makeConcertService({ concertRepository, artistRepository }),
    reservation: makeReservationService({
      reservationRepository,
      concertRepository,
    }),
    report: makeReportService({ reportRepository }),
  };
}
```

### Facade

- Exposé par : `makeAppServices().services`
  Rôle : offrir un point d’entrée simple et unique (app.locals.services) aux couches supérieures.
  Avantage : les contrôleurs n’ont pas besoin de connaître le wiring interne.

---

### Schéma

![alt text](<assets/img/MVP 3-Tier.png>)

---

## Évolutions possibles

- UI web (React / Vue / Svelte) connectée à l’API REST
  Authentification / autorisation
  Notifications email à chaque réservation
  Export CSV / PDF des rapports
  Migration vers des patterns plus avancés : CQRS, DDD, Hexagonal, microservices

---

### Licence

Projet pédagogique.
Libre d’utilisation et d’adaptation.
