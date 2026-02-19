---
paths:
  - "app/**/*.{ts,tsx}"
  - "components/**/*.{ts,tsx}"
  - "hooks/**/*.ts"
  - "lib/**/*.ts"
  - "types/**/*.ts"
---

# Architecture — Next.js 14 App Router + MySQL

## Structure projet

```
app/              → Pages et API routes (App Router)
components/       → Composants React (pas dans app/)
  ui/             → Composants UI réutilisables (Button, Card, Badge, Input, Modal, Skeleton, Toast)
  layout/         → Layout, Nav, Footer, Sidebar
  jobs/           → Composants métier offres d'emploi
  apply/          → Composants candidature
  auth/           → Composants authentification
  admin/          → Composants panel admin
  shared/         → Composants partagés (SearchBar, EmptyState, ErrorBoundary, OfflineBanner)
hooks/            → Custom hooks React
lib/              → Utilitaires serveur (db, auth, validators)
types/            → Types TypeScript partagés
styles/           → Design tokens CSS, animations
public/           → Assets statiques, manifest PWA, service worker
```

## Conventions Next.js App Router

- **Route groups** : `(auth)` pour les pages d'auth, `(dashboard)` pour les pages protégées
- **Server Components par défaut** — n'utilise `"use client"` que si nécessaire (state, effects, events)
- **API Routes** dans `app/api/` — une `route.ts` par endpoint avec handlers GET/POST/PUT/DELETE
- **Metadata** : utilise `generateMetadata()` pour le SEO dynamique
- **Loading** : crée `loading.tsx` pour les skeleton screens
- **Error** : crée `error.tsx` pour la gestion d'erreurs

## Règles d'architecture

- **YOU MUST** séparer les composants de `app/` — les pages ne contiennent que l'assemblage, la logique est dans `components/`
- **YOU MUST** typer tous les props avec des interfaces exportées depuis `types/`
- **YOU MUST** centraliser la connexion DB dans `lib/db.ts` — un seul pool de connexions
- **YOU MUST** centraliser la validation dans `lib/validators.ts` avec des schémas Zod
- **YOU MUST** centraliser l'auth dans `lib/auth.ts`
- **YOU MUST NOT** importer des modules serveur (mysql2, bcrypt, fs) dans les composants client
- **YOU MUST NOT** dupliquer la logique — un composant fait UNE chose
- **YOU MUST NOT** hardcoder des données dans les composants — utilise `types/` et les API routes

## Patterns imposés

### API Routes
```typescript
// app/api/ads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adSchema } from '@/lib/validators';
import { getPool } from '@/lib/db';

export async function GET(req: NextRequest) {
  // 1. Parse query params
  // 2. Validate with Zod
  // 3. Query DB
  // 4. Return typed response
}
```

### Composants
```typescript
// components/jobs/JobCard.tsx
import type { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: number) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  // Server component par défaut — pas de "use client" sauf si events
}
```

### Hooks
```typescript
// hooks/useJobs.ts
"use client";
import { useState, useEffect } from 'react';
import type { Job } from '@/types/job';

export function useJobs(filters?: JobFilters) {
  // Fetch + state + error handling
}
```

## Database

- **MySQL via mysql2** — garder, ne pas changer de SGBD
- **Connection pool** : un seul pool dans `lib/db.ts`, réutilisé partout
- **Pas d'ORM lourd** — requêtes SQL directes avec mysql2, types TypeScript manuels
- **Parameterized queries** obligatoires — jamais de concaténation de strings SQL
- **Transactions** pour les opérations multi-tables

## Authentification

- **NextAuth.js** ou **JWT custom sécurisé** — remplacer les cookies simples (js-cookie)
- **bcrypt** pour le hashing des mots de passe — jamais de plaintext
- **Middleware Next.js** (`middleware.ts`) pour protéger les routes dashboard/admin
- **3 rôles** : individual, company, admin — vérification côté serveur obligatoire

## Mobile-First Architecture

- **Composants responsive par design** — base mobile, enrichissement desktop
- **Layout dual** : MobileNav (bottom tab bar) + DesktopNav (top navbar)
- **Switch dynamique** via `useBreakpoint` hook
- **Bottom sheet** sur mobile pour les modals et filtres
- **Sticky elements** : header, bouton Postuler
