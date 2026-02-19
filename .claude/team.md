# Équipe Agentique — FakedIndeed Rebuild

> Auto-généré par `/init-project` le 2026-02-19.

## Agents core

### `forge`
**Rôle** : Team Lead — orchestre les agents, décompose les US, gère les feedback loops
**Modèle** : **Opus 4.6** (obligatoire)
**Toujours présent** : oui (orchestrateur principal)

### `stabilizer`
**Rôle** : Quality gate — build, tests, lint, type-check
**Modèle** : **Sonnet 4.6**
**Toujours présent** : oui (toujours en dernier dans le pipeline)
**Commandes** :
- `bash scripts/stability-check.sh`
- `npm run build`
- `npx tsc --noEmit`
- `npm test`
- `npm run lint`

### `reviewer`
**Rôle** : Revue de code qualité + sécurité + accessibilité
**Modèle** : **Sonnet 4.6**
**Quand** : US de priorité haute ou touchant un domaine critique
**Focus** : OWASP Top 10, WCAG AA, règles `.claude/rules/`

---

## Agents spécialisés mobile-first

### `mobile-dev`
**Rôle** : Développeur mobile-first — responsive, touch, viewport, performance
**Modèle** : **Sonnet 4.6**
**Skill** : `/mobile-dev`
**Présent dans** : US-01 à US-08
**Responsabilités** :
- Composants avec CSS mobile-first (min-width, Tailwind prefixes)
- Touch interactions (44x44px min, Pointer Events API)
- Performance mobile (LCP, FID, CLS)
- Unités viewport modernes (dvh, svh)
- Safe-area-inset pour les notches

### `responsive-tester`
**Rôle** : Testeur responsive — breakpoints, viewports, touch, accessibilité
**Modèle** : **Sonnet 4.6**
**Skill** : `/responsive-tester`
**Présent dans** : US-03, US-10
**Responsabilités** :
- Tests sur 3+ viewports (375px, 768px, 1440px)
- Touch targets (44x44px WCAG)
- Contraste et accessibilité
- Animations et transitions
- Lighthouse mobile score

### `pwa-dev`
**Rôle** : Spécialiste PWA — service worker, manifest, offline, installabilité
**Modèle** : **Sonnet 4.6**
**Skill** : `/pwa-dev`
**Présent dans** : US-09
**Responsabilités** :
- Service worker (stratégies de cache)
- Web app manifest (icônes, couleurs, display)
- Fallback offline
- Installabilité
- Versioning et nettoyage des caches

---

## Agents fallback (génériques)

### `architect`
**Modèle** : **Sonnet 4.6**
**Rôle** : Planification architecture (read-only)

### `developer`
**Modèle** : **Sonnet 4.6**
**Rôle** : Développeur générique (fallback si mobile-dev indisponible)

### `tester`
**Modèle** : **Sonnet 4.6**
**Rôle** : Tests unitaires et d'intégration

---

## Assignation par US

| US | Agents | Priorité |
|----|--------|----------|
| US-01 | mobile-dev, stabilizer | haute |
| US-02 | mobile-dev, stabilizer | haute |
| US-03 | mobile-dev, responsive-tester, stabilizer | haute |
| US-04 | mobile-dev, stabilizer | haute |
| US-05 | mobile-dev, stabilizer | haute |
| US-06 | mobile-dev, stabilizer | moyenne |
| US-07 | mobile-dev, stabilizer | moyenne |
| US-08 | mobile-dev, stabilizer | moyenne |
| US-09 | pwa-dev, stabilizer | moyenne |
| US-10 | responsive-tester, reviewer, stabilizer | moyenne |

## Modèles par catégorie

| Catégorie | Agents | Modèle |
|-----------|--------|--------|
| Orchestration | forge, init-project, next-feature | **Opus 4.6** |
| Planification | architect | **Sonnet 4.6** |
| Développement | mobile-dev, pwa-dev, developer | **Sonnet 4.6** |
| Revue | reviewer | **Sonnet 4.6** |
| Test | tester, responsive-tester | **Sonnet 4.6** |
| Validation | stabilizer | **Sonnet 4.6** |

## Ordre d'exécution des agents (par US)

1. **architect** (si nécessaire) → planification
2. **mobile-dev / pwa-dev** → implémentation
3. **responsive-tester / tester** → tests
4. **reviewer** → revue qualité
5. **stabilizer** → validation finale (toujours en dernier)
