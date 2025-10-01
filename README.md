# Festival – 3-Tier Architecture

Une application Node.js + Express + SQLite pour gérer la programmation d’un festival de musique, les réservations et quelques rapports statistiques.  
Cette version illustre une architecture 3-Tier (Presentation / Business / Data) avec deux Design Patterns GoF intégrés : Factory et Façade.

## Installation

### Prérequis

- Node.js ≥ 18
- npm ou yarn

### Étapes

1. Cloner le dépôt ou copier les fichiers

2. Installer les dépendances (npm install ou yarn install)

3. Lancer le serveur (npm run dev)

4. Par défaut, le serveur écoute sur http://localhost:3000.
   Une base SQLite (festival.db) est créée automatiquement dans le dossier courant.

---

## Structure du projet

```bash
src/
├── business/             # Couche Domaine / logique métier
│   ├── entities/         # Entités métier (Artist, Concert, Reservation…)
│   └── services/         # Cas d’usage (ArtistService, ReservationService…)
│
├── infrastructure/       # Couche technique (accès BDD & ressources)
│   ├── db/               # Connexion + migrations SQLite
│   │   └── index.js
│   └── repositories/     # Repositories SQLite (artistRepository…)
│
├── presentation/         # Couche Présentation (adaptateur HTTP)
│   ├── controllers/      # Contrôleurs Express
│   └── routes/           # Routes HTTP Express
│
├── app.js                # Construction de l’app Express (routes, middlewares, DI)
├── container.js          # Wiring : Factory + Facade
├── errors.js             # Définition + middleware des erreurs
└── index.js              # Bootstrap serveur (dotenv + listen)
```

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

### Facade

- Exposé par : `makeAppServices().services`
- Rôle : offrir un point d’entrée simple et unique (app.locals.services) aux couches supérieures.
- Avantage : les contrôleurs n’ont pas besoin de connaître le wiring interne.

---

### Schéma

![alt text](<assets/img/MVP 3-Tier.png>)

---

## Évolutions possibles

- UI web (React / Vue / Svelte) connectée à l’API REST
- Authentification / autorisation
- Notifications email à chaque réservation
- Export CSV / PDF des rapports
- Migration vers des patterns plus avancés : CQRS, DDD, Hexagonal, microservices

---

### Licence

Projet pédagogique.
Libre d’utilisation et d’adaptation.
