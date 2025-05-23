# Mocks & Clés – Projet Billetterie JO (Usage École uniquement)

> **⚠️ ATTENTION** : Ce fichier contient des identifiants et clés réelles pour usage local/test uniquement. Ne pas réutiliser en prod réelle.

---

## 👤 Comptes utilisateurs de test

| Rôle       | Email                  | Mot de passe   |
|------------|------------------------|----------------|
| Admin      | `admin@example.com`       | `passwordpasswordpassword`    |
| Employé    | `employee@example.com`    | `passwordpasswordpassword`  |
| Utilisateur| `user@example.com`        | `passwordpasswordpassword`     |

---

## Variables d’environnement de TEST

```env
# Nuxt / API
APP_ENV=test
#APP_ENV=production
NUXT_HUB_PROJECT_KEY=billeterie-jo-fh23
NUXT_PUBLIC_API_URL=http://localhost:3000
#NUXT_PUBLIC_API_URL=https://billeterie-jo.nuxt.dev

# Supabase (projet test créé pour l'école)
NUXT_POSTGRES_URL=postgresql://postgres:8rihgT2Ta1bmTwuH@db.celtkzfdlvlfribqjlmy.supabase.co:5432/postgres
NUXT_POSTGRES_TEST_URL=postgresql://postgres:yHuNHJFaOwjdqvQE@db.fanbkpkrqnlxwpphpafi.supabase.co:5432/postgres

# Stripe (clé test)
NUXT_STRIPE_PUBLIC_KEY=Clé stripe publique
NUXT_STRIPE_SECRET_KEY=Clé stripe secrète

# Cloudinary (compte test)
CLOUDINARY_CLOUD_NAME=jo-billetterie
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=testcloudinarysecret

# Auth JWT
NUXT_JWT_SECRET=241eac12ecbd30747c4fcd0b9528702192731b9b5a92c0298f8954d8f559c2c8

# Brevo (compte test)
NUXT_BREVO_API_KEY=Clé brevo

# Cloudinary (compte test)
NUXT_CLOUDINARY_API_KEY=616715535194873
NUXT_CLOUDINARY_API_SECRET=gq0iqVENATgf_R4CeghvsZ3qKWU
NUXT_CLOUDINARY_CLOUD_NAME=dc7945nxn
