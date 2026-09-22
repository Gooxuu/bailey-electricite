# Site Bailey Électricité Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a static Next.js showcase site for Bailey Électricité, mirroring the proven Attis International template, using real business data gathered from PagesJaunes/Facebook.

**Architecture:** Next.js 16 App Router + TypeScript, exported fully static (`output: 'export'`, no server, no forms). Tailwind CSS v4 with a CSS-first `@theme`. All business facts live in one file (`src/lib/infos.ts`); all photo slots live in one file (`src/lib/photos.ts`) and fall back to a placeholder frame until real files are dropped in. `DEMO_MODE` gates indexing and shows a "maquette" banner until signature.

**Tech Stack:** Next.js 16.2.x, React 19, TypeScript 5, Tailwind CSS v4, ESLint 9 (eslint-config-next), Node.js (installed locally 2026-09-22 — see Global Constraints), GitHub Actions → GitHub Pages.

**Spec:** [docs/superpowers/specs/2026-09-22-bailey-electricite-design.md](../specs/2026-09-22-bailey-electricite-design.md)

## Global Constraints

- Node/npm are installed at `C:\Program Files\nodejs\`, but any already-open shell may still have a stale PATH — if a bare `node`/`npm`/`npx` command is not found, prepend `$env:Path = "C:\Program Files\nodejs;$env:Path"` (PowerShell) or `export PATH="/c/Program Files/nodejs:$PATH"` (Bash) before retrying, rather than reinstalling anything.
- `output: 'export'` requires `images.unoptimized: true`, and both `robots.ts` and `sitemap.ts` require `export const dynamic = "force-static"` — omitting either breaks `npm run build` (confirmed current for Next.js 16.2 via Context7).
- No back-end, no form, no database. Contact is phone / WhatsApp / e-mail links only.
- `CERTIFICATIONS` in `src/lib/infos.ts` starts as an **empty array** — no certification has been confirmed by Loïc. Every place certifications could appear (badges section, IRVE certification callout) must render nothing when the array is empty, never a placeholder or invented badge.
- `DEMO_MODE = true` for the whole build (noindex + banner) until told otherwise.
- This is a genuinely static marketing site with no client-side business logic: there is no unit-testable behavior to TDD. Each task's verification step is `npm run build` (type-check + static export) and/or `npm run lint`, plus a visual check of the affected page(s) via the dev server in the browser — not a fabricated unit test.
- Working directory: `C:\Users\Gok\Desktop\Site Bailey Electricite`. Git remote `origin` already points to `https://github.com/Gooxuu/bailey-electricite` (public repo, pushed once already with the spec on `master`).

## Review Focus

- **Certifications leaking in anyway** — any hardcoded "RGE"/"Qualifelec"/"IRVE certifié" copy pasted from the Attis reference instead of adapted would misrepresent Bailey. Every task touching copy must grep the Attis reference diff mentally against this list, not copy-paste blind.
- **WhatsApp link using the wrong number** — `WHATSAPP_URL` must encode `+33634140274` (Bailey's number), not Attis's `+33622728682` left over from a copy-paste.
- **Broken `NAV_LINKS` hrefs vs actual folder names** — Bailey's route segments (`electricite-generale`, `chauffage-climatisation-ventilation`, `bornes-de-recharge-irve`, `contact`) must match the `src/app/<segment>/page.tsx` folders exactly, including trailing slashes (`trailingSlash: true` in `next.config.ts` means every internal link needs a trailing `/`).
- **`sitemap.ts` route list drifting from the real page list** — Bailey has 5 routes (one more service page than Attis's 4), easy to forget the third service page when adapting the hardcoded `ROUTES` array.
- **Logo SVG unreadable without the page's fonts** — `logo-redraw.svg` is served as a standalone static asset (via `next/image`), so it cannot rely on the `Montserrat`/`Inter` CSS variables loaded on the HTML page; its own `font-family` must degrade to a system sans-serif.

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `postcss.config.mjs`
- Create: `next.config.ts`
- Create: `.gitignore`
- Create: `next-env.d.ts`
- Create: `src/app/layout.tsx` (placeholder, replaced in Task 6)
- Create: `src/app/page.tsx` (placeholder, replaced in Task 7)
- Create: `src/app/globals.css` (placeholder, replaced in Task 3)

**Interfaces:**
- Produces: a working `npm install` / `npm run dev` / `npm run build` / `npm run lint` toolchain for every later task to build on.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "bailey-electricite",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3003",
    "build": "next build",
    "preview": "npx --yes serve out -l 3003",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.2.12",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.12",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.mts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `eslint.config.mjs`**

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

- [ ] **Step 4: Create `postcss.config.mjs`**

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: Create `next.config.ts`**

```typescript
import type { NextConfig } from "next";
import path from "path";

// Sur GitHub Pages en « project page », le site est servi sous /<nom-du-depot>.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules/
.next/
out/
next-env.d.ts
.DS_Store
*.local
```

Note: `next-env.d.ts` is gitignored (Next.js regenerates it) but must still exist on disk for the next step's build to type-check.

- [ ] **Step 7: Create `next-env.d.ts`**

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

- [ ] **Step 8: Create placeholder `src/app/globals.css`**

```css
@import "tailwindcss";

body {
  background: #ffffff;
  color: #111111;
}
```

- [ ] **Step 9: Create placeholder `src/app/layout.tsx`**

```tsx
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Create placeholder `src/app/page.tsx`**

```tsx
export default function Home() {
  return <p>Bailey Électricité — en construction.</p>;
}
```

- [ ] **Step 11: Install dependencies**

Run (PowerShell, from the project root):

```bash
$env:Path = "C:\Program Files\nodejs;$env:Path"; npm install
```

Expected: completes without error, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 12: Verify the build**

Run:

```bash
$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build
```

Expected: `Compiled successfully`, and an `out/` folder is created containing `index.html`.

- [ ] **Step 13: Commit**

```bash
git add package.json package-lock.json tsconfig.json eslint.config.mjs postcss.config.mjs next.config.ts .gitignore src/app/globals.css src/app/layout.tsx src/app/page.tsx
git commit -m "Scaffold Next.js 16 + Tailwind v4 static-export project"
```

---

## Task 2: Business data (`infos.ts`, `photos.ts`)

**Files:**
- Create: `src/lib/infos.ts`
- Create: `src/lib/photos.ts`

**Interfaces:**
- Produces: every named export below (`BRAND`, `TAGLINE`, `PHONE_DISPLAY`, `PHONE_TEL`, `EMAIL`, `EMAIL_MAILTO`, `WHATSAPP_ENABLED`, `WHATSAPP_URL`, `STREET`, `POSTAL_CODE`, `CITY`, `ADDRESS`, `MAPS_URL`, `SERVICE_AREA`, `SITE_URL`, `DEMO_MODE`, `AGENCY_NAME`, `BASE_PATH`, `asset()`, `LOGO_FILE`, `CERTIFICATIONS`, `NAV_LINKS`) and `PHOTOS` / `type Photo` — every later task imports from here, never redefines these values.

- [ ] **Step 1: Create `src/lib/infos.ts`**

```typescript
/**
 * Source unique des informations de l'entreprise et des réglages du site.
 * Ne jamais coder en dur un numéro, une adresse ou un drapeau dans un composant.
 */

export const BRAND = "Bailey Électricité";
export const TAGLINE = "L'éclairage de vos projets";

export const PHONE_DISPLAY = "06 34 14 02 74";
export const PHONE_TEL = "tel:+33634140274";
export const EMAIL = "loic.bailey.pro@gmail.com";
export const EMAIL_MAILTO = `mailto:${EMAIL}`;

/** À passer à false si le 06 34 14 02 74 n'est pas sur WhatsApp : le bouton disparaît partout. */
export const WHATSAPP_ENABLED = true;
export const WHATSAPP_URL = `https://wa.me/33634140274?text=${encodeURIComponent(
  "Bonjour, je vous contacte depuis votre site pour un projet.",
)}`;

export const STREET = "Lieu-dit les Mazilles";
export const POSTAL_CODE = "71420";
export const CITY = "Marly-sur-Arroux";
export const ADDRESS = `${STREET}, ${POSTAL_CODE} ${CITY}`;
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${ADDRESS}, France`,
)}`;
export const SERVICE_AREA = "Marly-sur-Arroux et alentours";

/** Domaine cible. Pour la démo GitHub Pages, surchargé par NEXT_PUBLIC_SITE_URL au build. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bailey-electricite.fr";

/**
 * Mode démonstration (présentation à Loïc) : site non indexé + bandeau « Maquette ».
 * À passer à false à la signature.
 */
export const DEMO_MODE = true;
/** Nom de l'agence affiché dans le bandeau de démo. Vide = bandeau générique. */
export const AGENCY_NAME = "";

/** Sous-chemin GitHub Pages (ex. « /bailey-electricite »), vide sinon. Défini au build. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Préfixe un chemin de `public/` avec le basePath.
 * Nécessaire pour `next/image` et les balises <img>/<link> ; `next/link` s'en occupe seul.
 */
export const asset = (path: string) => `${BASE_PATH}${path}`;

/** Logo vectoriel redessiné (aucun fichier haute résolution fourni par Loïc pour l'instant). */
export const LOGO_FILE = "/images/logo-redraw.svg";

/**
 * Aucune certification confirmée par Loïc à ce stade (ni Qualifelec, ni RGE, ni IRVE, ni
 * décennale n'ont été vues sur PagesJaunes/Facebook). Ce tableau reste vide tant qu'il n'a pas
 * confirmé — CertBadges et toute section liée aux certifications ne s'affichent QUE si ce
 * tableau contient au moins une entrée. Ne jamais y ajouter une entrée non confirmée par Loïc.
 */
export const CERTIFICATIONS: { id: string; label: string; detail: string }[] = [];

export const NAV_LINKS = [
  { href: "/electricite-generale/", label: "Électricité Générale" },
  { href: "/chauffage-climatisation-ventilation/", label: "Chauffage & Climatisation" },
  { href: "/bornes-de-recharge-irve/", label: "Bornes de recharge", highlight: true },
  { href: "/contact/", label: "Contact" },
] as const;
```

- [ ] **Step 2: Create `src/lib/photos.ts`**

```typescript
/**
 * Emplacements photo du site.
 *
 * Tant que `src` est absent, `PhotoSlot` affiche un cadre de remplacement soigné.
 * Pour brancher une vraie photo : déposer le fichier (WebP/JPEG, ~1600 px de large max)
 * dans `public/images/photos/` puis renseigner ici `src: "/images/photos/mon-fichier.webp"`
 * et une description `alt` fidèle à l'image. Aucun autre fichier à modifier.
 */
export type Photo = {
  /** Chemin depuis public/, ex. "/images/photos/tableau-chantier.webp". Absent = cadre de remplacement. */
  src?: string;
  /** Description de l'image, lue par les lecteurs d'écran et utile au SEO. */
  alt: string;
  /** Libellé affiché sur le cadre de remplacement et en légende. */
  caption: string;
};

export const PHOTOS = {
  hero: { alt: "Intervention réalisée par Bailey Électricité", caption: "Intervention Bailey Électricité" },
  tableauElectrique: {
    alt: "Tableau électrique installé par Bailey Électricité",
    caption: "Tableau électrique",
  },
  climatisation: {
    alt: "Climatisation réversible installée par Bailey Électricité",
    caption: "Climatisation réversible",
  },
  chauffage: { alt: "Chauffage électrique installé par Bailey Électricité", caption: "Chauffage électrique" },
  ventilation: { alt: "Ventilation VMC installée par Bailey Électricité", caption: "Ventilation VMC" },
  borneIrve: { alt: "Borne de recharge installée par Bailey Électricité", caption: "Borne de recharge" },
  borneIrveHero: {
    alt: "Borne de recharge IRVE installée à Marly-sur-Arroux",
    caption: "Borne de recharge IRVE",
  },
} satisfies Record<string, Photo>;
```

- [ ] **Step 3: Verify the build still passes**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build`
Expected: `Compiled successfully` (these files aren't imported by anything yet, so this just confirms no syntax/type errors).

- [ ] **Step 4: Commit**

```bash
git add src/lib/infos.ts src/lib/photos.ts
git commit -m "Add Bailey Electricite business data and photo slots"
```

---

## Task 3: Theme, icon set, and logo

**Files:**
- Modify: `src/app/globals.css` (replace placeholder from Task 1)
- Create: `src/components/Icons.tsx`
- Create: `public/images/logo-redraw.svg`
- Create: `src/components/Logo.tsx`

**Interfaces:**
- Consumes: `BRAND`, `LOGO_FILE`, `asset` from `src/lib/infos.ts` (Task 2)
- Produces: Tailwind theme tokens (`bg-navy`, `text-navy`, `bg-navy-deep`, `bg-gold`, `bg-gold-dark`, `text-green`, `text-ink`, `text-muted`, `bg-mist`, `border-line`, `font-display`, `font-sans`), `Icon` component + `IconName` type (`"phone" | "mail" | "pin" | "chat" | "bolt" | "check" | "shield" | "menu" | "close" | "arrow" | "camera" | "flame" | "snow" | "wind" | "wrench" | "home" | "quote"`), and `Logo` component — every later task uses these names verbatim.

- [ ] **Step 1: Replace `src/app/globals.css`**

Palette derived from Bailey's existing logo (navy + gold bulb + green tagline), kept distinct from Attis International's navy/amber/cyan/red so the two client sites don't read as the same product:

```css
@import "tailwindcss";

@theme {
  /* Identité de marque (logo Bailey) */
  --color-navy: #1c2a5e;
  --color-navy-deep: #0f1638;
  --color-gold: #f0ad1f;
  --color-gold-dark: #cf8f0f;
  --color-green: #1f8a4c;

  /* Neutres */
  --color-ink: #1a1f33;
  --color-muted: #555c78;
  --color-mist: #f4f5fa;
  --color-line: #e3e5f0;

  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-montserrat), ui-sans-serif, system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background: #ffffff;
  color: var(--color-ink);
  font-family: var(--font-sans);
}

a:focus-visible,
button:focus-visible {
  outline: 3px solid var(--color-green);
  outline-offset: 3px;
  border-radius: 0.5rem;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 2: Create `src/components/Icons.tsx`**

Same icon set as the Attis reference, plus `wrench` (dépannage) and `home` (domotique) for Bailey's broader service list:

```tsx
import type { ReactNode } from "react";

/** Icônes en trait (viewBox 24) — un seul fichier pour éviter une dépendance d'icônes. */
const PATHS = {
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  pin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  chat: (
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  ),
  bolt: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  flame: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  ),
  snow: <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />,
  wind: <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2" />,
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />
  ),
  home: (
    <>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </>
  ),
  quote: (
    <path d="M3 21c3 0 7-1 7-8V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h4M14 21c3 0 7-1 7-8V5a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h4" />
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
```

- [ ] **Step 3: Create `public/images/logo-redraw.svg`**

Redraw of Bailey's existing logo (gold lightbulb/"b" monogram + navy/gold wordmark), since no high-resolution source file exists — this is the file offered free to Loïc. It's served standalone via `next/image`, so it cannot depend on the page's Inter/Montserrat font loading: `font-family` falls back to plain system sans-serif.

```bash
mkdir -p public/images
```

```svg
<svg viewBox="0 0 520 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bailey Électricité — logo">
  <circle cx="80" cy="66" r="54" fill="#f0ad1f" />
  <path d="M80 12a54 54 0 0 1 0 108" fill="none" stroke="#1c2a5e" stroke-width="10" stroke-linecap="round" />
  <path d="M80 40v52M62 66h36" stroke="#1c2a5e" stroke-width="8" stroke-linecap="round" />
  <rect x="66" y="112" width="28" height="30" rx="7" fill="#1c2a5e" />
  <path d="M64 142h32v8a4 4 0 0 1-4 4H68a4 4 0 0 1-4-4z" fill="#1c2a5e" />
  <text x="160" y="76" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="800" fill="#1c2a5e">Bailey</text>
  <text x="160" y="118" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" fill="#f0ad1f">Électricité</text>
</svg>
```

- [ ] **Step 4: Create `src/components/Logo.tsx`**

```tsx
import Image from "next/image";
import { BRAND, LOGO_FILE, asset } from "@/lib/infos";

/** Logo de la marque. Le fichier se change dans `LOGO_FILE` (lib/infos.ts). */
export default function Logo({ className = "h-14 w-auto", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={asset(LOGO_FILE)}
      alt={`${BRAND} — logo`}
      width={520}
      height={160}
      className={className}
      priority={priority}
    />
  );
}
```

- [ ] **Step 5: Verify the build**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build`
Expected: `Compiled successfully` (still nothing imports `Logo`/`Icon` yet, so this only confirms no type/syntax errors).

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/Icons.tsx public/images/logo-redraw.svg src/components/Logo.tsx
git commit -m "Add Bailey Electricite theme, icon set, and redrawn logo"
```

---

## Task 4: Shared UI components

**Files:**
- Create: `src/components/Section.tsx`
- Create: `src/components/ContactButtons.tsx`
- Create: `src/components/PhotoSlot.tsx`
- Create: `src/components/Testimonial.tsx`
- Create: `src/components/CertBadges.tsx`
- Create: `src/components/CurrentYear.tsx`
- Create: `src/components/DemoBanner.tsx`

**Interfaces:**
- Consumes: theme tokens + `Icon`/`IconName` (Task 3), `PHONE_DISPLAY`, `PHONE_TEL`, `EMAIL`, `EMAIL_MAILTO`, `WHATSAPP_ENABLED`, `WHATSAPP_URL`, `CERTIFICATIONS`, `AGENCY_NAME`, `DEMO_MODE`, `asset` (Task 2), `type Photo` (Task 2)
- Produces: `Container`, `SectionHeading`, `CtaBand` (from `Section.tsx`); `ContactButtons` (default export); `PhotoSlot` (default export, props `{ photo, ratio?, tone?, priority?, sizes?, overlay?, className? }`); `Testimonial` (default export); `CertBadges` (default export — **renders `null` when `CERTIFICATIONS` is empty**); `CurrentYear` (default export); `DemoBanner` (default export)

- [ ] **Step 1: Create `src/components/Section.tsx`**

```tsx
import type { ReactNode } from "react";
import ContactButtons from "@/components/ContactButtons";

/** Conteneur centré commun à toutes les sections. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-5 ${className}`}>{children}</div>;
}

type HeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  /** « h1 » pour le titre principal d'une page, « h2 » sinon. */
  as?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, intro, tone = "light", align = "left", as: Tag = "h2" }: HeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className={`text-sm font-bold uppercase tracking-wider ${dark ? "text-gold" : "text-green"}`}>{eyebrow}</p>
      )}
      <Tag className={`mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl ${dark ? "text-white" : "text-navy"}`}>
        {title}
      </Tag>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-white/80" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}

/** Bandeau d'appel à l'action de fin de page. */
export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section className="bg-navy py-16">
      <Container className="text-center">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight text-white">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">{text}</p>
        <ContactButtons tone="dark" size="lg" showEmail className="mt-8 justify-center" />
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/ContactButtons.tsx`**

```tsx
import Icon from "@/components/Icons";
import { EMAIL, EMAIL_MAILTO, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_ENABLED, WHATSAPP_URL } from "@/lib/infos";

type Props = {
  /** « dark » : à poser sur un fond navy. */
  tone?: "light" | "dark";
  size?: "md" | "lg";
  /** Ajoute un lien e-mail discret à côté des deux boutons. */
  showEmail?: boolean;
  className?: string;
};

const BASE = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors";
const SIZES = { md: "px-5 py-3 text-sm", lg: "px-7 py-4 text-base" } as const;

/** Les trois moyens de contact du site : appel, WhatsApp, e-mail (pas de formulaire). */
export default function ContactButtons({ tone = "light", size = "md", showEmail = false, className = "" }: Props) {
  const secondary =
    tone === "dark" ? "border border-white/40 text-white hover:bg-white/10" : "border border-navy/30 text-navy hover:bg-navy/5";
  const mailLink = tone === "dark" ? "text-white/85 hover:text-white" : "text-navy hover:text-navy-deep";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a href={PHONE_TEL} className={`${BASE} ${SIZES[size]} bg-gold text-navy-deep hover:bg-gold-dark`}>
        <Icon name="phone" className="size-5" />
        Appeler le {PHONE_DISPLAY}
      </a>
      {WHATSAPP_ENABLED && (
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`${BASE} ${SIZES[size]} ${secondary}`}>
          <Icon name="chat" className="size-5" />
          WhatsApp
        </a>
      )}
      {showEmail && (
        <a href={EMAIL_MAILTO} className={`inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline ${mailLink}`}>
          <Icon name="mail" className="size-5" />
          {EMAIL}
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/PhotoSlot.tsx`**

```tsx
import Image from "next/image";
import type { ReactNode } from "react";
import Icon from "@/components/Icons";
import { asset } from "@/lib/infos";
import type { Photo } from "@/lib/photos";

const RATIOS = {
  "4/3": "aspect-[4/3]",
  "16/10": "aspect-[16/10]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
} as const;

type Props = {
  photo: Photo;
  ratio?: keyof typeof RATIOS;
  tone?: "light" | "dark";
  /** Pour l'image au-dessus de la ligne de flottaison (héros). */
  priority?: boolean;
  sizes?: string;
  overlay?: ReactNode;
  className?: string;
};

/**
 * Cadre photo. Sans `photo.src` : cadre de remplacement soigné, prêt à recevoir la vraie photo
 * (voir lib/photos.ts). Avec `photo.src` : image plein cadre.
 */
export default function PhotoSlot({
  photo,
  ratio = "4/3",
  tone = "light",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  overlay,
  className = "",
}: Props) {
  const placeholder =
    tone === "dark" ? "border-white/20 bg-white/5 text-white/70" : "border-navy/20 bg-gradient-to-br from-mist to-green/10 text-navy/75";

  return (
    <figure className={`relative overflow-hidden rounded-3xl ${RATIOS[ratio]} ${className}`}>
      {photo.src ? (
        <Image src={asset(photo.src)} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div
          role="img"
          aria-label={photo.alt}
          className={`flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed ${placeholder}`}
        >
          <Icon name="camera" className="size-9" />
          <span className="text-sm font-semibold">{photo.caption}</span>
          <span className="text-xs opacity-80">Photo de réalisation à ajouter</span>
        </div>
      )}
      {overlay && <div className="absolute inset-x-0 bottom-0 p-4">{overlay}</div>}
    </figure>
  );
}
```

- [ ] **Step 4: Create `src/components/Testimonial.tsx`**

```tsx
import Icon from "@/components/Icons";

/**
 * Le seul témoignage du site : un vrai avis client publié sur PagesJaunes, cité tel quel.
 * Volontairement sans nom ni note : on n'invente rien qui ne soit pas dans l'avis d'origine.
 */
export default function Testimonial() {
  return (
    <figure className="mx-auto max-w-3xl rounded-3xl border border-line bg-white p-8 shadow-sm sm:p-10">
      <Icon name="quote" className="size-9 text-gold" />
      <blockquote className="mt-4 font-display text-xl font-semibold leading-relaxed text-navy sm:text-2xl">
        « Très bon électricien. Intervention à mon domicile pour un problème électrique. Travail sérieux et propre,
        professionnel de bon conseil. Tout fonctionne très bien maintenant, je recommande vivement. »
      </blockquote>
      <figcaption className="mt-5 text-sm font-medium text-muted">Avis client publié sur PagesJaunes</figcaption>
    </figure>
  );
}
```

- [ ] **Step 5: Create `src/components/CertBadges.tsx`**

```tsx
import Icon from "@/components/Icons";
import { CERTIFICATIONS } from "@/lib/infos";

/**
 * Badges de certification. Ne rend rien tant que `CERTIFICATIONS` (lib/infos.ts) est vide —
 * aucune certification n'a été confirmée par Loïc, donc aucun badge n'est inventé ni affiché
 * vide. Dès qu'une entrée y est ajoutée, ce composant l'affiche automatiquement.
 */
export default function CertBadges({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  if (CERTIFICATIONS.length === 0) return null;

  const card = tone === "dark" ? "border-white/15 bg-white/5 text-white" : "border-line bg-white text-navy shadow-sm";
  const detail = tone === "dark" ? "text-white/70" : "text-muted";

  return (
    <ul className={`grid grid-cols-2 gap-3 lg:grid-cols-4 ${className}`}>
      {CERTIFICATIONS.map((cert) => (
        <li key={cert.id} className={`flex items-center gap-3 rounded-2xl border p-4 ${card}`}>
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${tone === "dark" ? "bg-white/10 text-gold" : "bg-gold/20 text-navy"}`}>
            <Icon name="shield" className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold leading-tight">{cert.label}</span>
            <span className={`block text-xs ${detail}`}>{cert.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 6: Create `src/components/CurrentYear.tsx`**

```tsx
"use client";

/**
 * Année courante calculée dans le navigateur, pour que le copyright ne reste jamais bloqué.
 * `suppressHydrationWarning` couvre le changement d'année entre le build statique et la visite.
 */
export default function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
```

- [ ] **Step 7: Create `src/components/DemoBanner.tsx`**

```tsx
import { AGENCY_NAME, DEMO_MODE } from "@/lib/infos";

/** Bandeau du mode démo (présentation à Loïc). Disparaît quand DEMO_MODE passe à false dans lib/infos.ts. */
export default function DemoBanner() {
  if (!DEMO_MODE) return null;

  return (
    <div className="bg-navy-deep px-4 py-2 text-center text-xs font-medium text-white/85">
      Maquette de démonstration
      {AGENCY_NAME ? ` proposée par ${AGENCY_NAME}` : " — proposition de site"}
    </div>
  );
}
```

- [ ] **Step 8: Verify the build**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 9: Commit**

```bash
git add src/components/Section.tsx src/components/ContactButtons.tsx src/components/PhotoSlot.tsx src/components/Testimonial.tsx src/components/CertBadges.tsx src/components/CurrentYear.tsx src/components/DemoBanner.tsx
git commit -m "Add shared UI components (sections, contact buttons, photo slots, testimonial)"
```

---

## Task 5: Navbar and Footer

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `Icon`, `Logo` (Task 3); `NAV_LINKS`, `PHONE_DISPLAY`, `PHONE_TEL`, `WHATSAPP_ENABLED`, `WHATSAPP_URL`, `ADDRESS`, `BRAND`, `CERTIFICATIONS`, `EMAIL`, `EMAIL_MAILTO`, `MAPS_URL` (Task 2); `CurrentYear` (Task 4)
- Produces: `Navbar` (default export, no props), `Footer` (default export, no props) — both used once each, in Task 6's root layout.

- [ ] **Step 1: Create `src/components/Navbar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icons";
import Logo from "@/components/Logo";
import { NAV_LINKS, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_ENABLED, WHATSAPP_URL } from "@/lib/infos";

const trim = (path: string) => path.replace(/\/+$/, "");

export default function Navbar() {
  const pathname = trim(usePathname() ?? "");
  const [open, setOpen] = useState(false);

  const linkClass = (href: string, highlight?: boolean) => {
    const active = pathname === trim(href);
    if (highlight) {
      return `inline-flex items-center gap-1.5 rounded-full bg-navy-deep px-4 py-2 text-sm font-semibold text-white ring-1 ring-gold/70 transition-colors hover:bg-navy ${
        active ? "ring-2" : ""
      }`;
    }
    return `rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-mist ${
      active ? "text-navy underline decoration-gold decoration-2 underline-offset-8" : "text-ink"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" aria-label="Bailey Électricité — accueil" onClick={() => setOpen(false)}>
          <Logo priority className="h-12 w-auto" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href, "highlight" in link ? link.highlight : false)}
              aria-current={pathname === trim(link.href) ? "page" : undefined}
            >
              {"highlight" in link && link.highlight && <Icon name="bolt" className="size-4 text-gold" />}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={PHONE_TEL}
            className="hidden items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-navy-deep transition-colors hover:bg-gold-dark sm:inline-flex"
          >
            <Icon name="phone" className="size-4" />
            {PHONE_DISPLAY}
          </a>
          <a
            href={PHONE_TEL}
            aria-label={`Appeler le ${PHONE_DISPLAY}`}
            className="inline-flex size-11 items-center justify-center rounded-full bg-gold text-navy-deep sm:hidden"
          >
            <Icon name="phone" className="size-5" />
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-navy lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="border-t border-line bg-white px-5 pb-5 pt-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`${linkClass(link.href, "highlight" in link ? link.highlight : false)} flex w-full py-3`}
                >
                  {"highlight" in link && link.highlight && <Icon name="bolt" className="size-4 text-gold" />}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {WHATSAPP_ENABLED && (
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-full border border-navy/30 px-5 py-3 text-sm font-semibold text-navy"
            >
              <Icon name="chat" className="size-5" />
              Écrire sur WhatsApp
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Create `src/components/Footer.tsx`**

```tsx
import Link from "next/link";
import CurrentYear from "@/components/CurrentYear";
import Icon from "@/components/Icons";
import Logo from "@/components/Logo";
import {
  ADDRESS,
  BRAND,
  CERTIFICATIONS,
  EMAIL,
  EMAIL_MAILTO,
  MAPS_URL,
  NAV_LINKS,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_ENABLED,
  WHATSAPP_URL,
} from "@/lib/infos";

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <span className="inline-block rounded-2xl bg-white p-2">
            <Logo className="h-12 w-auto" />
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
            Électricité générale, climatisation réversible, domotique et bornes de recharge pour véhicules électriques,
            à Marly-sur-Arroux et alentours.
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-gold">Nous contacter</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li>
              <a href={PHONE_TEL} className="inline-flex items-center gap-2 hover:text-white">
                <Icon name="phone" className="size-4 text-gold" />
                {PHONE_DISPLAY}
              </a>
            </li>
            {WHATSAPP_ENABLED && (
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  <Icon name="chat" className="size-4 text-gold" />
                  WhatsApp
                </a>
              </li>
            )}
            <li>
              <a href={EMAIL_MAILTO} className="inline-flex items-center gap-2 hover:text-white">
                <Icon name="mail" className="size-4 text-gold" />
                {EMAIL}
              </a>
            </li>
            <li>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 hover:text-white">
                <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-gold" />
                {ADDRESS}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-gold">Le site</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {CERTIFICATIONS.length > 0 && (
            <p className="mt-6 text-xs leading-relaxed text-white/60">
              {CERTIFICATIONS.map((c) => `${c.label} ${c.detail}`).join(" · ")}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-white/60">
          © <CurrentYear /> {BRAND}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify the build**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "Add Navbar and Footer"
```

---

## Task 6: Root layout, favicon, robots, sitemap, 404

**Files:**
- Modify: `src/app/layout.tsx` (replace placeholder from Task 1)
- Create: `src/app/icon.svg`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/not-found.tsx`

**Interfaces:**
- Consumes: `DemoBanner`, `Navbar`, `Footer` (Task 4/5); `Container` (Task 4); `ADDRESS`, `BRAND`, `CITY`, `DEMO_MODE`, `EMAIL`, `POSTAL_CODE`, `SERVICE_AREA`, `SITE_URL`, `STREET` (Task 2)
- Produces: the page shell every route renders inside (banner + nav + `<main>` + footer), `robots()` and `sitemap()` route handlers, and the 404 page.

- [ ] **Step 1: Create `src/app/icon.svg`** (favicon, auto-detected by Next.js)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#1c2a5e" />
  <path d="M18 6 9 18h6l-1 8 10-12h-6l1-8z" fill="#f0ad1f" />
</svg>
```

- [ ] **Step 2: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import DemoBanner from "@/components/DemoBanner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ADDRESS, BRAND, CITY, DEMO_MODE, EMAIL, POSTAL_CODE, SERVICE_AREA, SITE_URL, STREET } from "@/lib/infos";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const TITLE = `${BRAND} — Électricité générale, climatisation et bornes de recharge à Marly-sur-Arroux`;
const DESCRIPTION =
  "Artisan électricien à Marly-sur-Arroux (Saône-et-Loire) : électricité générale, mise aux normes, dépannage, domotique, climatisation réversible, chauffage électrique et bornes de recharge pour véhicules électriques.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${BRAND}` },
  description: DESCRIPTION,
  // Démo : pas d'indexation tant que le site n'est pas livré.
  robots: DEMO_MODE ? { index: false, follow: false } : undefined,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: BRAND,
    title: TITLE,
    description: DESCRIPTION,
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Electrician",
  name: BRAND,
  url: SITE_URL,
  telephone: "+33634140274",
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: STREET,
    postalCode: POSTAL_CODE,
    addressLocality: CITY,
    addressCountry: "FR",
  },
  areaServed: SERVICE_AREA,
  description: `${BRAND} — électricité générale, climatisation réversible, domotique et bornes de recharge IRVE. ${ADDRESS}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        <DemoBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create `src/app/robots.ts`**

```typescript
import type { MetadataRoute } from "next";
import { DEMO_MODE, SITE_URL } from "@/lib/infos";

// Obligatoire avec `output: "export"` : sans ça, le build refuse la route.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Démo : rien n'est indexé tant que le site n'est pas livré.
  if (DEMO_MODE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
```

- [ ] **Step 4: Create `src/app/sitemap.ts`**

```typescript
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/infos";

// Obligatoire avec `output: "export"` : sans ça, le build refuse la route.
export const dynamic = "force-static";

const ROUTES = [
  "/",
  "/electricite-generale/",
  "/chauffage-climatisation-ventilation/",
  "/bornes-de-recharge-irve/",
  "/contact/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "yearly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
```

- [ ] **Step 5: Create `src/app/not-found.tsx`**

```tsx
import Link from "next/link";
import { Container } from "@/components/Section";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-green">Erreur 404</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-navy">Cette page n’existe pas</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted">Le lien est peut-être incorrect ou la page a été déplacée.</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-gold px-7 py-4 font-semibold text-navy-deep transition-colors hover:bg-gold-dark"
        >
          Retour à l’accueil
        </Link>
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Verify the build**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build`
Expected: `Compiled successfully`, `out/` now contains `robots.txt` and `sitemap.xml`.

- [ ] **Step 7: Visual check of the shell**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run dev`, open `http://localhost:3003` in the browser.
Expected: demo banner at the top, Bailey logo + 4 nav links + gold "Appeler" button in the header, placeholder home page text, navy footer with the 3 contact links and 4 nav links, no console errors. Stop the dev server after checking (Ctrl+C).

- [ ] **Step 8: Commit**

```bash
git add src/app/layout.tsx src/app/icon.svg src/app/robots.ts src/app/sitemap.ts src/app/not-found.tsx
git commit -m "Add root layout, favicon, robots/sitemap, and 404 page"
```

---

## Task 7: Homepage

**Files:**
- Create: `src/components/IrveIllustration.tsx`
- Modify: `src/app/page.tsx` (replace placeholder from Task 1)

**Interfaces:**
- Consumes: `Icon`/`IconName`, `Logo` (Task 3); `Container`, `SectionHeading`, `CtaBand`, `ContactButtons`, `PhotoSlot`, `Testimonial`, `CertBadges` (Task 4); `PHOTOS` (Task 2)
- Produces: `IrveIllustration` (default export, `{ className? }`) — reused as-is by Task 10.

- [ ] **Step 1: Create `src/components/IrveIllustration.tsx`**

Recolor of the Attis reference illustration (navy body, gold accent instead of navy/cyan) — a generic wallbox, not a real product photo:

```tsx
/**
 * Illustration d'une borne murale de recharge (wallbox) et de son câble, à poser sur fond navy foncé.
 * Volontairement générique : ce n'est ni une photo ni un modèle réel de borne.
 */
export default function IrveIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 420" role="img" aria-label="Illustration d’une borne de recharge murale" className={className}>
      <defs>
        <radialGradient id="irve-glow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#f0ad1f" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f0ad1f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="irve-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a3670" />
          <stop offset="100%" stopColor="#0f1638" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="180" r="190" fill="url(#irve-glow)" />
      <rect x="70" y="40" width="260" height="300" rx="28" fill="#ffffff" fillOpacity="0.05" />
      <rect x="140" y="70" width="120" height="210" rx="26" fill="url(#irve-body)" stroke="#f0ad1f" strokeOpacity="0.6" strokeWidth="2" />
      <rect x="160" y="92" width="80" height="62" rx="14" fill="#0f1638" />
      <path d="M204 100 180 132h16l-4 18 24-32h-16l4-18z" fill="#f0ad1f" />
      <circle cx="200" cy="186" r="9" fill="#f0ad1f" />
      <circle cx="200" cy="186" r="15" fill="none" stroke="#f0ad1f" strokeOpacity="0.35" strokeWidth="2" />
      <rect x="172" y="226" width="56" height="30" rx="10" fill="#0f1638" stroke="#ffffff" strokeOpacity="0.25" />
      <path d="M200 256 C 200 330, 300 300, 306 366" fill="none" stroke="#d5dbf7" strokeWidth="9" strokeLinecap="round" />
      <rect x="290" y="360" width="34" height="42" rx="10" fill="#1c2a5e" />
      <rect x="298" y="402" width="6" height="10" rx="2" fill="#d5dbf7" />
      <rect x="310" y="402" width="6" height="10" rx="2" fill="#d5dbf7" />
      <path d="M40 414h320" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
```

- [ ] **Step 2: Replace `src/app/page.tsx`**

```tsx
import Link from "next/link";
import ContactButtons from "@/components/ContactButtons";
import CertBadges from "@/components/CertBadges";
import Icon, { type IconName } from "@/components/Icons";
import IrveIllustration from "@/components/IrveIllustration";
import PhotoSlot from "@/components/PhotoSlot";
import { Container, CtaBand, SectionHeading } from "@/components/Section";
import Testimonial from "@/components/Testimonial";
import { CERTIFICATIONS, SERVICE_AREA } from "@/lib/infos";
import { PHOTOS } from "@/lib/photos";

const SERVICES: { icon: IconName; title: string; text: string; href: string }[] = [
  {
    icon: "home",
    title: "Électricité Générale",
    text: "Installation, mise aux normes, dépannage, domotique et vidéosurveillance pour particuliers et professionnels.",
    href: "/electricite-generale/",
  },
  {
    icon: "flame",
    title: "Chauffage & Climatisation",
    text: "Climatisation réversible, chauffage électrique et ventilation, installés et entretenus toute l'année.",
    href: "/chauffage-climatisation-ventilation/",
  },
  {
    icon: "bolt",
    title: "Bornes de recharge",
    text: "Installation de bornes de recharge pour véhicules électriques, chez vous comme en entreprise.",
    href: "/bornes-de-recharge-irve/",
  },
];

const IRVE_POINTS = ["Visite technique et devis", "Installation soignée et mise en service", "Conseils adaptés à votre véhicule"];

const REALISATIONS = [PHOTOS.tableauElectrique, PHOTOS.climatisation, PHOTOS.borneIrve];

export default function Accueil() {
  return (
    <>
      {/* Héros */}
      <section className="bg-gradient-to-b from-mist to-white">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-green">{SERVICE_AREA}</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              Électricité générale, climatisation et bornes de recharge à Marly-sur-Arroux
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Bailey Électricité installe et dépanne votre tableau électrique, votre climatisation réversible, votre
              chauffage et votre borne de recharge pour véhicule électrique. Noté 4,9/5 sur Google (17 avis).
            </p>
            <ContactButtons size="lg" className="mt-8" />
            <p className="mt-4 text-sm text-muted">
              Ou{" "}
              <Link href="/contact/" className="font-semibold text-navy underline underline-offset-4">
                toutes les façons de nous joindre
              </Link>
              .
            </p>
          </div>
          <PhotoSlot photo={PHOTOS.hero} ratio="4/3" priority />
        </Container>
      </section>

      {/* Certifications (masqué tant que CERTIFICATIONS est vide) */}
      {CERTIFICATIONS.length > 0 && (
        <section className="pb-4">
          <Container>
            <CertBadges />
          </Container>
        </section>
      )}

      {/* Services */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Nos services"
            title="Un seul artisan pour votre électricité, votre confort et votre mobilité électrique"
            intro="De l'installation au dépannage, Bailey Électricité intervient chez les particuliers et les professionnels."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {SERVICES.map((service) => (
              <li key={service.title} className="rounded-3xl border border-line bg-white p-7 shadow-sm">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-navy text-white">
                  <Icon name={service.icon} className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-navy">{service.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{service.text}</p>
                <Link href={service.href} className="mt-4 inline-flex items-center gap-2 font-semibold text-navy underline-offset-4 hover:underline">
                  En savoir plus
                  <Icon name="arrow" className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Bloc vedette IRVE */}
      <section className="bg-navy-deep py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-bold text-gold">
              <Icon name="bolt" className="size-4" />
              Bornes de recharge IRVE
            </p>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Votre borne de recharge, installée à Marly-sur-Arroux
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/80">
              Bailey Électricité installe votre borne pour véhicule électrique chez vous ou dans votre entreprise, à
              Marly-sur-Arroux et alentours.
            </p>
            <ul className="mt-6 space-y-3">
              {IRVE_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-3 text-white">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold text-navy-deep">
                    <Icon name="check" className="size-4" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/bornes-de-recharge-irve/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-base font-semibold text-navy-deep transition-colors hover:bg-gold-dark"
            >
              Découvrir l'installation de bornes
              <Icon name="arrow" className="size-5" />
            </Link>
          </div>
          <IrveIllustration className="mx-auto w-full max-w-sm" />
        </Container>
      </section>

      {/* Réalisations */}
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Réalisations" title="Des installations propres, réalisées par Bailey" intro="Quelques exemples d'interventions dans la région." />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {REALISATIONS.map((photo) => (
              <li key={photo.caption}>
                <PhotoSlot photo={photo} ratio="4/3" sizes="(min-width: 768px) 33vw, 100vw" />
                <p className="mt-3 text-sm font-semibold text-navy">{photo.caption}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Témoignage */}
      <section className="bg-mist py-20">
        <Container>
          <SectionHeading eyebrow="Ils nous font confiance" title="L'avis d'une cliente" align="center" />
          <div className="mt-10">
            <Testimonial />
          </div>
        </Container>
      </section>

      <CtaBand
        title="Un projet d'électricité, de climatisation ou de borne de recharge ?"
        text="Parlez-en directement à Bailey Électricité : par téléphone, sur WhatsApp ou par e-mail."
      />
    </>
  );
}
```

- [ ] **Step 3: Verify the build**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 4: Visual check**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run dev`, open `http://localhost:3003`.
Expected: hero, no certifications band (array is empty), 3 service cards each linking out, dark IRVE block with illustration, 3 placeholder photo frames with captions, testimonial quote, final CTA band. No console errors. Stop the dev server after checking.

- [ ] **Step 5: Commit**

```bash
git add src/components/IrveIllustration.tsx src/app/page.tsx
git commit -m "Build the homepage"
```

---

## Task 8: Électricité Générale page

**Files:**
- Create: `src/app/electricite-generale/page.tsx`

**Interfaces:**
- Consumes: `Icon`/`IconName` (Task 3); `Container`, `SectionHeading`, `CtaBand`, `ContactButtons` (Task 4); `CertBadges` (Task 4); `PhotoSlot` (Task 4); `CERTIFICATIONS` (Task 2); `PHOTOS` (Task 2)

- [ ] **Step 1: Create `src/app/electricite-generale/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import CertBadges from "@/components/CertBadges";
import ContactButtons from "@/components/ContactButtons";
import Icon, { type IconName } from "@/components/Icons";
import PhotoSlot from "@/components/PhotoSlot";
import { Container, CtaBand, SectionHeading } from "@/components/Section";
import { CERTIFICATIONS } from "@/lib/infos";
import { PHOTOS } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Électricité générale, mise aux normes et dépannage à Marly-sur-Arroux",
  description:
    "Installation électrique, mise aux normes, dépannage, domotique et vidéosurveillance à Marly-sur-Arroux par Bailey Électricité, pour particuliers et professionnels.",
  alternates: { canonical: "/electricite-generale/" },
};

const SERVICES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "bolt",
    title: "Installation électrique",
    text: "Câblage, tableau électrique, prises et éclairage, pour une installation neuve ou une rénovation complète.",
  },
  {
    icon: "shield",
    title: "Mise aux normes",
    text: "Mise en conformité de votre installation électrique existante, pour votre sécurité et celle de votre logement.",
  },
  {
    icon: "wrench",
    title: "Dépannage",
    text: "Panne, disjoncteur qui saute, prise qui ne fonctionne plus : intervention rapide pour remettre votre installation en état.",
  },
  {
    icon: "home",
    title: "Domotique",
    text: "Pilotage de votre éclairage, vos volets ou votre chauffage à distance, pour plus de confort au quotidien.",
  },
  {
    icon: "camera",
    title: "Vidéosurveillance",
    text: "Installation de caméras et systèmes de surveillance pour sécuriser votre logement ou votre local professionnel.",
  },
  {
    icon: "pin",
    title: "Courant faible & prise de terre",
    text: "Réseaux courant faible, mise à la terre et parafoudre, pour une installation électrique sûre et durable.",
  },
];

const STEPS = [
  { title: "Vous nous contactez", text: "Par téléphone, WhatsApp ou e-mail, décrivez-nous votre besoin." },
  { title: "Diagnostic sur place", text: "Nous examinons votre installation et évaluons les travaux nécessaires." },
  { title: "Devis détaillé", text: "Vous recevez une proposition claire, sans mauvaise surprise." },
  { title: "Intervention", text: "Nous réalisons les travaux et vous expliquons ce qui a été fait." },
];

export default function ElectriciteGenerale() {
  return (
    <>
      <section className="bg-gradient-to-b from-mist to-white">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="Électricité Générale"
              title="Installation, mise aux normes et dépannage électrique"
              intro="Bailey Électricité intervient chez les particuliers et les professionnels : installation neuve, mise aux normes, dépannage, domotique et vidéosurveillance."
            />
            <ContactButtons size="lg" className="mt-8" />
          </div>
          <PhotoSlot photo={PHOTOS.tableauElectrique} ratio="4/3" priority />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Nos prestations" title="Toutes les interventions sur votre installation électrique" />
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <li key={service.title} className="rounded-3xl border border-line bg-white p-7 shadow-sm">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-navy text-white">
                  <Icon name={service.icon} className="size-6" />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold text-navy">{service.title}</h2>
                <p className="mt-2 leading-relaxed text-muted">{service.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-mist py-20">
        <Container>
          <SectionHeading eyebrow="Comment ça se passe" title="Une intervention en quatre étapes" align="center" />
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-full bg-navy font-display text-lg font-extrabold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {CERTIFICATIONS.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeading eyebrow="Qualité et garanties" title="Un artisan certifié" />
            <CertBadges className="mt-10" />
          </Container>
        </section>
      )}

      <section className="py-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-navy-deep p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">
                <Icon name="flame" className="size-4" />
                Chauffage & Climatisation
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-white">Un projet de confort thermique ?</h2>
              <p className="mt-2 text-white/80">Bailey installe aussi votre climatisation réversible et votre chauffage électrique.</p>
            </div>
            <Link
              href="/chauffage-climatisation-ventilation/"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-dark"
            >
              Découvrir le confort thermique
              <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        </Container>
      </section>

      <CtaBand
        title="Un projet d'installation ou de dépannage électrique ?"
        text="Contactez directement Bailey Électricité : par téléphone, sur WhatsApp ou par e-mail."
      />
    </>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 3: Visual check**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run dev`, open `http://localhost:3003/electricite-generale/`.
Expected: hero with photo placeholder, 6 service cards, 4-step timeline, no certifications section (array still empty), cross-link panel to the Chauffage & Climatisation page, final CTA band. Stop the dev server after checking.

- [ ] **Step 4: Commit**

```bash
git add src/app/electricite-generale/page.tsx
git commit -m "Add Electricite Generale service page"
```

---

## Task 9: Chauffage, Climatisation & Ventilation page

**Files:**
- Create: `src/app/chauffage-climatisation-ventilation/page.tsx`

**Interfaces:**
- Consumes: `Icon` (Task 3); `Container`, `CtaBand`, `SectionHeading`, `ContactButtons` (Task 4); `CertBadges` (Task 4); `PhotoSlot` (Task 4); `type Photo`, `PHOTOS` (Task 2, including the `ventilation` key added in this plan's Task 2); `CERTIFICATIONS` (Task 2)

- [ ] **Step 1: Create `src/app/chauffage-climatisation-ventilation/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import CertBadges from "@/components/CertBadges";
import ContactButtons from "@/components/ContactButtons";
import Icon from "@/components/Icons";
import PhotoSlot from "@/components/PhotoSlot";
import { Container, CtaBand, SectionHeading } from "@/components/Section";
import { CERTIFICATIONS } from "@/lib/infos";
import { PHOTOS, type Photo } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Climatisation réversible, chauffage électrique et ventilation à Marly-sur-Arroux",
  description:
    "Installation de climatisation réversible, de chauffage électrique et de ventilation (VMC) à Marly-sur-Arroux par Bailey Électricité.",
  alternates: { canonical: "/chauffage-climatisation-ventilation/" },
};

const SERVICES: { title: string; text: string; points: string[]; photo: Photo }[] = [
  {
    title: "Climatisation réversible",
    text: "Une climatisation réversible rafraîchit vos pièces l'été et peut aussi chauffer l'hiver. Bailey vous conseille sur le nombre et l'emplacement des unités, puis réalise une pose soignée.",
    points: ["Choix du nombre et de l'emplacement des unités", "Pose soignée et mise en service", "Explications sur l'utilisation au quotidien"],
    photo: PHOTOS.climatisation,
  },
  {
    title: "Chauffage électrique",
    text: "Vous installez ou remplacez votre système de chauffage ? Bailey vous conseille selon votre logement et prend en charge l'installation de bout en bout.",
    points: ["Conseil selon votre logement", "Installation par un artisan qualifié", "Mise en service et explications"],
    photo: PHOTOS.chauffage,
  },
  {
    title: "Ventilation (VMC)",
    text: "Une bonne ventilation évite l'humidité et renouvelle l'air de votre logement. Bailey installe des VMC simple ou double flux, hygroréglables ou non, adaptées à votre habitation.",
    points: ["VMC simple ou double flux", "Solutions hygroréglables", "Installation et réglage"],
    photo: PHOTOS.ventilation,
  },
];

const STEPS = [
  { title: "Vous nous contactez", text: "Par téléphone, WhatsApp ou e-mail, décrivez-nous votre projet." },
  { title: "Visite et conseil", text: "Nous étudions votre logement et vos besoins sur place." },
  { title: "Devis détaillé", text: "Vous recevez une proposition claire, sans mauvaise surprise." },
  { title: "Installation", text: "Nous installons, mettons en service et vous expliquons le fonctionnement." },
];

export default function ChauffageClimatisationVentilation() {
  return (
    <>
      <section className="bg-gradient-to-b from-mist to-white">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="Chauffage, Climatisation & Ventilation"
              title="Climatisation réversible, chauffage électrique et ventilation"
              intro="Bailey Électricité installe votre équipement de confort thermique, du conseil à la mise en service."
            />
            <ContactButtons size="lg" className="mt-8" />
          </div>
          <PhotoSlot photo={PHOTOS.chauffage} ratio="4/3" priority />
        </Container>
      </section>

      {SERVICES.map((service, index) => (
        <section key={service.title} className={index % 2 === 0 ? "py-16" : "bg-mist py-16"}>
          <Container className="grid items-center gap-10 lg:grid-cols-2">
            <div className={index % 2 === 1 ? "lg:order-2" : ""}>
              <h2 className="font-display text-3xl font-extrabold text-navy">{service.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">{service.text}</p>
              <ul className="mt-6 space-y-3">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-ink">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold text-navy-deep">
                      <Icon name="check" className="size-4" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <PhotoSlot photo={service.photo} ratio="4/3" sizes="(min-width: 1024px) 50vw, 100vw" />
          </Container>
        </section>
      ))}

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Comment ça se passe" title="Un projet en quatre étapes" align="center" />
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-full bg-navy font-display text-lg font-extrabold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {CERTIFICATIONS.length > 0 && (
        <section className="bg-mist py-20">
          <Container>
            <SectionHeading eyebrow="Qualité et garanties" title="Un artisan certifié" />
            <CertBadges className="mt-10" />
          </Container>
        </section>
      )}

      <section className="py-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-navy-deep p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">
                <Icon name="bolt" className="size-4" />
                Bornes de recharge IRVE
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-white">Vous roulez en électrique ?</h2>
              <p className="mt-2 text-white/80">Bailey installe aussi votre borne de recharge pour véhicule électrique.</p>
            </div>
            <Link
              href="/bornes-de-recharge-irve/"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-dark"
            >
              Découvrir les bornes
              <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        </Container>
      </section>

      <CtaBand
        title="Parlons de votre projet de chauffage ou de climatisation"
        text="Contactez directement Bailey Électricité : par téléphone, sur WhatsApp ou par e-mail."
      />
    </>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 3: Visual check**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run dev`, open `http://localhost:3003/chauffage-climatisation-ventilation/`.
Expected: hero, 3 alternating photo/text blocks (climatisation, chauffage, ventilation), 4-step timeline, no certifications section, cross-link panel to Bornes de recharge, final CTA band. Stop the dev server after checking.

- [ ] **Step 4: Commit**

```bash
git add src/app/chauffage-climatisation-ventilation/page.tsx
git commit -m "Add Chauffage, Climatisation and Ventilation service page"
```

---

## Task 10: Bornes de recharge IRVE page

**Files:**
- Create: `src/app/bornes-de-recharge-irve/page.tsx`

**Interfaces:**
- Consumes: `ContactButtons` (Task 4); `Icon`/`IconName` (Task 3); `IrveIllustration` (Task 7); `PhotoSlot` (Task 4); `Container`, `CtaBand`, `SectionHeading` (Task 4); `BRAND`, `SERVICE_AREA`, `SITE_URL`, `CERTIFICATIONS` (Task 2); `PHOTOS` (Task 2)

No certification is confirmed yet, so — unlike the Attis reference this page is adapted from — **nothing on this page claims "Certifié IRVE"** unless `CERTIFICATIONS` later gains an entry with `id === "irve"`. Both the hero pill and the dedicated certification block are conditional on that check.

- [ ] **Step 1: Create `src/app/bornes-de-recharge-irve/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import ContactButtons from "@/components/ContactButtons";
import Icon, { type IconName } from "@/components/Icons";
import IrveIllustration from "@/components/IrveIllustration";
import PhotoSlot from "@/components/PhotoSlot";
import { Container, CtaBand, SectionHeading } from "@/components/Section";
import { BRAND, CERTIFICATIONS, SERVICE_AREA, SITE_URL } from "@/lib/infos";
import { PHOTOS } from "@/lib/photos";

const TITLE = "Installateur de bornes de recharge IRVE à Marly-sur-Arroux";
const DESCRIPTION =
  "Installation de bornes de recharge pour véhicules électriques à Marly-sur-Arroux par Bailey Électricité : maison individuelle, copropriété, entreprise.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/bornes-de-recharge-irve/" },
  openGraph: { type: "website", locale: "fr_FR", siteName: BRAND, title: TITLE, description: DESCRIPTION },
};

const PUBLICS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "pin",
    title: "Maison individuelle",
    text: "Une borne au garage, dans la cour ou sur la façade, pour recharger chez vous chaque nuit.",
  },
  {
    icon: "shield",
    title: "Copropriété",
    text: "Un projet de recharge en parking collectif : Bailey vous conseille et chiffre l'installation.",
  },
  {
    icon: "bolt",
    title: "Entreprise",
    text: "Des bornes pour vos véhicules de service, vos salariés ou vos visiteurs.",
  },
];

const INCLUS = [
  "Visite technique et choix de l'emplacement",
  "Vérification de votre installation électrique",
  "Borne adaptée à votre véhicule et à votre usage",
  "Pose, raccordement et protections électriques",
  "Mise en service et explications d'utilisation",
];

const STEPS = [
  { title: "Vous nous contactez", text: "Par téléphone, WhatsApp ou e-mail, avec la marque de votre véhicule si vous l'avez." },
  { title: "Visite technique", text: "Nous repérons l'emplacement et vérifions votre installation électrique." },
  { title: "Devis détaillé", text: "Vous recevez une proposition claire, borne et pose comprises." },
  { title: "Installation", text: "Nous installons la borne, la mettons en service et vous montrons comment l'utiliser." },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Installation de bornes de recharge pour véhicules électriques",
  name: TITLE,
  provider: { "@type": "Electrician", name: BRAND, url: SITE_URL },
  areaServed: SERVICE_AREA,
  description: DESCRIPTION,
};

export default function BornesIrve() {
  const isIrveCertified = CERTIFICATIONS.some((c) => c.id === "irve");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      {/* Héros sombre, accent doré */}
      <section className="bg-navy-deep">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-bold text-gold">
              <Icon name="bolt" className="size-4" />
              {isIrveCertified ? "Certifié IRVE" : "Bornes de recharge"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Installateur de bornes de recharge à Marly-sur-Arroux
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Bailey Électricité installe votre borne de recharge pour véhicule électrique, chez vous, en copropriété
              ou dans votre entreprise, à {SERVICE_AREA}.{isIrveCertified ? " Artisan certifié IRVE." : ""}
            </p>
            <ContactButtons tone="dark" size="lg" className="mt-8" />
          </div>
          <IrveIllustration className="mx-auto w-full max-w-sm" />
        </Container>
      </section>

      {/* Pour qui */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Pour qui ?"
            title="Une solution de recharge adaptée à votre situation"
            intro="Que vous soyez particulier ou professionnel, nous étudions l'installation qui correspond à votre usage."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {PUBLICS.map((item) => (
              <li key={item.title} className="rounded-3xl border border-line bg-white p-7 shadow-sm">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-navy-deep text-gold">
                  <Icon name={item.icon} className="size-6" />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold text-navy">{item.title}</h2>
                <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Ce que comprend l'installation */}
      <section className="bg-mist py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="L'installation"
              title="Ce que comprend l'installation de votre borne"
              intro="Une prestation complète, pour que votre borne soit posée proprement et en toute sécurité."
            />
            <ul className="mt-8 space-y-3">
              {INCLUS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold text-navy-deep">
                    <Icon name="check" className="size-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <PhotoSlot photo={PHOTOS.borneIrveHero} ratio="4/3" sizes="(min-width: 1024px) 50vw, 100vw" />
        </Container>
      </section>

      {/* Étapes */}
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Comment ça se passe" title="Votre borne en quatre étapes" align="center" />
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-full bg-navy-deep font-display text-lg font-extrabold text-gold">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Certification IRVE — uniquement si confirmée */}
      {isIrveCertified && (
        <section className="pb-20">
          <Container>
            <div className="rounded-3xl bg-navy-deep p-8 sm:p-12">
              <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
                <span className="flex size-20 items-center justify-center rounded-3xl bg-gold text-navy-deep">
                  <Icon name="bolt" className="size-10" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">Bailey Électricité est certifié IRVE</h2>
                  <p className="mt-3 text-lg leading-relaxed text-white/80">
                    IRVE signifie « Infrastructure de Recharge pour Véhicules Électriques ». Cette certification atteste
                    de la compétence de l'installateur pour ce type d'installation.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      <section className="pb-20">
        <Container>
          <p className="text-center text-muted">
            Vous cherchez aussi une climatisation ou un chauffage électrique ?{" "}
            <Link href="/chauffage-climatisation-ventilation/" className="font-semibold text-navy underline underline-offset-4">
              Découvrez notre offre chauffage, climatisation et ventilation
            </Link>
            .
          </p>
        </Container>
      </section>

      <CtaBand
        title="Un projet de borne de recharge à Marly-sur-Arroux ?"
        text="Contactez directement Bailey Électricité : par téléphone, sur WhatsApp ou par e-mail."
      />
    </>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 3: Visual check**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run dev`, open `http://localhost:3003/bornes-de-recharge-irve/`.
Expected: dark hero with a "Bornes de recharge" pill (**not** "Certifié IRVE" — `CERTIFICATIONS` is still empty), illustration, 3 "pour qui" cards, installation checklist with photo, 4-step timeline, **no** certification callout block, cross-link to the chauffage/climatisation page, final CTA band. Stop the dev server after checking.

- [ ] **Step 4: Commit**

```bash
git add src/app/bornes-de-recharge-irve/page.tsx
git commit -m "Add Bornes de recharge IRVE service page"
```

---

## Task 11: Contact page

**Files:**
- Create: `src/app/contact/page.tsx`

**Interfaces:**
- Consumes: `Icon`/`IconName` (Task 3); `Container`, `SectionHeading` (Task 4); `ADDRESS`, `EMAIL`, `EMAIL_MAILTO`, `MAPS_URL`, `PHONE_DISPLAY`, `PHONE_TEL`, `SERVICE_AREA`, `WHATSAPP_ENABLED`, `WHATSAPP_URL` (Task 2)

- [ ] **Step 1: Create `src/app/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import Icon, { type IconName } from "@/components/Icons";
import { Container, SectionHeading } from "@/components/Section";
import {
  ADDRESS,
  EMAIL,
  EMAIL_MAILTO,
  MAPS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  SERVICE_AREA,
  WHATSAPP_ENABLED,
  WHATSAPP_URL,
} from "@/lib/infos";

export const metadata: Metadata = {
  title: "Contact — électricité, climatisation et bornes de recharge à Marly-sur-Arroux",
  description: `Contactez Bailey Électricité à Marly-sur-Arroux : téléphone ${PHONE_DISPLAY}, WhatsApp ou e-mail. ${ADDRESS}.`,
  alternates: { canonical: "/contact/" },
};

type Channel = { icon: IconName; label: string; value: string; hint: string; href: string; external?: boolean };

const CHANNELS: Channel[] = [
  { icon: "phone", label: "Téléphone", value: PHONE_DISPLAY, hint: "Le plus direct", href: PHONE_TEL },
  ...(WHATSAPP_ENABLED
    ? [
        {
          icon: "chat",
          label: "WhatsApp",
          value: "Écrire sur WhatsApp",
          hint: "Idéal pour envoyer des photos",
          href: WHATSAPP_URL,
          external: true,
        } satisfies Channel,
      ]
    : []),
  { icon: "mail", label: "E-mail", value: EMAIL, hint: "Pour décrire votre projet en détail", href: EMAIL_MAILTO },
];

const TIPS = [
  "Votre commune",
  "Le type de logement ou de local (maison, appartement, entreprise…)",
  "La nature du projet : installation, dépannage, climatisation, chauffage ou borne de recharge",
  "Quelques photos de votre installation actuelle, si possible",
];

export default function Contact() {
  return (
    <>
      <section className="bg-gradient-to-b from-mist to-white">
        <Container className="py-16 lg:py-20">
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Contactez Bailey Électricité"
            intro="Installation, dépannage, climatisation, chauffage ou borne de recharge : décrivez-nous votre projet, par le moyen qui vous convient."
          />
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <ul className={`grid gap-6 ${CHANNELS.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {CHANNELS.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group block h-full rounded-3xl border border-line bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-gold text-navy-deep">
                    <Icon name={channel.icon} className="size-6" />
                  </span>
                  <p className="mt-5 text-sm font-bold uppercase tracking-wider text-green">{channel.label}</p>
                  <p className="mt-1 break-words font-display text-xl font-extrabold text-navy group-hover:underline">{channel.value}</p>
                  <p className="mt-2 text-sm text-muted">{channel.hint}</p>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-mist p-8">
              <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-navy">
                <Icon name="pin" className="size-5 text-green" />
                Où nous trouver
              </h2>
              <p className="mt-4 text-lg text-ink">{ADDRESS}</p>
              <p className="mt-1 text-muted">Zone d'intervention : {SERVICE_AREA}.</p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-navy/30 px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy/5"
              >
                Voir l'itinéraire
                <Icon name="arrow" className="size-4" />
              </a>
            </div>

            <div className="rounded-3xl bg-navy-deep p-8">
              <h2 className="font-display text-xl font-extrabold text-white">Pour nous aider à vous répondre</h2>
              <p className="mt-3 text-white/80">Quand vous nous contactez, précisez si possible :</p>
              <ul className="mt-4 space-y-3">
                {TIPS.map((tip) => (
                  <li key={tip} className="flex items-start gap-3 text-white">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold text-navy-deep">
                      <Icon name="check" className="size-4" />
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 3: Visual check**

Run: `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run dev`, open `http://localhost:3003/contact/`.
Expected: 3 contact cards (phone/WhatsApp/e-mail) all with correct Bailey values, address + service area + maps link, tips panel. Stop the dev server after checking.

- [ ] **Step 4: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "Add Contact page"
```

---

## Task 12: Deploy workflow and README

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

**Interfaces:**
- None (infrastructure/documentation only — no code imports these).

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```bash
mkdir -p .github/workflows
```

```yaml
name: Déploiement GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - uses: actions/configure-pages@v5

      - run: npm ci

      # Le site est servi sous /<nom-du-dépôt> sur github.io.
      # Avec un domaine personnalisé (CNAME), supprimer ces deux variables d'environnement.
      - run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}
          NEXT_PUBLIC_SITE_URL: https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}

      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Note: the branch is `master` (not `main`), matching this repo's actual default branch — confirm with `git branch --show-current` if unsure before committing this file.

- [ ] **Step 2: Create `README.md`**

```markdown
# Bailey Électricité — site vitrine

Site statique (Next.js 16 + Tailwind CSS v4) pour Bailey Électricité, électricité générale /
climatisation / chauffage / ventilation / bornes de recharge IRVE à Marly-sur-Arroux (71). 5
pages : Accueil, Électricité Générale, Chauffage & Climatisation & Ventilation, Bornes de
recharge IRVE, Contact.

**Aucun serveur, aucun abonnement, aucun formulaire** : le site se réduit à un dossier de
fichiers statiques (`out/`) qui se dépose sur n'importe quel hébergeur. Le contact se fait par
téléphone, WhatsApp et e-mail.

## Lancer le site en local

```bash
npm install
npm run dev        # http://localhost:3003
npm run build      # génère le site statique dans out/
npm run preview    # sert out/ sur http://localhost:3003
```

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Téléphone, e-mail, adresse, WhatsApp, zone d'intervention, certifications, menu | `src/lib/infos.ts` |
| Ajouter les vraies photos | `src/lib/photos.ts` (voir ci-dessous) |
| Les textes des pages | `src/app/**/page.tsx` |
| Couleurs et polices | `src/app/globals.css` (bloc `@theme`) |
| Le témoignage | `src/components/Testimonial.tsx` |

Aucun numéro ni adresse n'est codé en dur dans un composant : tout vient de `src/lib/infos.ts`.

### Ajouter les vraies photos

1. Déposer les fichiers (WebP ou JPEG, 1600 px de large maximum) dans `public/images/photos/`.
2. Dans `src/lib/photos.ts`, renseigner `src` (ex. `"/images/photos/tableau-chantier.webp"`) et un
   `alt` décrivant fidèlement l'image.

Tant que `src` est absent, un cadre de remplacement s'affiche. Rien d'autre à toucher.

### Ajouter une certification

Aucune certification n'est confirmée pour l'instant. Pour en ajouter une, ajouter une entrée dans
`CERTIFICATIONS` dans `src/lib/infos.ts` :

```typescript
export const CERTIFICATIONS = [
  { id: "irve", label: "Certifié IRVE", detail: "Bornes de recharge" },
];
```

Le badge apparaît automatiquement partout où `CertBadges` est utilisé, et le bandeau "Certifié
IRVE" s'active sur la page des bornes de recharge si l'`id` vaut `"irve"`.

### Changer le logo

`public/images/logo-redraw.svg` est un redessin réalisé à partir de la vidéo Facebook/PagesJaunes
fournie par l'utilisateur — Loïc n'a pas de fichier haute résolution. Pour en changer, remplacer
le fichier et ajuster `LOGO_FILE` dans `src/lib/infos.ts` si le nom change.

## Mode démo

`DEMO_MODE` (dans `src/lib/infos.ts`) vaut `true` pendant la phase de présentation à Loïc : le
site est **non indexé** (`noindex, nofollow` + `robots.txt` en Disallow) et un bandeau « Maquette
de démonstration » s'affiche.

## Déploiement sur GitHub Pages (gratuit)

Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque push sur
`master`. Le dépôt est déjà public sous `https://github.com/Gooxuu/bailey-electricite` — dans
*Settings → Pages*, choisir **Source : GitHub Actions** si ce n'est pas déjà fait. Le site est
alors servi sur `https://gooxuu.github.io/bailey-electricite/`.

**Avec un domaine personnalisé** (ex. `bailey-electricite.fr`) : le site est alors à la racine.
Supprimer les deux variables `NEXT_PUBLIC_BASE_PATH` et `NEXT_PUBLIC_SITE_URL` du workflow,
ajouter un fichier `public/CNAME` contenant le domaine, et déclarer le domaine dans
*Settings → Pages*.

## Checklist à la signature

- [ ] `DEMO_MODE = false` dans `src/lib/infos.ts` (retire le bandeau, autorise l'indexation, active le sitemap).
- [ ] Confirmer les certifications avec Loïc (Qualifelec/RGE/IRVE/décennale) et les ajouter si applicable.
- [ ] **Mentions légales** (raison sociale, forme juridique, SIRET, hébergeur) : obligatoires, non incluses dans la démo.
- [ ] Vraies photos de chantiers dans `src/lib/photos.ts`.
- [ ] Logo vectoriel validé par Loïc (ou fichier haute définition fourni par lui).
- [ ] Vérifier que le 06 34 14 02 74 est bien sur WhatsApp, sinon `WHATSAPP_ENABLED = false`.
- [ ] Domaine : `SITE_URL` dans `src/lib/infos.ts`, fichier `public/CNAME`, DNS.
- [ ] Relire les textes avec Loïc (services, zone d'intervention exacte).
- [ ] Transférer le dépôt sur le compte GitHub de Loïc.

## Notes techniques

- Next.js **16.2** : `output: 'export'` (site statique). Les routes `sitemap.ts` et `robots.ts`
  déclarent `export const dynamic = "force-static"`, sans quoi le build refuse.
- `next/image` en mode `unoptimized` (pas de serveur d'optimisation) : optimiser les photos avant
  de les déposer. `next/link` applique le `basePath` automatiquement ; `next/image` et les
  balises simples non : utiliser `asset()` de `src/lib/infos.ts`.
- Le copyright utilise l'année courante (composant `CurrentYear`).
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "Add GitHub Pages deploy workflow and README"
```

---

## Task 13: Full-site verification and push

**Files:**
- None (verification only).

**Interfaces:**
- Consumes: the whole site built in Tasks 1–12.

- [ ] **Step 1: Full build and lint**

Run:

```bash
$env:Path = "C:\Program Files\nodejs;$env:Path"; npm run build; npm run lint
```

Expected: both succeed with no errors or warnings. `out/` contains `index.html`, `electricite-generale/index.html`, `chauffage-climatisation-ventilation/index.html`, `bornes-de-recharge-irve/index.html`, `contact/index.html`, `robots.txt`, `sitemap.xml`. Open `out/sitemap.xml` and confirm it lists exactly 5 `<url>` entries, one per route above — `sitemap.ts`'s `ROUTES` array (Task 6) is a plain string list with no type-level link to the actual page folders, so a missing route would build silently without this manual check.

- [ ] **Step 2: Browser walkthrough (desktop)**

Run `npm run dev`, then in the browser visit each of the 5 pages (`/`, `/electricite-generale/`, `/chauffage-climatisation-ventilation/`, `/bornes-de-recharge-irve/`, `/contact/`) and check:
- The demo banner, logo, nav (all 4 links), and footer render on every page with no layout shift or overlap.
- Every internal link (service cards, cross-link panels, footer nav, "toutes les façons de nous joindre") lands on a real page, never a 404.
- The phone button (`06 34 14 02 74`), WhatsApp button, and e-mail link all use the correct Bailey values everywhere they appear.
- No certification badge or "Certifié IRVE" text appears anywhere on the site (`CERTIFICATIONS` is still empty).
- No console errors (check via the browser's console).

- [ ] **Step 3: Mobile viewport check**

Resize the browser to a mobile width (375px) and recheck the homepage and one service page: the hamburger menu opens/closes, the mobile WhatsApp link appears in the open menu, no horizontal scroll, hero/photo/CTA sections stack cleanly.

- [ ] **Step 4: Push to GitHub and enable Pages**

```bash
git push origin master
```

Then, if not already done, open `https://github.com/Gooxuu/bailey-electricite/settings/pages` and set **Source: GitHub Actions** so the `deploy.yml` workflow (Task 12) can publish. Confirm the Action run succeeds (`https://github.com/Gooxuu/bailey-electricite/actions`) and that `https://gooxuu.github.io/bailey-electricite/` loads with the demo banner visible.

- [ ] **Step 5: Report back**

Tell the user the live demo URL and remind them it's `noindex`'d and unbranded-domain until `DEMO_MODE` is turned off at signature (see the README checklist, Task 12).
