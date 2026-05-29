# Déploiement Vercel

## Commandes

```bash
npm install
npm run build
```

Vercel utilise `npm run build:vercel`, défini dans `vercel.json`.

## Variables à créer dans Vercel

Obligatoires pour le mode production complet:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

Optionnelles pour préparer OAuth Google:

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Sans ces clés, l’application reste accessible en mode démo avec données mock.

## Après déploiement

Dans Supabase Authentication, ajouter l’URL publique Vercel dans les redirect URLs:

```text
https://votre-domaine.vercel.app
https://votre-domaine.vercel.app/**
```

Pour redéployer, pousser une nouvelle modification sur la branche connectée à Vercel.
