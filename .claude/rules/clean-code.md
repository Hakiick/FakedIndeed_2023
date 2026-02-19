---
paths:
  - "app/**/*.{ts,tsx}"
  - "components/**/*.{ts,tsx}"
  - "hooks/**/*.ts"
  - "lib/**/*.ts"
  - "types/**/*.ts"
---

# Règles Clean Code — Next.js 14 + TypeScript + Tailwind

## TypeScript strict

- **YOU MUST** activer `strict: true` dans tsconfig.json
- **YOU MUST NOT** utiliser `any` — utilise des types stricts, `unknown`, ou des generics
- **YOU MUST** typer tous les props de composants avec des interfaces
- **YOU MUST** exporter les types depuis `types/` pour les réutiliser
- **YOU MUST** utiliser `satisfies` pour la validation de type à la définition

## Fonctions et composants

- Fonctions courtes et focalisées (< 50 lignes)
- Un composant = une responsabilité
- Nommage explicite : `JobCard`, pas `JC` ou `Item`
- Pas d'abréviations cryptiques : `application`, pas `app` (sauf les conventions Next.js)
- Early return pour les cas d'erreur

## Imports

```typescript
// 1. Modules externes
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 2. Types
import type { Job } from '@/types/job';

// 3. Modules internes
import { getPool } from '@/lib/db';
import { jobSchema } from '@/lib/validators';

// 4. Composants
import { Button } from '@/components/ui/Button';
```

## Mobile-First CSS avec Tailwind

- **YOU MUST** écrire les classes mobile en premier (sans préfixe de breakpoint)
- **YOU MUST** utiliser les préfixes `sm:`, `md:`, `lg:`, `xl:` pour les breakpoints supérieurs
- **YOU MUST NOT** utiliser de media queries `max-width` dans le CSS custom
- **YOU MUST** utiliser `rem` ou `em` pour les tailles, jamais `px` pour le texte

```tsx
// Mobile-first : base = mobile, enrichissement progressif
<div className="px-4 py-3 md:px-6 lg:px-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl">Titre</h1>
</div>
```

## Accessibilité

- **YOU MUST** ajouter `aria-label` sur les éléments interactifs sans texte visible
- **YOU MUST** utiliser les éléments HTML sémantiques (`nav`, `main`, `section`, `article`, `header`, `footer`)
- **YOU MUST** garantir un contraste WCAG AA (4.5:1 texte normal, 3:1 grands textes)
- **YOU MUST** rendre la navigation au clavier fonctionnelle (focus visible)
- **YOU MUST** fournir `alt` text sur toutes les images
- **YOU MUST** garantir des touch targets ≥ 44x44px sur mobile

## Sécurité

- **YOU MUST** utiliser des parameterized queries SQL — jamais de concaténation
- **YOU MUST** valider les inputs avec Zod côté serveur (API routes)
- **YOU MUST** hasher les mots de passe avec bcrypt (jamais de plaintext)
- **YOU MUST** protéger les routes avec le middleware Next.js
- **YOU MUST NOT** exposer des credentials dans le code source
- **YOU MUST NOT** logger des données sensibles (passwords, tokens)

## Performance

- Animations GPU-accelerated uniquement (`transform`, `opacity`)
- Pas de layout shift — dimensions explicites sur images et vidéos
- Lazy-loading des images hors viewport (`loading="lazy"`)
- `"use client"` seulement quand nécessaire
- Pas de `console.log` en production
- Pas de code commenté — supprimer ou créer une issue

## Interdit

- `any` en TypeScript
- `console.log` en production
- Code commenté
- `// @ts-ignore` ou `// @ts-nocheck`
- Passwords en clair
- Credentials dans le code source
- SQL injection (concaténation)
- `max-width` media queries
