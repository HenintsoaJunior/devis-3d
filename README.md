# Devis App — Agence de Désinfection/Dératisation

Prototype de module de demande de devis en ligne avec back-office sécurisé.  
Réalisé dans le cadre d'une évaluation technique Full Stack (Next.js + Supabase).

---

## Stack technique

- **Framework** : Next.js 14 (App Router, TypeScript)
- **Base de données** : Supabase (PostgreSQL)
- **Styles** : Tailwind CSS uniquement (pas de librairie UI pré-stylée)
- **Validation** : Zod (client + serveur)
- **Email** : Resend (bonus)

---

## Prérequis

- Node.js >= 18
- Un projet Supabase créé sur [supabase.com](https://supabase.com)

---

## Installation

```bash
git clone https://github.com/<votre-username>/devis-app.git
cd devis-app
npm install
```

Copier le fichier d'environnement et renseigner les variables :

```bash
cp .env.example .env.local
```

Lancer le serveur de développement :

```bash
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

Voir `.env.example` pour la liste complète. Variables requises :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Sécurité
ADMIN_BEARER_TOKEN=votre_token_long_et_aleatoire
ADMIN_PASSWORD=votre_mot_de_passe_backoffice

# Bonus — Email (Resend)
RESEND_API_KEY=re_...
```

> ⚠️ Ne jamais committer `.env.local`. Il est déjà dans `.gitignore`.

---

## Base de données

Exécuter les requêtes SQL suivantes dans l'éditeur SQL de Supabase :

```sql
-- Table principale
CREATE TABLE devis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  etablissement TEXT NOT NULL,
  surface INTEGER NOT NULL,
  nuisibles JSONB NOT NULL,
  urgence TEXT NOT NULL,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  message TEXT,
  statut TEXT NOT NULL DEFAULT 'nouveau'
);

-- Table rate limiting
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Nettoyage automatique des entrées > 1h
CREATE OR REPLACE FUNCTION clean_rate_limits()
RETURNS void AS $$
  DELETE FROM rate_limits WHERE created_at < now() - INTERVAL '1 hour';
$$ LANGUAGE sql;
```

---

## Pages & Routes

| Route | Accès | Description |
|---|---|---|
| `/devis` | Public | Formulaire multi-étapes de demande de devis |
| `/admin` | Protégé | Back-office de gestion des demandes |
| `POST /api/devis` | Public | Soumettre une demande de devis |
| `GET /api/admin/devis` | Bearer token | Lister et filtrer les demandes |

---

## Structure du projet

Voilà la structure actuelle du projet :

`app/` contient les pages et routes App Router (`layout.tsx`, `page.tsx`) ainsi que les styles globaux (`globals.css`).

`public/` contient les assets statiques (icones et images).

Les fichiers de configuration sont a la racine (`next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`).

---

## Fonctionnalités

### Formulaire public `/devis`

- **3 étapes** : Établissement & surface → Type de nuisible & urgence → Coordonnées
- Validation côté client (Zod) et côté serveur (API Route)
- Protection anti-spam : max 3 soumissions par IP par heure
- Sanitisation des inputs (prévention XSS)
- Retour d'un UUID de confirmation à l'utilisateur
- Accessibilité : labels associés, focus visible, erreurs annoncées (aria-live)

### API POST `/api/devis`

- Validation et sanitisation de tous les champs entrants
- Rate limiting par IP (table `rate_limits`)
- Insertion en base Supabase
- Réponse : `{ id: "<uuid>" }`

### API GET `/api/admin/devis`

- Authentification par token Bearer (`Authorization: Bearer <token>`)
- Retour 401 si token absent ou invalide
- Tri par date décroissante
- Filtrage par statut via `?statut=nouveau|traite|archive`

### Back-office `/admin`

- Accès protégé par middleware Next.js (mot de passe statique)
- Tableau paginé (10 résultats par page)
- Changement de statut par ligne (nouveau → traité → archivé)
- Filtre par statut
- Recherche par nom ou email (debounce 300ms)
- Export CSV des demandes filtrées *(bonus)*
- Email de confirmation automatique via Resend *(bonus)*
- Indicateur du nombre de demandes des 24 dernières heures *(bonus)*

---

## Identifiants de test

| Accès | Valeur |
|---|---|
| URL back-office | `/admin` |
| Mot de passe admin | `admin1234` *(à remplacer en prod)* |
| Bearer token (API) | `test-bearer-token` *(à remplacer en prod)* |

---

## Sécurité

- Aucune donnée exposée sans authentification (pas de faille IDOR)
- `SUPABASE_SERVICE_ROLE_KEY` utilisée uniquement côté serveur (API Routes)
- `ADMIN_BEARER_TOKEN` et `ADMIN_PASSWORD` stockés en variables d'environnement
- Inputs sanitisés avant toute insertion en base

---

## Déploiement (Vercel)

```bash
vercel --prod
```

Renseigner les variables d'environnement directement dans le dashboard Vercel  
(**Settings → Environment Variables**).

---

## Choix techniques

- **App Router** plutôt que Pages Router : gestion native des Server Components et API Routes colocalisées.
- **Zod** pour partager le même schéma de validation entre le client et le serveur, sans duplication.
- **Supabase Service Role** uniquement dans les API Routes serveur pour ne jamais exposer la clé au navigateur.
- **Middleware Next.js** pour protéger `/admin` au niveau du edge, avant même le rendu de la page.

---

## Difficultés rencontrées

> *(À compléter lors de la restitution)*

---

## Auteur

> *(Votre nom)*
