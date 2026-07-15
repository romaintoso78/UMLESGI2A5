# UrbNet — Plateforme communautaire d'exploration urbaine

Application web permettant aux explorateurs urbains de partager, commenter et noter des lieux abandonnés. Les coordonnées GPS sont floutées jusqu'à ce que l'utilisateur atteigne 10 points de réputation.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | Laravel 12 (PHP 8.2) + Sanctum (tokens Bearer) |
| Frontend | React 18 + Vite + React Router + React-Leaflet |
| Base de données | MySQL via XAMPP |
| Prestataire extérieur | Nominatim / OpenStreetMap (géocodage d'adresses) |

---

## Lancer le projet (à faire à chaque fois)

### Prérequis
- XAMPP installé (Apache + MySQL démarrés)
- PHP 8.2 dans le PATH (ou via `/c/xampp/php/php`)
- Composer installé
- Node.js 18+

### 1. Démarrer MySQL (XAMPP)
Lance XAMPP et démarre le module **MySQL**. La base de données `urbnet` doit exister (elle est créée par les migrations).

### 2. Backend (Laravel) — dans un terminal
```bash
cd backend
php artisan serve --port=8000
```
L'API tourne sur : http://localhost:8000

### 3. Frontend (React) — dans un autre terminal
```bash
cd frontend
npm run dev
```
L'app tourne sur : http://localhost:5173

> Les deux doivent tourner en même temps.

---

## Installation depuis zéro (première fois uniquement)

```bash
# Backend
cd backend
composer install
cp .env.example .env
# Dans .env : DB_DATABASE=urbnet, DB_USERNAME=root, DB_PASSWORD=
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# Frontend
cd frontend
npm install
```

---

## Comptes de démo (créés par le seeder)

| Rôle | Email | Mot de passe |
|---|---|---|
| Modérateur | modo@urbnet.fr | password |
| Explorateur (55 rep) | sara@urbnet.fr | password |
| Explorateur (5 rep) | leo@urbnet.fr | password |

> Leo a moins de 10 points de réputation : les coordonnées des lieux sont floutées pour lui.
> Sara en a 55 : elle voit les vraies coordonnées.

---

## Fonctionnalités implémentées

- Inscription / Connexion / Déconnexion (auth Bearer token Sanctum)
- Liste des lieux avec filtre par niveau de risque (faible / moyen / élevé)
- Détail d'un lieu avec carte Leaflet/OpenStreetMap
- Coordonnées GPS floutées si réputation < 10 (débloquées au-delà)
- Proposition d'un lieu avec upload photo + géocodage via Nominatim
- Ajout de carnets de visite (+5 points de réputation automatiquement)
- Système de badges débloqués par seuil de réputation
- Commentaires avec notation 1 à 5 étoiles
- Signalement d'un lieu (danger / lieu détruit / lieu squatté)
- Interface de modération : valider/rejeter lieux, traiter signalements
- Profil utilisateur avec barre de réputation et historique de visites

---

## Architecture du projet

```
urbnet/
├── backend/                        API REST Laravel
│   ├── app/
│   │   ├── Models/
│   │   │   ├── User.php            Utilisateur + réputation + badges
│   │   │   ├── Lieu.php            Lieu urbex (coordonnées floutées si rep < 10)
│   │   │   ├── CarnetDeVisite.php  Visite d'un lieu (+5 rep)
│   │   │   ├── Commentaire.php     Commentaire + note 1-5
│   │   │   ├── Signalement.php     Signalement danger/détruit/squatté
│   │   │   ├── Badge.php           Badge débloqué par seuil de rep
│   │   │   └── Photo.php           Photo associée à un lieu
│   │   └── Http/Controllers/Api/
│   │       ├── AuthController.php          register, login, logout, me
│   │       ├── LieuController.php          CRUD lieux + masquage coords
│   │       ├── CarnetController.php        Carnets de visite
│   │       ├── CommentaireController.php   Commentaires
│   │       ├── SignalementController.php   Signalements
│   │       ├── ModerationController.php    Espace modérateur
│   │       └── GeocodeController.php       Proxy Nominatim
│   ├── database/
│   │   ├── migrations/             Schéma de la base de données
│   │   └── seeders/DatabaseSeeder  Données de démo
│   └── routes/api.php              Toutes les routes API
│
└── frontend/                       App React
    └── src/
        ├── context/AuthContext.jsx  Gestion de l'auth globale (user, login, logout)
        ├── services/api.js          Client Axios (injecte le token Bearer auto)
        ├── pages/
        │   ├── LoginPage.jsx        Connexion + inscription
        │   ├── LieuxListPage.jsx    Liste des lieux avec filtres
        │   ├── LieuDetailPage.jsx   Détail lieu + carte + carnets + commentaires + signalement
        │   ├── ProposerLieuPage.jsx Formulaire de proposition avec géocodage
        │   ├── ProfilPage.jsx       Profil + réputation + badges + historique
        │   └── ModerationPage.jsx   Interface modérateur
        ├── App.jsx                  Routing + Navbar
        ├── index.css                Design system (variables CSS, composants)
        └── main.jsx                 Point d'entrée React
```

---

## Routes API

### Publiques (sans token)
| Méthode | URL | Description |
|---|---|---|
| POST | /api/register | Inscription |
| POST | /api/login | Connexion |
| GET | /api/lieux | Liste des lieux |
| GET | /api/lieux/:id | Détail d'un lieu |

### Protégées (Bearer token requis)
| Méthode | URL | Description |
|---|---|---|
| POST | /api/logout | Déconnexion |
| GET | /api/me | Profil de l'utilisateur connecté |
| POST | /api/lieux | Proposer un lieu |
| GET | /api/lieux/:id/carnets | Carnets d'un lieu |
| POST | /api/lieux/:id/carnets | Ajouter un carnet (+5 rep) |
| POST | /api/lieux/:id/commentaires | Ajouter un commentaire |
| POST | /api/lieux/:id/signalements | Signaler un lieu |
| POST | /api/geocode | Géocoder une adresse (proxy Nominatim) |

### Modérateur uniquement
| Méthode | URL | Description |
|---|---|---|
| GET | /api/moderation/lieux-en-attente | Lieux à valider |
| PATCH | /api/moderation/lieux/:id | Valider ou rejeter un lieu |
| GET | /api/moderation/signalements | Signalements ouverts |
| PATCH | /api/moderation/signalements/:id | Marquer un signalement traité |

---

## Ce qu'il reste à faire pour le rendu

### UI/UX (à faire sur Figma ou à la main, pour le dossier)
- [ ] Zoning — schéma grossier des zones de chaque page
- [ ] Wireframe — maquette filaire noir et blanc
- [ ] Maquette — les captures d'écran de l'app peuvent servir directement

### Git
- [ ] `git init` à la racine du projet
- [ ] Commits propres avec un message clair par fonctionnalité

### Dossier de conception (12-20 pages)
- [ ] Page de garde + table des matières + table des figures
- [ ] Introduction et contexte du projet
- [ ] Analyse du besoin + User Stories
- [ ] Stratégie : technos choisies et pourquoi, organisation du travail, répartition des rôles
- [ ] Schéma d'architecture (frontend → backend → BDD → Nominatim)
- [ ] Les diagrammes UML annotés et commentés
- [ ] Zoning / Wireframe / Maquette
- [ ] Liste fonctionnelle exhaustive
- [ ] Stratégie de tests (tests manuels suffisent)
- [ ] Conclusion : ce qui a marché, ce qui a moins bien marché, perspectives d'évolution
