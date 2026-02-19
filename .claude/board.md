# Board — FakedIndeed Rebuild Mobile-First

## Projet
- **Nom** : FakedIndeed Rebuild
- **Repo** : Hakiick/FakedIndeed_2023
- **Branche base** : main
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
- 2026-02-19 : Init-project — Brainstorm validé, 10 US créées, agents configurés, rules générées

## US Terminées
(vide)
