# Immo Clair MVP

Prototype privé pour aider un propriétaire immobilier peu technique à gérer biens, loyers, dépenses, factures, documents et alertes IA.

## Ce qui est inclus

- Dashboard lisible avec revenus, dépenses, loyers reçus, retards et factures.
- Gestion des biens avec locataire, adresse, loyers, charges et notes.
- Import bancaire CSV avec catégorisation automatique simple.
- Upload de documents vers Supabase Storage.
- Analyse IA des images de factures avec OpenAI.
- Assistant IA pour générer alertes, anomalies et paiements manquants.
- Export CSV mensuel.
- Connexion Google via Supabase Auth.
- Mode démo si Supabase n’est pas encore configuré.

## Installation

1. Installer les dépendances.

```bash
npm install
```

2. Copier les variables d’environnement.

```bash
cp .env.example .env.local
```

3. Remplir `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
```

4. Créer les tables Supabase.

Dans Supabase, ouvrez SQL Editor et exécutez le contenu de `supabase/schema.sql`.

5. Activer Google Login.

Dans Supabase:

- Authentication
- Providers
- Google
- Ajouter le Client ID et le Client Secret Google
- Ajouter l’URL de redirection Supabase dans Google Cloud

6. Lancer le projet.

```bash
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

Le projet fonctionne aussi sans Supabase ni OpenAI: il démarre en mode démo avec des données réalistes.

## Format CSV bancaire attendu

Le MVP accepte un CSV avec des colonnes proches de:

```csv
Date;Libelle;Montant
2026-05-03;Loyer Claire Martin;1390
2026-05-12;Réparation plomberie;-285
```

Les catégories détectées automatiquement au départ:

- loyer
- assurance
- énergie
- taxes
- travaux
- autre dépense

Test rapide:

```bash
curl -F file=@releve.csv http://localhost:3000/api/import/bank
```

## Tester les PDF et images

Depuis le dashboard ou la page Documents:

1. Cliquer sur “Importer une facture”.
2. Choisir un PDF ou une image.
3. Sans Supabase connecté, l’API répond en mode démo.
4. Avec Supabase connecté, le fichier est stocké dans `property-documents`.
5. Avec `OPENAI_API_KEY`, les images et PDF texte sont structurés plus précisément.

Les PDF texte simples sont lus côté serveur. Les PDF scannés comme image doivent passer par une image ou une étape OCR dédiée.

Test rapide:

```bash
curl -F file=@facture.pdf http://localhost:3000/api/documents/analyze
```

## Connecter Supabase

1. Créer un projet Supabase.
2. Copier l’URL et la clé anon dans `.env.local`.
3. Copier la service role key dans `.env.local`.
4. Exécuter `supabase/schema.sql` dans SQL Editor.
5. Activer Authentication > Providers > Google.
6. Ajouter les identifiants OAuth Google.
7. Dans Google Cloud, ajouter l’URL de callback fournie par Supabase.

Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Connecter OpenAI

Ajouter la clé dans `.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

Routes qui l’utilisent:

- `POST /api/documents/analyze`
- `POST /api/ai/insights`

Sans clé OpenAI, le projet reste utilisable en mode démo et avec extraction PDF locale basique.

## Prochaines étapes recommandées

1. Ajouter l’extraction PDF réelle pour les relevés et factures PDF.
2. Brancher l’API Gmail pour récupérer les mails administratifs.
3. Ajouter un écran de validation avant insertion automatique.
4. Générer automatiquement les loyers attendus chaque mois.
5. Ajouter l’export PDF comptable.

## Vérifications

```bash
npm run typecheck
npm run lint
npm run build
```

Vérifications effectuées sur ce prototype:

- `npm run typecheck`: OK
- `npm run lint`: OK
- `npm run build`: OK
- Dashboard local vérifié sur `http://localhost:3000`

## Déploiement Vercel

Le projet contient:

- `vercel.json`
- `.vercelignore`
- `.nvmrc`
- `docs/deployment.md`

Déploiement manuel rapide:

```bash
npm install
npm run build
npx vercel deploy --prod
```

Le déploiement Vercel utilisera `npm run build:vercel`.
