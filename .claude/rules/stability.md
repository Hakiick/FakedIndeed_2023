---
paths:
  - "app/**/*.{ts,tsx,js,jsx}"
  - "components/**/*.{ts,tsx,js,jsx}"
  - "hooks/**/*.{ts,tsx}"
  - "lib/**/*.{ts,tsx}"
  - "types/**/*.ts"
  - "package.json"
  - "tsconfig.json"
  - "next.config.js"
---

# Règles de stabilité — FakedIndeed

## Checks obligatoires

Après **toute modification de code**, ces 4 checks doivent passer :

```bash
# 1. Build production
npm run build

# 2. Tests unitaires
npm test

# 3. Lint
npm run lint

# 4. Type check TypeScript strict
npx tsc --noEmit
```

Ou en une commande : `bash scripts/stability-check.sh`

## Règles strictes

- **YOU MUST** lancer le stability check AVANT tout push
- **YOU MUST** re-lancer le stability check APRÈS chaque rebase
- **YOU MUST NOT** désactiver un test existant pour "faire passer" une feature
- **YOU MUST NOT** supprimer une règle lint sans justification documentée
- **YOU MUST NOT** ajouter `// @ts-ignore` ou `// @ts-nocheck`
- **YOU MUST NOT** utiliser `any` pour contourner une erreur TypeScript
- **YOU MUST NOT** merger dans main si le stability check échoue

## Chaque feature doit être stable AVANT de passer à la suivante

- Le build passe sans erreur
- Les tests passent à 100%
- Le linter ne remonte pas d'erreur
- TypeScript strict compile sans erreur
- Le serveur dev démarre sans erreur

## Lighthouse

- Score mobile cible : > 90 sur les 4 métriques
- Vérifier après chaque feature visuelle (US-02 à US-10)
- Core Web Vitals : LCP < 2.5s, FID < 100ms, CLS < 0.1

## Gestion des erreurs de stabilité

| Erreur | Action |
|--------|--------|
| Build échoue | Corriger le code, re-build — max 5 tentatives |
| Tests échouent | Corriger le CODE pas le test — max 3 tentatives |
| Type-check échoue | Corriger les types — max 5 tentatives |
| Lint échoue | Corriger le code ou le style — max 3 tentatives |
| > max tentatives | Alerter l'utilisateur |
