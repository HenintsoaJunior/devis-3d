# Devis App — Expert Hygiène 3D

Prototype de module de demande de devis en ligne avec back-office sécurisé pour une agence de désinfection/dératisation.

## 1. Lien GitHub
Code complet disponible sur : https://github.com/HenintsoaJunior/devis-3d.git

## 2. Installation et Lancement

### Prérequis
- Node.js >= 18
- Un compte Supabase (Base de données PostgreSQL)

### Instructions
```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev
```

### Configuration (.env.example)
Copiez le fichier `.env.example` en `.env.local` et remplissez les variables suivantes :

```env
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://demo-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_demoKey123456

# Public anonymous key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demoAnonKey

# Server-side secret key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demoServiceRoleKey

# Static admin token for protected API
ADMIN_BEARER_TOKEN=demo-admin-token

# Admin dashboard password
ADMIN_PASSWORD=admin

# Resend email API key
RESEND_API_KEY=re_demoApiKey123
```

## 3. Démo en ligne
Accédez à la démonstration sur Vercel : [https://devis-3d.vercel.app](https://devis-3d.vercel.app)

## 4. Identifiants de test (Back-office)
Pour accéder à la gestion des devis :

- **URL** : `/admin`
- **Mot de passe** : `admin` (par défaut)
- **Email de test pour Resend** : `rakotoarimananahentsa@gmail.com` (Plan gratuit)
