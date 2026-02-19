# PROMPT AUTONOME — Intégration TimeManager dans Portfolio_cyber_ia

> **Usage** : Copie-colle ce prompt dans une session Claude Code sur ta VM.
> La VM doit avoir accès à GitHub (Hakiick/T-POO-700-STG_1 et Hakiick/Portfolio_cyber_ia).

---

## MISSION

Tu es un orchestrateur autonome. Ta mission est de :

1. **Déployer** l'application TimeManager (T-POO-700-STG_1) en local
2. **Capturer** des screenshots de l'application avec Playwright
3. **Intégrer** le projet TimeManager dans le Portfolio_cyber_ia avec les screenshots
4. **Committer et pusher** les changements sur les deux repos

Tu travailles en **autonomie totale** jusqu'à ce que les screenshots soient dans le portfolio et pushés.

---

## PHASE 1 : SETUP DES REPOS

### 1.1 — Cloner ou vérifier les repos

```bash
# TimeManager
cd /home/claude/workspace
if [ ! -d "T-POO-700-STG_1" ]; then
  git clone https://github.com/Hakiick/T-POO-700-STG_1.git
fi
cd T-POO-700-STG_1
git checkout main
git pull origin main

# Portfolio
cd /home/claude/workspace
if [ ! -d "Portfolio_cyber_ia" ]; then
  git clone https://github.com/Hakiick/Portfolio_cyber_ia.git
fi
cd Portfolio_cyber_ia
git checkout main
git pull origin main
```

> **Adapte les chemins** si tes repos sont ailleurs sur la VM (ex: `/home/user/`, `/root/`, etc.).
> Avant de commencer, vérifie les chemins réels avec `ls /home/*/` et `find / -name "T-POO-700-STG_1" -type d 2>/dev/null`.

### 1.2 — Vérifier les pré-requis

```bash
# Docker et docker-compose doivent être installés
docker --version
docker compose version || docker-compose --version

# Node.js 18+ doit être installé
node --version
npm --version

# Playwright (sera installé plus tard si manquant)
npx playwright --version 2>/dev/null || echo "Playwright sera installé"
```

**Si Docker n'est pas installé** → installe-le avant de continuer.
**Si Node.js n'est pas installé** → installe Node 20 LTS via nvm ou le package manager.

---

## PHASE 2 : DÉPLOYER TIMEMANAGER EN LOCAL

### 2.1 — Analyser la structure du projet

```bash
cd /home/claude/workspace/T-POO-700-STG_1
ls -la
cat docker-compose.yml 2>/dev/null || echo "Pas de docker-compose.yml"
ls frontend/ 2>/dev/null
ls backend/ 2>/dev/null
cat frontend/package.json | head -30
```

Comprends la structure avant de lancer quoi que ce soit.

### 2.2 — Lancer le backend avec Docker

```bash
cd /home/claude/workspace/T-POO-700-STG_1

# Option A : docker-compose existe
docker compose up -d
# Attendre que le backend soit prêt
sleep 10
docker compose ps
# Vérifier que le backend répond
curl -s http://localhost:4000/api/health 2>/dev/null || curl -s http://localhost:4000 2>/dev/null || echo "Backend en démarrage..."

# Option B : si pas de docker-compose, chercher un Dockerfile
# docker build -t timemanager-backend ./backend
# docker run -d -p 4000:4000 --name tm-backend timemanager-backend
```

**Si le backend ne démarre pas** :
1. Vérifie les logs : `docker compose logs`
2. Vérifie que PostgreSQL est accessible
3. Vérifie les variables d'environnement nécessaires
4. Crée un `.env` si besoin avec les valeurs par défaut

### 2.3 — Installer et lancer le frontend

```bash
cd /home/claude/workspace/T-POO-700-STG_1/frontend
npm install
npm run dev &
FRONTEND_PID=$!
sleep 5

# Vérifier que le frontend répond
curl -s http://localhost:5173 > /dev/null && echo "Frontend OK" || echo "Frontend pas prêt"
```

### 2.4 — Vérifier que l'app fonctionne

```bash
# Le frontend doit répondre
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173

# L'API doit répondre (adapter le port si nécessaire)
curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/users 2>/dev/null
```

**Si l'API ne répond pas** : le frontend fonctionnera quand même pour les screenshots (les pages se chargeront, même si les données API sont vides). Continue avec les screenshots.

---

## PHASE 3 : CAPTURER LES SCREENSHOTS

### 3.1 — Installer Playwright

```bash
cd /home/claude/workspace/T-POO-700-STG_1/frontend
npm install -D playwright @playwright/test
npx playwright install chromium
```

### 3.2 — Créer le script de capture

Crée le fichier `frontend/scripts/capture-portfolio-screenshots.ts` :

```typescript
import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';

const OUTPUT_DIR = 'screenshots/portfolio';
const BASE_URL = 'http://localhost:5173';

// Les 4 screenshots pour le portfolio
const CAPTURES = [
  {
    name: 'dashboard',
    path: '/dashboard',
    viewport: { width: 1440, height: 900 },
    description: 'Dashboard employee with stat cards and weekly charts',
  },
  {
    name: 'clock',
    path: '/clock',
    viewport: { width: 1440, height: 900 },
    description: 'Clock in/out widget with radial SVG animation',
  },
  {
    name: 'team',
    path: '/team',
    viewport: { width: 1440, height: 900 },
    description: 'Team management view with avatar grid',
  },
  {
    name: 'mobile',
    path: '/clock',
    viewport: { width: 375, height: 812 },
    description: 'Mobile responsive view (375px viewport)',
  },
];

// Pages alternatives si certaines routes n'existent pas
const FALLBACK_PATHS = ['/', '/login', '/register', '/settings', '/admin'];

async function capture() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  for (const cap of CAPTURES) {
    const context = await browser.newContext({
      viewport: cap.viewport,
    });
    const page = await context.newPage();

    let captured = false;

    // Essayer le path principal
    try {
      const response = await page.goto(`${BASE_URL}${cap.path}`, {
        waitUntil: 'networkidle',
        timeout: 15000,
      });

      if (response && response.status() < 400) {
        // Attendre que les animations se jouent
        await page.waitForTimeout(2000);

        await page.screenshot({
          path: `${OUTPUT_DIR}/${cap.name}.png`,
          fullPage: false,
        });
        console.log(`OK ${cap.name}.png (${cap.viewport.width}x${cap.viewport.height}) — ${cap.description}`);
        captured = true;
      }
    } catch (e) {
      console.log(`WARN ${cap.name}: ${cap.path} failed, trying fallbacks...`);
    }

    // Fallback : essayer d'autres routes
    if (!captured) {
      for (const fallback of FALLBACK_PATHS) {
        try {
          const response = await page.goto(`${BASE_URL}${fallback}`, {
            waitUntil: 'networkidle',
            timeout: 10000,
          });

          if (response && response.status() < 400) {
            await page.waitForTimeout(1500);
            await page.screenshot({
              path: `${OUTPUT_DIR}/${cap.name}.png`,
              fullPage: false,
            });
            console.log(`OK ${cap.name}.png (fallback: ${fallback})`);
            captured = true;
            break;
          }
        } catch {
          continue;
        }
      }
    }

    if (!captured) {
      console.log(`FAIL ${cap.name}: no route available`);
    }

    await context.close();
  }

  await browser.close();
  console.log(`\nScreenshots saved in ${OUTPUT_DIR}/`);
}

capture().catch(console.error);
```

### 3.3 — Exécuter la capture

```bash
cd /home/claude/workspace/T-POO-700-STG_1/frontend

# S'assurer que le dev server tourne
curl -s http://localhost:5173 > /dev/null || (npm run dev &; sleep 5)

# Capturer
npx tsx scripts/capture-portfolio-screenshots.ts

# Vérifier les résultats
ls -la screenshots/portfolio/
```

### 3.4 — Convertir en WebP

```bash
cd /home/claude/workspace/T-POO-700-STG_1/frontend/screenshots/portfolio

# Option A : avec cwebp (si installé)
for f in *.png; do
  cwebp -q 85 "$f" -o "${f%.png}.webp" 2>/dev/null && echo "Converted $f" || echo "cwebp not available for $f"
done

# Option B : avec sharp via Node.js (fallback)
if [ ! -f "dashboard.webp" ]; then
  node -e "
    const sharp = require('sharp');
    const fs = require('fs');
    const files = fs.readdirSync('.').filter(f => f.endsWith('.png'));
    Promise.all(files.map(f =>
      sharp(f).webp({ quality: 85 }).toFile(f.replace('.png', '.webp'))
        .then(() => console.log('Converted: ' + f))
    )).catch(() => console.log('sharp not available — install with: npm i -g sharp'));
  " 2>/dev/null
fi

# Option C : si ni cwebp ni sharp — garder les PNG et adapter les chemins dans le portfolio
if [ ! -f "dashboard.webp" ]; then
  echo "WebP conversion not available. Using PNG format instead."
  echo "IMPORTANT: Update portfolio projects.ts to use .png instead of .webp"
fi

ls -la *.webp 2>/dev/null || ls -la *.png
```

---

## PHASE 4 : INTÉGRER DANS LE PORTFOLIO

### 4.1 — Créer la branche dans le portfolio

```bash
cd /home/claude/workspace/Portfolio_cyber_ia
git checkout main
git pull origin main
git checkout -b feat/projects/add-timemanager
```

### 4.2 — Appliquer le patch (contient toutes les modifications code)

Le patch est disponible dans le repo setup-claude-code-mobile-first :

```bash
# Option A : télécharger le patch depuis GitHub
curl -L "https://raw.githubusercontent.com/Hakiick/setup-claude-code-mobile-first/claude/analyze-project-nNKeJ/portfolio-timemanager.patch" -o /tmp/portfolio-timemanager.patch
cd /home/claude/workspace/Portfolio_cyber_ia
git apply /tmp/portfolio-timemanager.patch

# Option B : si le patch est déjà local
# git apply /chemin/vers/portfolio-timemanager.patch
```

**Ce que le patch ajoute** :
- `src/data/projects.ts` : type `fullstack`, champ `screenshots`, entrée TimeManager
- `src/components/ui/ClassifiedCard.tsx` : composant `ScreenshotGallery` (carousel)
- `src/components/projects/Projects.tsx` : filtre "Web"
- `src/lib/i18n.ts` : traduction `projects.filter.web`
- `public/images/projects/timemanager/README.md` : instructions screenshots

**Si le patch échoue** (conflits) : applique les changements manuellement en lisant les fichiers modifiés listés ci-dessus. Les changements sont décrits dans le README du patch.

### 4.3 — Copier les screenshots

```bash
# Créer le dossier de destination
mkdir -p /home/claude/workspace/Portfolio_cyber_ia/public/images/projects/timemanager

# Copier les screenshots (WebP ou PNG)
SCREENSHOTS_SRC="/home/claude/workspace/T-POO-700-STG_1/frontend/screenshots/portfolio"

if ls "$SCREENSHOTS_SRC"/*.webp 1>/dev/null 2>&1; then
  cp "$SCREENSHOTS_SRC"/*.webp /home/claude/workspace/Portfolio_cyber_ia/public/images/projects/timemanager/
  echo "Screenshots WebP copiés"
elif ls "$SCREENSHOTS_SRC"/*.png 1>/dev/null 2>&1; then
  cp "$SCREENSHOTS_SRC"/*.png /home/claude/workspace/Portfolio_cyber_ia/public/images/projects/timemanager/
  echo "Screenshots PNG copiés — penser à adapter les chemins dans projects.ts (.png au lieu de .webp)"
fi

ls -la /home/claude/workspace/Portfolio_cyber_ia/public/images/projects/timemanager/
```

### 4.4 — Adapter les chemins si PNG (pas de WebP)

Si les screenshots sont en PNG et non WebP, modifie `src/data/projects.ts` :

```typescript
// Remplacer .webp par .png dans les chemins screenshots
screenshots: [
  "/images/projects/timemanager/dashboard.png",
  "/images/projects/timemanager/clock.png",
  "/images/projects/timemanager/team.png",
  "/images/projects/timemanager/mobile.png",
],
```

### 4.5 — Vérifier le build du portfolio

```bash
cd /home/claude/workspace/Portfolio_cyber_ia
npm install
npx astro check          # 0 errors attendu
npm run build            # Build Complete attendu
npx prettier --check "src/**/*.{ts,tsx}"  # All files OK attendu
```

**Si Prettier échoue** :
```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

### 4.6 — Commit et push

```bash
cd /home/claude/workspace/Portfolio_cyber_ia

git add src/data/projects.ts \
        src/components/ui/ClassifiedCard.tsx \
        src/components/projects/Projects.tsx \
        src/lib/i18n.ts \
        public/images/projects/timemanager/

git commit -m "feat(projects): add TimeManager (T-POO-700-STG_1) with screenshots

- Add TimeManager project entry with FR/EN descriptions
- Add ScreenshotGallery component to ClassifiedCard (carousel with nav)
- Add fullstack category and Web filter with i18n
- Include captured screenshots from deployed app"

git push -u origin feat/projects/add-timemanager
```

### 4.7 — Merger dans main

```bash
cd /home/claude/workspace/Portfolio_cyber_ia
git checkout main
git merge feat/projects/add-timemanager
git push origin main
git branch -d feat/projects/add-timemanager
```

---

## PHASE 5 : CLEANUP

```bash
# Arrêter le frontend dev server
kill $FRONTEND_PID 2>/dev/null
# Arrêter Docker
cd /home/claude/workspace/T-POO-700-STG_1
docker compose down 2>/dev/null

echo "Done! Branche mergée dans main sur Portfolio_cyber_ia."
```

---

## GESTION DES ERREURS

| Problème | Solution |
|----------|----------|
| Docker ne démarre pas | Vérifier `docker ps`, libérer les ports occupés, vérifier les permissions |
| Backend ne répond pas | Vérifier les logs `docker compose logs`, vérifier PostgreSQL |
| Frontend ne compile pas | `npm install`, vérifier Node version, lire les erreurs |
| Playwright échoue | `npx playwright install chromium --with-deps`, vérifier display |
| Screenshots noirs/vides | Le frontend n'est pas prêt — augmenter le `waitForTimeout` |
| Patch ne s'applique pas | Appliquer manuellement les changements (voir section 4.2) |
| cwebp/sharp non dispo | Garder les PNG et adapter les chemins dans projects.ts |
| gh CLI non dispo | Merger manuellement via git |
| Port déjà occupé | `lsof -i :5173` / `lsof -i :4000`, kill le process |

## CRITÈRES DE SUCCÈS

1. L'app TimeManager tourne en local (frontend + backend)
2. 4 screenshots capturés (dashboard, clock, team, mobile)
3. Le patch est appliqué au portfolio
4. Les screenshots sont dans `public/images/projects/timemanager/`
5. Le build du portfolio passe sans erreur
6. La branche est mergée dans main
