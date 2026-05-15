# Devis App — Expert Hygiène 3D

Prototype de module de demande de devis en ligne avec back-office sécurisé pour une agence de désinfection/dératisation.

## 1. Lien GitHub
Code complet disponible sur : [https://github.com/votre-username/devis-3d](https://github.com/votre-username/devis-3d)

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
# Supabase (Base de données)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_publique_ici
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role_ici

# Sécurité Admin
ADMIN_PASSWORD=votre_mot_de_passe_admin_ici

# Emails (Resend)
RESEND_API_KEY=re_votre_cle_resend_ici
```

## 3. Démo en ligne
Accédez à la démonstration sur Vercel : [https://devis-3d-demo.vercel.app](https://devis-3d-demo.vercel.app) *(Lien d'exemple)*

## 4. Identifiants de test (Back-office)
Pour accéder à la gestion des devis :

- **URL** : `/admin`
- **Mot de passe** : `admin1234` (par défaut)
- **Email de test pour Resend** : `rakotoarimananahentsa@gmail.com` (Plan gratuit)
