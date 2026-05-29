# Mise en ligne simple

Ce guide permet de passer du prototype local à un site permanent sur Vercel, avec le code sur GitHub et Google Login via Supabase.

## 1. Créer le repo GitHub

1. Aller sur GitHub.
2. Cliquer sur `New repository`.
3. Nommer le repo `immo-clair-mvp`.
4. Choisir `Private`.
5. Ne pas ajouter README, `.gitignore` ou licence.
6. Cliquer sur `Create repository`.

## 2. Pousser le projet

Dans le dossier du projet:

```bash
git init
git add .
git commit -m "Initial Immo Clair MVP"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/immo-clair-mvp.git
git push -u origin main
```

## 3. Connecter GitHub à Vercel

1. Aller sur Vercel.
2. Cliquer sur `Add New...` puis `Project`.
3. Choisir le repo `immo-clair-mvp`.
4. Garder le framework `Next.js`.
5. Garder la commande de build du projet: `npm run build:vercel`.
6. Cliquer sur `Deploy`.

## 4. Créer Supabase

1. Aller sur Supabase.
2. Créer un nouveau projet.
3. Ouvrir `SQL Editor`.
4. Copier-coller le fichier `supabase/schema.sql`.
5. Lancer le script.

## 5. Activer Google Login

1. Dans Supabase, aller dans `Authentication`.
2. Ouvrir `Providers`.
3. Activer `Google`.
4. Ajouter le `Client ID` et le `Client Secret` Google.
5. Dans `URL Configuration`, ajouter:

```text
https://votre-site.vercel.app
https://votre-site.vercel.app/auth/callback
```

## 6. Ajouter les variables Vercel

Dans Vercel:

1. Ouvrir le projet.
2. Aller dans `Settings`.
3. Aller dans `Environment Variables`.
4. Ajouter:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=https://votre-site.vercel.app
```

## 7. Redéployer

Dans Vercel, cliquer sur `Redeploy`.

## 8. Tester

1. Ouvrir l’URL Vercel.
2. Vérifier que le dashboard s’affiche.
3. Cliquer sur `Connexion Google`.
4. Se connecter.
5. Vérifier que le bouton devient `Déconnexion`.
6. Tester les pages `Biens`, `Documents`, `Transactions`, `Comptabilité`.

Sans variables Supabase, le site reste en mode démo.
