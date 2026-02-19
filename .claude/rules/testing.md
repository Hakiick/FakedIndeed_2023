---
paths:
  - "**/*.test.{ts,tsx}"
  - "**/*.spec.{ts,tsx}"
  - "tests/**/*"
  - "vitest.config.*"
  - "playwright.config.*"
---

# Conventions de test — Vitest + Playwright

## Framework

- **Tests unitaires** : Vitest (compatible Jest API, rapide, ESM natif)
- **Tests E2E** : Playwright (multi-viewports, touch events)
- **Fichiers de test** : `*.test.ts` ou `*.test.tsx` à côté du fichier testé

## Structure des tests

```
components/
  ui/
    Button.tsx
    Button.test.tsx        ← Test unitaire du composant
hooks/
  useAuth.ts
  useAuth.test.ts          ← Test unitaire du hook
lib/
  validators.ts
  validators.test.ts       ← Test des schémas Zod
app/api/
  ads/
    route.ts
    route.test.ts          ← Test de l'API route
tests/
  e2e/
    jobs.spec.ts           ← Test E2E Playwright
    auth.spec.ts
    responsive.spec.ts     ← Tests multi-viewports
```

## Règles de test

- **YOU MUST** tester les schémas Zod (validation valide + invalide)
- **YOU MUST** tester les API routes (réponses correctes, erreurs, edge cases)
- **YOU MUST** tester les composants UI avec les props variants
- **YOU MUST** tester le responsive sur 3 viewports minimum (375px, 768px, 1440px)
- **YOU MUST NOT** mocker ce qui peut être testé directement
- **YOU MUST NOT** désactiver un test pour "faire passer" la suite
- **YOU MUST NOT** utiliser `any` dans les tests — typer correctement

## Naming

```typescript
describe('JobCard', () => {
  it('renders job title and company name', () => {});
  it('displays salary range when provided', () => {});
  it('shows apply button for individual users', () => {});
  it('hides apply button for company users', () => {});
});
```

## Tests Responsive (Playwright)

```typescript
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const vp of VIEWPORTS) {
  test(`job list renders correctly on ${vp.name}`, async ({ page }) => {
    await page.setViewportSize(vp);
    // ...
  });
}
```

## Ce qu'on teste

| Catégorie | Quoi tester | Outil |
|-----------|-------------|-------|
| Validation | Schémas Zod (inputs valides/invalides) | Vitest |
| API Routes | GET/POST/PUT/DELETE, erreurs, auth | Vitest |
| Composants | Rendu, props, interactions | Vitest + Testing Library |
| Hooks | State management, side effects | Vitest |
| Responsive | Layout à chaque breakpoint | Playwright |
| Touch | Touch targets ≥ 44px | Playwright |
| Accessibilité | ARIA, contraste, focus | Playwright |
| Auth | Login, register, protection routes | Playwright |

## Commandes

```bash
npm test                # Vitest (unitaires)
npm run test:e2e        # Playwright (E2E)
npm run test:coverage   # Vitest avec couverture
```
