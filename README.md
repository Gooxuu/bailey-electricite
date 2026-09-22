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
| Téléphone, e-mail, adresse, WhatsApp, zone d'intervention, certifications, menu, horaires, moyens de paiement, note Google | `src/lib/infos.ts` |
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
