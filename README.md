# Festival Monolith – MVP

Une petite application **Node.js + Express + SQLite** pour gérer la programmation d’un festival de musique, les réservations et quelques rapports statistiques.  
Ce projet illustre un **MVP en monolithe** : simple, condensé, mais extensible.

---

## Installation

### Prérequis

- Node.js ≥ 18
- npm ou yarn

### Étapes

- Cloner le dépôt ou copier les fichiers
- Installer les dépendances
- Lancer le serveur

Par défaut, le serveur écoute sur `http://localhost:3000`.  
Une base SQLite est créée automatiquement dans le dossier courant.

---

## Structure du projet

- `app.js` : code principal Express + SQLite
- `package.json` : dépendances et scripts
- `festival.db` : base SQLite auto-générée

---

## Fonctionnalités

### 1. Programmation

- Créer, modifier, supprimer des artistes
- Créer, modifier, supprimer des concerts
- Associer un concert à un artiste, une date/heure, une jauge

### 2. Réservations

- Consulter la programmation et les concerts avec places restantes
- Réserver des places par email (email unique par concert)
- Vérification de la capacité restante

### 3. Rapports statistiques

- Voir le taux de remplissage global
- Classement par artiste
- Remplissage par jour
- Nombre total de réservations

---

## API Endpoints

### Artistes

- GET `/artists` : liste des artistes
- POST `/artists` : créer un artiste
- PUT `/artists/:id` : modifier un artiste
- DELETE `/artists/:id` : supprimer un artiste

### Concerts

- GET `/concerts` : liste des concerts avec statistiques
- POST `/concerts` : créer un concert
- PUT `/concerts/:id` : modifier un concert
- DELETE `/concerts/:id` : supprimer un concert

### Programmation publique

- GET `/programming` : concerts avec places restantes

### Réservations

- GET `/reservations` : liste des réservations
- POST `/reservations` : réserver des places pour un concert

Règles :

- Un email unique par concert
- Refus si la capacité restante est insuffisante

---

## Rapports

### KPIs globaux

- GET `/reports/fill-rate` : indicateurs globaux du festival

### Performance par artiste

- GET `/reports/by-artist` : statistiques regroupées par artiste

### Remplissage par jour

- GET `/reports/by-day` : vision du remplissage par date

### Total des réservations

- GET `/reports/total-reservations` : nombre total de places réservées

---

## Schéma

![alt text](<assets/img/MVP Monolith.png>)

---

## Évolutions possibles

- Interface web (React / Vue / Svelte)
- Authentification et gestion des utilisateurs
- Billeterie & preuve de réservation
- Notifications email sur réservations
- Export PDF / CSV des rapports
- Passage en architecture modulaire (CQRS / n-tier, ddd / clean, hexagonale, microservices, etc.)

---

## Licence

Projet pédagogique.  
Libre d’utilisation et d’adaptation.
