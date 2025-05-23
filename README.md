# Documentation technique - Billetterie JO

## Sommaire
- [1. Présentation générale](#1-présentation-générale)
- [2. Architecture de l'application](#2-architecture-de-lapplication)
- [3. Sécurité de l'application](#3-sécurité-de-lapplication)
- [4. Endpoints principaux (API)](#4-endpoints-principaux-api)
- [5. Gestion des utilisateurs et des rôles](#5-gestion-des-utilisateurs-et-des-rôles)
- [6. Stockage des tickets et QR codes](#6-stockage-des-tickets-et-qr-codes)
- [7. Paiement et validation](#7-paiement-et-validation)
- [8. Tests](#8-tests)

---

## 1. Présentation générale

L'application permet aux visiteurs des JO 2024 de :
- Créer un compte
- Réserver un ou plusieurs billets (offres solo, duo, famille)
- Payer via Stripe
- Recevoir un e-ticket sécurisé sous forme de QR code
- Présenter ce QR code le jour J pour vérification

### Technologies utilisées :
- **Frontend / Backend** : Vue.js 3, Nuxt.js 3 (fullstack)
- **Base de données** : Supabase (PostgreSQL)
- **Paiement** : Stripe
- **Stockage média** : Cloudinary (QR codes)
- **Sécurité / Auth** : JWT, middleware de rôles
- **Déploiement** : NuxtHub + Cloudflare

---

## 2. Architecture de l’application

- **Nuxt.js 3** : mono-repo frontend + backend avec routes `/api`
- **Supabase** : stockage des utilisateurs, tickets, relations
- **Stripe** : gestion des sessions de paiement
- **Cloudinary** : hébergement des QR codes
- **Middleware Nuxt** : protection des routes avec JWT
- **Cloudflare** : hébergement + protection

---

## 3. Sécurité de l’application

| Élément              | Sécurité mise en place |
|----------------------|------------------------|
| **Authentification** | JWT signé avec clé privée |
| **Accès API**        | Middleware avec contrôle du rôle (`user`, `employee`, `admin`) |
| **Tickets**          | QR code signé contenant 2 clés (clé compte + clé achat sous forme de hash, stocké en BDD) |
| **Données utilisateurs** | Chiffrement des mots de passe avec bcrypt |
| **Paiements**        | Stripe (certifié PCI DSS) |
| **Déploiement**      | Cloudflare (anti-DDoS + HTTPS automatique) |

---

## 4. Endpoints principaux (API)

| Méthode | Endpoint                 | Description |
|---------|--------------------------|-------------|
| POST    | `/api/auth/signup`       | Création de compte + génération de clef secrète |
| POST    | `/api/auth/signin`       | Connexion + retour token JWT |
| GET     | `/api/auth/me`           | Infos utilisateur connecté |
| GET     | `/api/users?roleSlug=`   | Liste filtrée des utilisateurs (admin/employé) |
| GET     | `/api/tickets`           | Liste des offres de billets |
| POST    | `/api/payment/tickets`   | Paiement + génération ticket + mail |
| GET     | `/api/tickets/verify`    | Vérifie un QR code scanné |

---

## 5. Gestion des utilisateurs et des rôles

Trois rôles :
- `user` : peut acheter des billets
- `employee` : peut scanner les billets
- `admin` : accès total à la base utilisateurs et aux logs

> Toutes les routes sont protégées par un middleware.

---

## 6. Stockage des tickets et QR codes

Chaque ticket est lié à un user via une table `usersTickets` avec les champs :
- `isUsed`
- `securityKey`

Chaque QR code contient une URL avec JWT encodant :

```json
{
  "ticketId": "uuid",
  "userId": "uuid",
  "timestamp": 1710000000,
  "hash": "hash"
}
```

## 7. Paiement et validation

Le processus de paiement et de validation s’effectue ainsi :

1. **Stripe** génère une session de paiement sécurisée.
2. À la validation du paiement :
   - Une **clé unique d’achat** est générée.
   - Un **ticket** est créé en base de données (`usersTickets`).
   - Un **QR code** contenant un JWT est généré et hébergé sur **Cloudinary**.
   - Un **email de confirmation** est envoyé à l'utilisateur.
3. Le jour de l’événement :
   - L'utilisateur présente le QR code.
   - L’employé le scanne via l’application.
   - L’API vérifie :
     - La **validité du JWT**
     - La **correspondance entre les 2 clés** (compte + achat)
     - Le champ **`isUsed`** pour éviter les réutilisations

---

## 8. Tests (uniquement pour l'usage école)

Voir le fichier [`tests/mock.md`](tests/mock.md) pour :
- Les identifiants de test (admin, employé, utilisateur)
- Les variables d’environnement de production et de test
