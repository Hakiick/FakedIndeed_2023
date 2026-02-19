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

- [US-05] Détail offre + postuler | Page /jobs/[id] avec le détail complet d'une offre : header avec titre, entreprise, badges (type, remote, salaire), description formatée, avantages listés, bouton "Postuler" sticky en bas sur mobile. Formulaire de candidature ApplyForm.tsx : inputs nom, prénom, email, téléphone, motivation (textarea), site web, upload CV (fonctionnel — stockage local ou base64). Pre-rempli si l'utilisateur est connecté. Validation Zod côté client et serveur. Confirmation toast après envoi. Animation slide-up du formulaire sur mobile. | haute | après:US-03
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

## Database schema (MySQL existant)

### Table `users`
```sql
id INT PRIMARY KEY AUTO_INCREMENT
email VARCHAR(255)
password VARCHAR(255)      -- PLAINTEXT → À HASHER avec bcrypt
userType VARCHAR(50)       -- individual | company | admin
name VARCHAR(255)
lastname VARCHAR(255)
phone VARCHAR(20)
website VARCHAR(255)
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

### Table `ads`
```sql
id INT PRIMARY KEY AUTO_INCREMENT
title VARCHAR(255)
description TEXT
jobTypes JSON              -- array de types (CDI, CDD, Stage, etc.)
minSalary INT
maxSalary INT
advantages TEXT
company VARCHAR(255)       -- FK vers company.name
location VARCHAR(255)
positionLocation VARCHAR(255)  -- On-Site | Semi-Remote | Full-Remote
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

### Table `apply`
```sql
id INT PRIMARY KEY AUTO_INCREMENT
ad_id INT                  -- FK vers ads.id
company_name VARCHAR(255)
name VARCHAR(255)
lastname VARCHAR(255)
email VARCHAR(255)
phone VARCHAR(20)
motivations TEXT
website VARCHAR(255)
cv VARCHAR(255)            -- NON IMPLÉMENTÉ → À IMPLÉMENTER
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

### Table `company`
```sql
id INT PRIMARY KEY AUTO_INCREMENT
name VARCHAR(255)
emails JSON                -- array d'emails
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## Rôles utilisateur

| Feature | Individual | Company | Admin |
|---------|-----------|---------|-------|
| Parcourir les offres | ✓ | ✓ | ✓ |
| Postuler | ✓ | ✗ | ✓ |
| Publier des offres | ✗ | ✓ | ✓ |
| Gérer ses offres | ✗ | ✓ | ✓ |
| Voir les candidatures | ✗ | ✓ | ✓ |
| Panel admin | ✗ | ✗ | ✓ |
| Gérer les entreprises | ✗ | ✗ | ✓ |

## SEO & Performance cibles

- Viewport meta : `width=device-width, initial-scale=1, viewport-fit=cover`
- `100dvh` pour les layouts full-height
- `env(safe-area-inset-*)` pour les notchs iPhone
- Lighthouse mobile > 90 sur Performance, Accessibility, Best Practices, SEO
- Bundle < 200KB gzipped (initial load)
- LCP < 2.5s, FID < 100ms, CLS < 0.1
- Images lazy-loaded avec dimensions explicites
- Fonts preloaded

## Design vision

- Palette moderne : bleu Indeed-like (#2557a7) comme accent, fond clair, texte sombre
- Typographie fluid (clamp() pour le sizing)
- Espacement généreux sur mobile
- Composants arrondis, ombres douces, clean
- Animations subtiles mais satisfying partout
