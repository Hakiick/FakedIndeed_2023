# PROMPT AUTONOME — Rebuild FakedIndeed Mobile-First

> **Usage** : Copie-colle ce prompt ENTIER dans une nouvelle session Claude Code.
> Le working directory peut être n'importe où — le prompt gère le clone et le setup.

---

## MISSION

Tu es un orchestrateur autonome. Ta mission est de **rebuild le projet FakedIndeed** (repo GitHub : `Hakiick/FakedIndeed_2023`) en version **mobile-first** avec un effet WOW pour un portfolio.

C'est un **job board** (clone d'Indeed) développé comme projet Epitech (T-WEB-501). L'app existante est en JavaScript pur avec de graves failles de sécurité, pas de TypeScript, pas de tests, et un code incomplet. Tu vas tout reconstruire proprement.

Tu vas travailler **pendant plusieurs heures**, en totale autonomie, sans intervention humaine. Tu dois gérer toi-même ta mémoire, ton contexte, et ton workflow.

### Règles absolues

- **Tous les commits et push** vont sur le repo `Hakiick/FakedIndeed_2023`
- **Tu ne touches JAMAIS** au repo `setup-claude-code-mobile-first` — c'est un template source en lecture seule
- **Tu travailles** dans le repo `FakedIndeed_2023` (racine — c'est un projet Next.js fullstack)

### Périmètre backend / API

Le projet est un **monolithe Next.js** — frontend et API routes dans le même repo. Tu peux donc modifier le frontend ET les API routes. Le schéma MySQL est aussi modifiable.

| Cas | Autorisé ? | Exemple |
|-----|-----------|---------|
| Modifier les pages et composants | ✅ Toujours | Refaire les pages mobile-first |
| Modifier les API routes (`app/api/`) | ✅ Toujours | Sécuriser, ajouter validation, hasher les mots de passe |
| Modifier le schéma DB | ✅ Si nécessaire | Ajouter des colonnes, créer des migrations |
| Ajouter de nouvelles API routes | ✅ Si nécessaire | Route d'auth sécurisée, search, etc. |
| Changer de base de données | ❌ Non | Rester sur MySQL |
| Ajouter un ORM lourd | ❌ Non | Rester sur mysql2 (ou Drizzle si nécessaire pour les types) |

---

## ANALYSE DU PROJET EXISTANT

### Stack actuelle

- **Framework** : Next.js 13.5.4 (App Router)
- **UI** : React 18
- **Langage** : JavaScript (PAS de TypeScript)
- **Styling** : Tailwind CSS 3.3.3 + PostCSS + Autoprefixer
- **Database** : MySQL via mysql2
- **Auth** : Cookies simples (js-cookie) — pas de session/JWT
- **Icons** : react-icons
- **Email** : Nodemailer (serveur Express séparé, non fonctionnel)

### Base de données existante (MySQL)

**Table `users`** :
```sql
id INT PRIMARY KEY AUTO_INCREMENT
email VARCHAR(255)
password VARCHAR(255)      -- PLAINTEXT — À HASHER
userType VARCHAR(50)        -- individual | company | admin
name VARCHAR(255)
lastname VARCHAR(255)
phone VARCHAR(20)
website VARCHAR(255)
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

**Table `ads`** :
```sql
id INT PRIMARY KEY AUTO_INCREMENT
title VARCHAR(255)
description TEXT
jobTypes JSON               -- array de types (CDI, CDD, Stage, etc.)
minSalary INT
maxSalary INT
advantages TEXT
company VARCHAR(255)        -- FK vers company.name
location VARCHAR(255)
positionLocation VARCHAR(255)  -- On-Site | Semi-Remote | Full-Remote
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

**Table `apply`** :
```sql
id INT PRIMARY KEY AUTO_INCREMENT
ad_id INT                   -- FK vers ads.id
company_name VARCHAR(255)
name VARCHAR(255)
lastname VARCHAR(255)
email VARCHAR(255)
phone VARCHAR(20)
motivations TEXT
website VARCHAR(255)
cv VARCHAR(255)             -- NON IMPLÉMENTÉ
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

**Table `company`** :
```sql
id INT PRIMARY KEY AUTO_INCREMENT
name VARCHAR(255)
emails JSON                 -- array d'emails
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

### API routes existantes

| Route | Méthodes | Description |
|-------|----------|-------------|
| `/api/ads` | GET, POST, PUT, DELETE | CRUD annonces |
| `/api/users` | GET, POST, PUT, DELETE | CRUD utilisateurs |
| `/api/apply` | GET, POST, PUT, DELETE | CRUD candidatures |
| `/api/company` | GET, POST, PUT, DELETE | CRUD entreprises |
| `/api/companyOptions` | GET | JOIN companies ↔ users par email |

### 3 rôles utilisateur

| Feature | Individual | Company | Admin |
|---------|-----------|---------|-------|
| Parcourir les offres | ✓ | ✓ | ✓ |
| Postuler | ✓ | ✗ | ✓ |
| Publier des offres | ✗ | ✓ | ✓ |
| Gérer ses offres | ✗ | ✓ | ✓ |
| Voir les candidatures | ✗ | ✓ | ✓ |
| Panel admin | ✗ | ✗ | ✓ |
| Gérer les entreprises | ✗ | ✗ | ✓ |

### Pages existantes

| Route | Description |
|-------|-------------|
| `/` | Homepage — liste des offres (split view desktop) |
| `/account` | Saisie email → redirige vers login ou register |
| `/account/login` | Connexion (email + password) |
| `/account/register` | Inscription (individual ou company) |
| `/profile` | Profil utilisateur (édition) |
| `/addAd` | Créer une annonce (company/admin) |
| `/editAd/[id]` | Modifier une annonce |
| `/apply` | Postuler à une offre |
| `/applicants` | Voir les candidatures (company/admin) |
| `/admin` | Panel admin (gestion entreprises) |

### Problèmes critiques à corriger

1. **Mots de passe en clair** dans la DB — implémenter bcrypt
2. **Auth par cookie simple** — implémenter NextAuth.js ou JWT sécurisé
3. **Credentials en dur** dans next.config.js — migrer vers .env.local
4. **Variables undefined** (setCvFile, setNewCvFile) — bugs dans les formulaires
5. **Pas de .gitignore** — node_modules et .env exposés
6. **Dépendances inutiles** — mongodb, mongoose, axios, request, query (non utilisés)
7. **Pas de TypeScript** — tout en JS vanilla
8. **Pas de tests** — aucun test existant
9. **Upload CV non fonctionnel** — le champ existe mais rien ne se passe
10. **SMTP credentials exposées** dans le code source
11. **Pas de validation d'input** côté serveur
12. **Pas de protection CSRF/XSS**

---

## PHASE 0 : SETUP (à faire en premier, une seule fois)

### 0.1 — Cloner le projet et créer la branche

```bash
cd /home/user
git clone https://github.com/Hakiick/FakedIndeed_2023.git
cd FakedIndeed_2023
git checkout -b rebuild/mobile-first
```

### 0.2 — Copier le template mobile-first

Copie ces dossiers depuis `/home/user/setup-claude-code-mobile-first/` vers `/home/user/FakedIndeed_2023/` :

```bash
cp -r /home/user/setup-claude-code-mobile-first/.claude/ /home/user/FakedIndeed_2023/.claude/
cp -r /home/user/setup-claude-code-mobile-first/scripts/ /home/user/FakedIndeed_2023/scripts/
cp /home/user/setup-claude-code-mobile-first/CLAUDE.md /home/user/FakedIndeed_2023/CLAUDE.md
```

**NE PAS copier** : `project.md` du template, `prompts/`, `README.md`, `package.json` du template.

### 0.3 — Adapter le CLAUDE.md

Modifie le `CLAUDE.md` copié dans FakedIndeed_2023 pour remplacer la section des commandes dev par :

```
# === Dev & Build (Next.js — racine du projet) ===
cd /home/user/FakedIndeed_2023 && npm run dev       # Dev server (Next.js)
cd /home/user/FakedIndeed_2023 && npm run build     # Build production
cd /home/user/FakedIndeed_2023 && npm start          # Start production
cd /home/user/FakedIndeed_2023 && npx tsc --noEmit  # Type check
cd /home/user/FakedIndeed_2023 && npm run lint       # Lint (ESLint)
cd /home/user/FakedIndeed_2023 && npm test           # Tests (Vitest)

# Le projet est un monolithe Next.js — frontend + API routes dans le même repo.
# La base de données est MySQL — ne pas changer de SGBD.
```

Adapte aussi le `scripts/stability-check.sh` pour qu'il exécute les commandes depuis la racine du projet.

### 0.4 — Créer le project.md

Crée le fichier `/home/user/FakedIndeed_2023/project.md` avec le contenu EXACT suivant :

---

# FakedIndeed — Rebuild Mobile-First

## Project overview

Rebuild complet de FakedIndeed, un job board (clone d'Indeed) développé comme projet Epitech (T-WEB-501). L'app existante est en JavaScript avec des failles de sécurité critiques (mots de passe en clair, auth par cookie non sécurisée, credentials en dur). On rebuild tout en TypeScript strict, mobile-first, avec une auth sécurisée et un design WOW pour portfolio.

**Objectif portfolio** : Démontrer la maîtrise du développement fullstack sécurisé, du responsive mobile-first, et de l'UX moderne sur un vrai projet de job board.

## Stack technique

- **Framework** : Next.js 14 + App Router (upgrade depuis 13.5.4)
- **Langage** : TypeScript strict (migration depuis JavaScript)
- **UI** : React 18 + Tailwind CSS 3
- **Database** : MySQL via mysql2 (existant — garder)
- **Auth** : NextAuth.js (remplacement des cookies simples) OU JWT custom sécurisé
- **Hashing** : bcrypt (remplacement des mots de passe en clair)
- **Validation** : Zod (validation côté serveur et formulaires)
- **Icons** : react-icons (existant — garder)
- **Tests** : Vitest + Playwright (à configurer)
- **PWA** : Service Worker + Manifest (à ajouter)

## Architecture cible

```
FakedIndeed_2023/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── profile/page.tsx
│   │   ├── jobs/new/page.tsx
│   │   ├── jobs/[id]/edit/page.tsx
│   │   ├── applicants/page.tsx
│   │   └── admin/page.tsx
│   ├── jobs/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── ads/route.ts
│   │   ├── users/route.ts
│   │   ├── apply/route.ts
│   │   ├── company/route.ts
│   │   └── search/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   ├── MobileNav.tsx
│   │   ├── DesktopNav.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── jobs/
│   │   ├── JobCard.tsx
│   │   ├── JobList.tsx
│   │   ├── JobDetail.tsx
│   │   ├── JobFilters.tsx
│   │   └── JobForm.tsx
│   ├── apply/
│   │   ├── ApplyForm.tsx
│   │   └── ApplicantCard.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthGuard.tsx
│   ├── admin/
│   │   ├── UserTable.tsx
│   │   ├── CompanyManager.tsx
│   │   └── StatsCards.tsx
│   └── shared/
│       ├── SearchBar.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       └── OfflineBanner.tsx
├── hooks/
│   ├── useMediaQuery.ts
│   ├── useBreakpoint.ts
│   ├── useAuth.ts
│   ├── useJobs.ts
│   └── useDebounce.ts
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── validators.ts
│   └── utils.ts
├── types/
│   ├── user.ts
│   ├── job.ts
│   ├── apply.ts
│   └── company.ts
├── styles/
│   ├── design-tokens.css
│   └── animations.css
├── public/
│   ├── manifest.json
│   └── sw.js
├── scripts/
│   └── screenshots.ts
├── .env.local
├── .env.example
├── .gitignore
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── vitest.config.ts
└── package.json
```

## User Stories

### Phase 1 — Foundation & Security (haute priorité)

- [US-01] Setup TypeScript + cleanup + sécurité de base | Migrer le projet de JavaScript vers TypeScript strict. Créer tsconfig.json, renommer tous les fichiers .js en .tsx/.ts. Supprimer les dépendances inutiles (mongodb, mongoose, axios, request, query, node-sass). Créer .gitignore (node_modules, .env*, .next/). Créer .env.local et .env.example, migrer les credentials de next.config.js vers les variables d'env. Configurer le design system responsive : design tokens CSS (couleurs, typographie fluid clamp(), espacements, ombres), enrichir tailwind.config.ts avec les breakpoints mobile-first. Créer les types TypeScript de base (User, Job, Application, Company). Installer bcrypt et hasher les mots de passe dans l'API route /api/users. Installer et configurer Vitest. Ajouter la validation Zod sur les API routes existantes. | haute
  - Team: mobile-dev, stabilizer
  - Files: tsconfig.json, .gitignore, .env.example, next.config.js, tailwind.config.ts, package.json, types/*, lib/db.ts, lib/validators.ts, app/api/users/route.ts, vitest.config.ts, styles/design-tokens.css

- [US-02] Auth sécurisée + composants UI de base | Remplacer l'auth par cookie simple par NextAuth.js (ou JWT sécurisé). Implémenter : session côté serveur, middleware de protection des routes, hash bcrypt au login/register, CSRF protection. Créer les composants UI de base responsive : Button (3 tailles, touch-friendly 44px min), Card, Badge, Input (label flottant, 100% width mobile), Modal (fullscreen mobile, centered desktop), Skeleton, Toast. Créer les hooks useMediaQuery et useBreakpoint. Le design doit être moderne — palette cohérente avec accent color vibrant. | haute | après:US-01
  - Team: mobile-dev, stabilizer
  - Files: lib/auth.ts, app/api/auth/*, components/ui/*, components/auth/*, hooks/useMediaQuery.ts, hooks/useBreakpoint.ts, hooks/useAuth.ts, middleware.ts

### Phase 2 — Core Features Mobile-First (haute priorité)

- [US-03] Layout responsive + navigation mobile | Créer le système de layout dual : MobileNav.tsx avec bottom tab bar (4 onglets : Offres, Candidatures, Profil, Admin — icônes react-icons, badge notification), DesktopNav.tsx avec top navbar et liens. Sidebar de filtres rétractable sur desktop, bottom sheet sur mobile. StickyHeader avec SearchBar et avatar utilisateur. Layout.tsx switche dynamiquement entre mobile et desktop via useBreakpoint. Transitions animées entre les pages (slide horizontal mobile, fade desktop). Footer responsive. | haute | après:US-02
  - Team: mobile-dev, responsive-tester, stabilizer
  - Files: app/layout.tsx, components/layout/*, components/shared/SearchBar.tsx

- [US-04] Liste des offres mobile-first — WOW feature | C'est LA page vitrine du portfolio. Créer JobList.tsx : cards d'offres empilées sur mobile (100% width, spacing généreux), grille 2-3 colonnes sur desktop. Chaque JobCard.tsx affiche : titre (h3), entreprise, localisation, type (CDI/CDD/Stage badge coloré), remote/on-site badge, fourchette salariale, date de publication, bouton "Postuler" prominent. SearchBar en haut avec recherche par mot-clé + localisation. Filtres interactifs : type de contrat, fourchette salariale (range slider), remote/on-site, tri (récent, salaire). Sur mobile les filtres s'ouvrent en bottom sheet. Infinite scroll ou pagination. Animation stagger sur l'apparition des cards. Skeleton loading pendant le chargement. | haute | après:US-03
  - Team: mobile-dev, stabilizer
  - Files: app/jobs/page.tsx, components/jobs/JobCard.tsx, components/jobs/JobList.tsx, components/jobs/JobFilters.tsx, hooks/useJobs.ts, hooks/useDebounce.ts

- [US-05] Détail offre + postuler | Page /jobs/[id] avec le détail complet d'une offre : header avec titre, entreprise, badges (type, remote, salaire), description formatée, avantages listés, bouton "Postuler" sticky en bas sur mobile. Formulaire de candidature ApplyForm.tsx : inputs nom, prénom, email, téléphone, motivation (textarea), site web, upload CV (fonctionnel cette fois — stockage local ou base64). Pre-rempli si l'utilisateur est connecté. Validation Zod côté client et serveur. Confirmation toast après envoi. Animation slide-up du formulaire sur mobile. | haute | après:US-03
  - Team: mobile-dev, stabilizer
  - Files: app/jobs/[id]/page.tsx, components/jobs/JobDetail.tsx, components/apply/ApplyForm.tsx, app/api/apply/route.ts

### Phase 3 — Dashboard & Admin (moyenne priorité)

- [US-06] Profil utilisateur + dashboard company | Page profil responsive avec édition inline : nom, prénom, email, téléphone, site web, changement de mot de passe (avec confirmation). Pour les companies : section "Mes offres" avec liste des annonces publiées (card compact, actions edit/delete). Pour les companies : section "Candidatures reçues" avec compteur par offre et liste des candidats (ApplicantCard.tsx avec nom, email, motivation preview, lien CV). Stats en haut : nombre d'offres actives, candidatures reçues, vues. | moyenne | après:US-05
  - Team: mobile-dev, stabilizer
  - Files: app/(dashboard)/profile/page.tsx, components/apply/ApplicantCard.tsx, app/(dashboard)/applicants/page.tsx

- [US-07] Création/édition d'offre | Page /jobs/new et /jobs/[id]/edit avec JobForm.tsx responsive : inputs titre, description (textarea riche), type de contrat (multi-select), fourchette salariale (deux inputs), avantages (tags input), entreprise (auto-fill si company user), localisation, type de remote (select). Validation Zod complète. Preview de l'annonce avant publication. Sur mobile : formulaire fullscreen en étapes (wizard multi-step). Sur desktop : formulaire en une page avec sections. | moyenne | après:US-04
  - Team: mobile-dev, stabilizer
  - Files: app/(dashboard)/jobs/new/page.tsx, app/(dashboard)/jobs/[id]/edit/page.tsx, components/jobs/JobForm.tsx

- [US-08] Panel admin responsive | Page /admin avec tabs : Utilisateurs, Entreprises, Offres, Statistiques. UserTable.tsx : sur mobile → cards empilées avec infos clés + expand pour détails, sur desktop → table avec tri et pagination. CompanyManager.tsx : CRUD entreprises avec modal. StatsCards.tsx : compteurs animés (users, jobs, applications, companies). Filtres en bottom sheet sur mobile, sidebar sur desktop. Actions : bloquer/débloquer user, supprimer offre, associer user à company. | moyenne | après:US-06
  - Team: mobile-dev, stabilizer
  - Files: app/(dashboard)/admin/page.tsx, components/admin/*

### Phase 4 — PWA + Polish (moyenne priorité)

- [US-09] PWA + mode offline | Configurer le service worker : Cache First pour assets (CSS, JS, images), Network First pour les appels API, Stale While Revalidate pour les logos. Mode offline : afficher les dernières offres consultées depuis le cache, banner "Vous êtes hors ligne" avec OfflineBanner.tsx. manifest.json complet avec icônes 192px et 512px, theme_color bleu (#2557a7), background_color blanc. Hook useOnline pour détecter le statut réseau. Install prompt natif avec bouton custom. | moyenne | après:US-05
  - Team: pwa-dev, stabilizer
  - Files: public/manifest.json, public/sw.js, components/shared/OfflineBanner.tsx, hooks/useOnline.ts, app/layout.tsx

- [US-10] Animations, micro-interactions + polish a11y + Lighthouse | Transitions de page (slide mobile, crossfade desktop). Stagger animation sur les listes de JobCards. Boutons avec feedback ripple au tap. Compteurs animés sur les stats admin. Loading skeletons pulsants. Pull-to-refresh sur mobile. TOUTES les animations GPU-accelerated (transform, opacity uniquement). Audit WCAG AA complet : contraste 4.5:1, aria-label sur tous les boutons/icônes, focus visible, tab order logique, touch targets >= 44x44px. Tester chaque page sur 375px, 390px, 768px, 1024px, 1440px. Lighthouse > 90 mobile sur les 4 métriques. | moyenne | après:US-09
  - Team: responsive-tester, reviewer, stabilizer
  - Files: styles/animations.css, tous les composants

## SEO & Performance cibles

- Viewport meta : `width=device-width, initial-scale=1, viewport-fit=cover`
- `100dvh` pour les layouts full-height
- `env(safe-area-inset-*)` pour les notchs iPhone
- Lighthouse mobile > 90 sur Performance, Accessibility, Best Practices, SEO
- Bundle < 200KB gzipped (initial load)
- LCP < 2.5s, FID < 100ms, CLS < 0.1
- Images lazy-loaded avec dimensions explicites
- Fonts preloaded

---

### 0.5 — Créer le board.md de coordination

Écris le fichier `.claude/board.md` dans le projet avec :

```markdown
# Board — FakedIndeed Rebuild Mobile-First

## Projet
- **Nom** : FakedIndeed Rebuild
- **Repo** : Hakiick/FakedIndeed_2023
- **Branche base** : rebuild/mobile-first
- **Objectif** : Rebuild job board mobile-first sécurisé pour portfolio

## US Courante
- **US** : (en attente)
- **Branche** : —
- **Statut** : —
- **Équipe** : —

## Plan d'exécution
1. US-01 : Setup TS + sécurité (mobile-dev, stabilizer)
2. US-02 : Auth sécurisée + UI base (mobile-dev, stabilizer)
3. US-03 : Layout + nav mobile (mobile-dev, responsive-tester, stabilizer)
4. US-04 : Liste offres WOW (mobile-dev, stabilizer)
5. US-05 : Détail offre + postuler (mobile-dev, stabilizer)
6. US-06 : Profil + dashboard company (mobile-dev, stabilizer)
7. US-07 : Création/édition offre (mobile-dev, stabilizer)
8. US-08 : Admin panel (mobile-dev, stabilizer)
9. US-09 : PWA offline (pwa-dev, stabilizer)
10. US-10 : Animations + a11y + Lighthouse (responsive-tester, reviewer, stabilizer)

## Décisions techniques
- Monolithe Next.js : frontend + API routes dans le même repo
- Migration JS → TypeScript strict
- MySQL via mysql2 : garder, sécuriser les requêtes
- Auth : NextAuth.js (ou JWT custom sécurisé) — remplacer les cookies simples
- Passwords : bcrypt (remplacer le stockage en clair)
- Validation : Zod partout (client + serveur)
- Dépendances inutiles supprimées : mongodb, mongoose, axios, request, query, node-sass
- .env.local pour les credentials (jamais en dur dans le code)
- Tailwind CSS : enrichir, pas remplacer

## Journal
(agents : ajoutez ici vos messages au fur et à mesure)

## US Terminées
(vide)
```

### 0.6 — Premier commit et push

```bash
cd /home/user/FakedIndeed_2023
git add .claude/ scripts/ CLAUDE.md project.md .gitignore
git commit -m "chore(setup): add mobile-first rebuild template and project definition"
git push -u origin rebuild/mobile-first
```

### 0.7 — Vérifier la stabilité initiale

```bash
cd /home/user/FakedIndeed_2023
npm install
npm run build
```

Si le build échoue, corrige AVANT de continuer. Le projet doit être stable (le build JS existant doit au minimum passer avant de commencer la migration TS).

---

## PHASE 1+ : EXÉCUTION AUTONOME — BOUCLE DES 10 US

Maintenant tu passes en mode orchestrateur. Répète ce workflow pour chaque US, de 01 à 10, dans l'ordre.

### Pour chaque US :

#### 1. Vérifier l'éligibilité
Vérifie que les US dépendantes sont terminées (cf. `après:US-XX` dans project.md).
Tu peux aussi utiliser `bash scripts/check-us-eligibility.sh <numero>` si le script est adapté.

#### 2. Créer la branche feature
```bash
git checkout rebuild/mobile-first
git pull origin rebuild/mobile-first
git checkout -b feat/<scope>/<description-kebab>
git push -u origin feat/<scope>/<description-kebab>
```

Noms de branches :
- US-01 → `feat/setup/typescript-security`
- US-02 → `feat/auth/secure-auth-ui-base`
- US-03 → `feat/layout/responsive-nav-mobile`
- US-04 → `feat/jobs/job-list-wow`
- US-05 → `feat/jobs/detail-apply`
- US-06 → `feat/dashboard/profile-company`
- US-07 → `feat/jobs/create-edit-form`
- US-08 → `feat/admin/responsive-panel`
- US-09 → `feat/pwa/offline-first`
- US-10 → `feat/polish/animations-a11y-lighthouse`

#### 3. Mettre à jour board.md
Renseigne la US courante, la branche, le statut "in-progress", l'équipe.

#### 4. Implémenter avec `/forge` (mode team agents — OBLIGATOIRE)

**YOU MUST** utiliser `/forge` pour chaque US. C'est le mode team agents : le forge décompose la US, lance les agents spécialisés, orchestre les boucles de feedback, et livre stable.

```bash
/forge
```

Le forge va automatiquement :
1. Décomposer la US en sous-tâches
2. Lancer les agents spécialisés (mobile-dev, responsive-tester, pwa-dev, etc.)
3. Dispatcher les tâches aux agents
4. Collecter les résultats
5. Gérer les boucles de feedback (test → fix → re-test)
6. Stabiliser avant de rendre la main

**Agents disponibles par US** :
- **mobile-dev** : Développeur mobile-first (toutes les US)
- **responsive-tester** : Testeur multi-viewports (US-03, US-10)
- **pwa-dev** : Spécialiste PWA (US-09)
- **reviewer** : Revue qualité (US-10)
- **stabilizer** : Build + lint + type-check (toutes les US)

**Boucles de feedback gérées par le forge** :
- Tester trouve un bug → retour au mobile-dev → max **3 boucles**
- Reviewer trouve un problème → retour au mobile-dev → max **2 boucles**
- Stabilizer échoue → fix et re-run → max **5 boucles**

**Si le forge n'est pas disponible** (fallback linéaire) :
Utilise les skills individuellement dans cet ordre : `/architect` → `/mobile-dev` → `/responsive-tester` → `/reviewer` → `/stabilizer`

#### 5. Commits atomiques au fur et à mesure
Format : `type(scope): description courte`

Exemples :
```
chore(setup): migrate project to TypeScript strict
feat(auth): add NextAuth.js with bcrypt password hashing
feat(ui): add responsive Button with 3 sizes and touch feedback
feat(ui): add Card component with hover and tap variants
feat(layout): add MobileNav with bottom tab bar
feat(layout): add DesktopNav with top navbar
feat(jobs): add JobCard with salary, badges, and location
feat(jobs): add JobList with search, filters, and infinite scroll
feat(jobs): add JobDetail with sticky apply button
feat(apply): add ApplyForm with Zod validation and CV upload
feat(dashboard): add company stats and applicant cards
feat(admin): add responsive user table and company manager
feat(pwa): add service worker with cache-first strategy
perf(ui): add stagger animations on card lists
a11y(ui): add ARIA labels to all interactive elements
fix(security): hash existing plaintext passwords in migration
```

#### 6. Capturer des screenshots pour le portfolio

**YOU MUST** prendre des screenshots après chaque US visuelle (toutes sauf US-01 et US-09).

Crée un script Playwright de capture dans `scripts/screenshots.ts` lors de la US-03, puis réutilise-le à chaque US.

**Setup (à faire une fois dans US-03)** :
```bash
cd /home/user/FakedIndeed_2023
npx playwright install chromium
```

**Script de capture** (`scripts/screenshots.ts`) :
```typescript
import { chromium } from 'playwright';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const PAGES = [
  { name: 'jobs', path: '/jobs' },
  { name: 'job-detail', path: '/jobs/1' },
  { name: 'login', path: '/login' },
  { name: 'profile', path: '/profile' },
  { name: 'admin', path: '/admin' },
];

async function capture() {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    for (const p of PAGES) {
      try {
        await page.goto(`http://localhost:3000${p.path}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: `screenshots/${p.name}-${vp.name}.png`,
          fullPage: false,
        });
        console.log(`OK ${p.name}-${vp.name}.png`);
      } catch (e) {
        console.log(`SKIP ${p.name}-${vp.name} — page not ready`);
      }
    }
    await context.close();
  }
  // Vidéo de la feature principale (Jobs list) — mobile
  const videoCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    recordVideo: { dir: 'screenshots/videos/', size: { width: 375, height: 812 } },
  });
  const videoPage = await videoCtx.newPage();
  try {
    await videoPage.goto('http://localhost:3000/jobs', { waitUntil: 'networkidle' });
    await videoPage.waitForTimeout(2000);
    await videoPage.evaluate(() => window.scrollBy(0, 500));
    await videoPage.waitForTimeout(1000);
    const jobCard = videoPage.locator('[data-testid="job-card"]').first();
    if (await jobCard.isVisible()) {
      await jobCard.click();
      await videoPage.waitForTimeout(2000);
    }
  } catch (e) {
    console.log('Video capture: jobs page not ready, skipped interaction');
  }
  await videoCtx.close();
  await browser.close();
  console.log('\nScreenshots saved in screenshots/');
  console.log('Video saved in screenshots/videos/');
}

capture();
```

**Quand capturer** :
- Après chaque US visuelle terminée et stabilisée
- AVANT le rebase/merge (comme ça les screenshots sont dans la branche)
- Le dev server doit tourner (`npm run dev` en background)

```bash
cd /home/user/FakedIndeed_2023 && npm run dev &
sleep 5
cd /home/user/FakedIndeed_2023 && npx tsx scripts/screenshots.ts
kill %1
```

**Committer les screenshots** avec chaque US :
```
docs(screenshots): capture US-XX responsive screenshots
```

#### 7. Stabiliser
```bash
cd /home/user/FakedIndeed_2023 && npm run build && npx tsc --noEmit
```
Ou si le script est adapté : `bash scripts/stability-check.sh`

**NE PASSE PAS** à l'étape suivante si la stabilité échoue.

#### 8. Rebase + push
```bash
git fetch origin rebuild/mobile-first
git rebase origin/rebuild/mobile-first
# Re-vérifier la stabilité après rebase
cd /home/user/FakedIndeed_2023 && npm run build
git push --force-with-lease origin feat/<scope>/<description>
```

#### 9. Merger dans la branche base
```bash
git checkout rebuild/mobile-first
git merge feat/<scope>/<description>
git push origin rebuild/mobile-first
git branch -d feat/<scope>/<description>
git push origin --delete feat/<scope>/<description>
```

#### 10. Mettre à jour board.md
- Déplace la US dans "US Terminées" avec la date et un résumé
- Ajoute une entrée dans "Journal"
- Vide la section "US Courante"

#### 11. Nettoyage contexte
Si le contexte devient lourd après 2-3 US, utilise `/compact`. Après un compact, relis en priorité :
1. `board.md` (ta mémoire persistante)
2. `project.md` (les US restantes)
3. Le fichier que tu étais en train de modifier

#### → Retour à l'étape 1 pour la US suivante.

---

## RÈGLES D'AUTONOMIE

### Mémoire persistante
- **`.claude/board.md`** est ta mémoire. Mets-le à jour SYSTÉMATIQUEMENT.
- Après chaque US terminée → résumé dans board.md
- Après chaque `/compact` → relis board.md en premier
- Le board.md est committé avec les changements de chaque US

### Gestion des erreurs

| Problème | Solution | Max tentatives |
|----------|----------|----------------|
| Build échoue | Lis les logs, corrige le code, re-build | 5 |
| Tests échouent | Corrige le CODE, pas le test | 3 |
| Type-check échoue | Corrige les types, ajoute les types manquants | 5 |
| Conflit rebase | Résous manuellement, `git add` + `git rebase --continue` | 2, sinon `--abort` et recommence |
| npm install échoue | Vérifie package.json, supprime node_modules et réessaie | 3 |
| MySQL connection échoue | Vérifie .env.local, vérifie que MySQL tourne | 3 |
| Auth NextAuth échoue | Vérifie la config, les providers, les callbacks | 3 |
| Migration DB échoue | Vérifie le schéma, les contraintes FK | 3 |

### INTERDIT

- Changer de base de données (rester sur MySQL)
- Utiliser `git push --force` (uniquement `--force-with-lease`)
- Utiliser `git merge` pour intégrer main (uniquement `rebase`)
- Désactiver un test ou une règle lint
- Ajouter `console.log` en production
- Utiliser `any` en TypeScript
- Committer des fichiers `.env` ou secrets
- Stocker des mots de passe en clair
- Toucher au repo `setup-claude-code-mobile-first`

### OBLIGATOIRE

- Tous les commits sur `Hakiick/FakedIndeed_2023`
- TypeScript strict — pas de `any`
- Mots de passe hashés avec bcrypt
- Auth sécurisée (NextAuth.js ou JWT)
- Validation Zod sur toutes les API routes
- CSS mobile-first (base = mobile, `min-width` pour les breakpoints)
- Touch targets >= 44x44px
- Animations GPU-only (`transform`, `opacity`)
- Commits atomiques format `type(scope): description`
- Stability check AVANT chaque push
- board.md à jour à chaque changement d'état
- .env.local pour TOUTES les credentials

---

## VISION WOW — Ce qui doit impressionner un recruteur

### La liste d'offres (US-04) — Pièce maîtresse
C'est la première chose qu'on verra dans le portfolio. Elle doit être SPECTACULAIRE :
- Cards d'offres avec design moderne (ombres douces, coins arrondis, badges colorés)
- Animation stagger à l'apparition (chaque card slide-in 50ms après la précédente)
- Search bar proéminente avec autocomplete
- Filtres interactifs en bottom sheet sur mobile
- Infinite scroll fluide avec skeleton loading
- Transition vers le détail d'offre (slide-left sur mobile)

### Le formulaire de candidature (US-05)
- Slide-up animé depuis le bouton "Postuler"
- Inputs avec labels flottants et validation inline temps réel
- Upload CV fonctionnel avec preview du nom de fichier
- Confirmation toast satisfying après envoi

### Le dashboard company (US-06)
- Stats animées avec count-up de 0 à la valeur
- Cards candidats avec information bien organisée
- Actions swipe sur mobile (accepter/rejeter)

### Le panel admin (US-08)
- Tables qui se transforment en cards sur mobile
- Transitions fluides entre les tabs
- Recherche et filtres instantanés

### L'ensemble du design
- Palette moderne : bleu Indeed-like comme accent (#2557a7), fond clair, texte sombre
- Typographie fluid (clamp() pour le sizing)
- Espacement généreux sur mobile
- Composants arrondis, ombres douces, clean
- Animations subtiles mais satisfying partout

---

## CRITÈRES DE SUCCÈS FINAUX

Le projet est terminé quand TOUTES ces conditions sont remplies :

1. Les 10 US sont mergées dans `rebuild/mobile-first`
2. `npm run build` passe sans erreur
3. `npx tsc --noEmit` passe sans erreur (TypeScript strict)
4. Aucun mot de passe en clair dans la DB (bcrypt partout)
5. Auth sécurisée fonctionnelle (NextAuth.js ou JWT)
6. Validation Zod sur toutes les API routes
7. L'app est responsive de 375px à 1440px (pas de overflow, pas de layout cassé)
8. Touch targets >= 44x44px sur toutes les interactions
9. Animations fluides à 60fps (GPU-accelerated)
10. PWA installable avec mode offline basique
11. WCAG AA respecté (contraste, ARIA, focus visible)
12. Le board.md reflète les 10 US terminées avec résumés
13. Screenshots capturés (mobile, tablet, desktop) dans `screenshots/`
14. Vidéo de l'interaction job browse capturée dans `screenshots/videos/`
15. .gitignore en place, aucun secret committé
16. L'effet WOW est là — la liste d'offres est spectaculaire

---

## RAPPEL FINAL

1. Exécute la Phase 0 (setup complet)
2. Lance la boucle des US (Phase 1+)
3. Travaille en autonomie totale — ne t'arrête pas
4. Mets à jour board.md après chaque US
5. Ne t'arrête que quand les 10 US sont done et les critères de succès validés

**Commence maintenant. Go.**
