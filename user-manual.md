# Manuel d'utilisation – Billetterie JO

Bienvenue sur l'application officielle de réservation de billets pour les Jeux Olympiques 2024 en France.  
Ce guide vous accompagne étape par étape pour acheter vos e-tickets en toute sécurité.

## Sommaire
- [Étape 1 – Créer un compte](#étape-1--créer-un-compte)
- [Étape 2 – Se connecter](#étape-2--se-connecter)
- [Étape 3 – Choisir un billet](#étape-3--choisir-un-billet)
- [Étape 4 – Payer votre billet](#étape-4--payer-votre-billet)
- [Étape 5 – Recevoir votre ticket](#étape-5--recevoir-votre-ticket)
- [Étape 6 – Présenter votre billet le jour J](#étape-6--présenter-votre-billet-le-jour-j)

---

## Étape 1 – Créer un compte

1. Rendez-vous sur [https://billeterie-jo.nuxt.dev](https://billeterie-jo.nuxt.dev)
2. Cliquez sur **"Se connecter"**
3. Cliquez sur **"Créez-en un"**
4. Remplissez les champs requis :
   - Prénom
   - Nom
   - Adresse email
   - Mot de passe
   - Confirmation du mot de passe
5. Cliquez sur **"Créer un compte"**

> Une clé secrète est générée automatiquement en arrière-plan pour sécuriser vos billets. Elle n’est pas visible par vous, mais utilisée par le système, les employés et les administrateurs.

---

## Étape 2 – Se connecter

1. Rendez-vous sur [https://billeterie-jo.nuxt.dev](https://billeterie-jo.nuxt.dev)
2. Cliquez sur **"Se connecter"**
3. Saisissez vos identifiants
4. Vous êtes redirigé vers la page d’accueil

---

## Étape 3 – Choisir un billet

1. Cliquez sur **"Billetterie"**
2. Choisissez une offre :
   - Solo
   - Duo (2 billets)
   - Famille (4 billets)
3. Cliquez sur **"Réserver maintenant"**

---

## Étape 4 – Payer votre billet

1. Si vous êtes connecté, une page de paiement Stripe s’ouvre
2. Saisissez vos informations bancaires (paiement sécurisé)
3. Cliquez sur **"Payer"**

> Une seconde clé de sécurité est générée automatiquement à l’achat pour authentifier votre ticket.

---

## Étape 5 – Recevoir votre ticket

Après paiement, vous recevez :
- Un email de confirmation
- Un QR code de votre billet (hébergé sur Cloudinary)

---

## Étape 6 – Présenter votre billet le jour J

1. Rendez-vous à l’entrée de l’évènement
2. Présentez le QR code (sur téléphone par mail ou imprimé)
3. L’employé scanne votre billet

En cas de succès, vous accédez à l’événement.  
Le système vérifie que :
- Les 2 clés correspondent
- Le billet n’a pas déjà été utilisé
