# Site vitrine Bailey Électricité — conception

## Contexte et objectif

Loïc Bailey (Bailey Électricité Générale, Marly-sur-Arroux, 71) a été contacté par téléphone et
s'est montré intéressé par un site vitrine. Ce document cadre la conception d'une démo à lui
envoyer, sur le même modèle que le site déjà livré pour Attis International
(https://github.com/Gooxuu/attis-international) : un site 100% statique, sans back-end, avec le
contact géré uniquement par téléphone/WhatsApp/e-mail.

Le projet est un nouveau dépôt, actuellement vide, initialisé dans
`C:\Users\Gok\Desktop\Site Bailey Electricite`.

## Stack technique

Identique à Attis International :

- **Next.js 16** (App Router, TypeScript), export statique (`output: 'export'`)
- **Tailwind CSS v4**, thème défini en CSS (`@theme` dans `globals.css`)
- `images.unoptimized: true` (obligatoire en export statique avec le loader par défaut —
  confirmé à jour via Context7 sur `/vercel/next.js/v16.2.9`)
- Aucun serveur, aucun formulaire, aucune base de données
- Déploiement GitHub Pages via GitHub Actions (mêmes variables `NEXT_PUBLIC_BASE_PATH` /
  `NEXT_PUBLIC_SITE_URL` qu'Attis)
- Node.js (installé le 2026-09-22 sur cette machine, absent auparavant) requis pour le
  développement local (`npm install`, `npm run dev`, `npm run build`)

## Données de l'entreprise (source pour `src/lib/infos.ts`)

Collectées depuis PagesJaunes et Facebook (captures fournies par l'utilisateur le 2026-09-22) :

| Champ | Valeur |
|---|---|
| Nom | Bailey Électricité (Générale) |
| Contact | Loïc Bailey |
| Téléphone | 06 34 14 02 74 |
| WhatsApp | Activé (même numéro) — à reconfirmer avant l'envoi si besoin |
| E-mail | loic.bailey.pro@gmail.com |
| Adresse | Lieu-dit les Mazilles, 71420 Marly-sur-Arroux |
| Zone d'intervention | "Marly-sur-Arroux et alentours" |
| Horaires | Lun-Ven 08h00-19h00, Sam 08h00-12h00, Dim fermé |
| Moyens de paiement | Chèque, CB, Visa |
| Clientèle | Particuliers et professionnels |
| Facebook | facebook.com/share/1Actrqrwyc |
| Avis | 4,9/5 sur Google (17 avis), 5/5 sur PagesJaunes (2 avis) |
| Certifications | **Inconnues** — aucun badge observé (Qualifelec/RGE/IRVE/décennale). Section à activer seulement si Loïc confirme. |

**Témoignage à reprendre** (avis PagesJaunes, anais2.dasilva, 5/5) :
> « Très bon électricien. Intervention à mon domicile pour un problème électrique. Travail
> sérieux et propre, professionnel de bon conseil. Tout fonctionne très bien maintenant, je
> recommande vivement. »

**Services** (recoupés carte de visite Facebook + PagesJaunes) : électricité générale, mise aux
normes, installation de prise de terre, électricité courant faible/domestique, dépannage,
domotique, vidéosurveillance, climatisation réversible, chauffage électrique, ventilation
(VMC/VMI, hygroréglable, simple ou double flux), bornes de recharge véhicule électrique (IRVE).
Vente d'alarmes et parafoudres. Marques partenaires vues en photo : Legrand, Hager, Schneider
Electric, ABB, INTUIS.

## Pages et navigation

Bailey couvre plus de champs qu'Attis (qui n'avait que 2 pages service) : 3 pages service pour
rester lisible sans surcharger un seul menu.

1. **Accueil** (`/`)
2. **Électricité Générale** (`/electricite-generale/`) — installation, mise aux normes,
   dépannage, domotique, vidéosurveillance, courant faible
3. **Chauffage, Climatisation & Ventilation** (`/chauffage-climatisation-ventilation/`) — clim
   réversible, chauffage électrique, VMC/VMI
4. **Bornes de recharge IRVE** (`/bornes-de-recharge-irve/`)
5. **Contact** (`/contact/`)

## Structure de la page d'accueil

Reprend le schéma éprouvé d'Attis, dans cet ordre :

1. **Hero** — accroche, sous-texte, boutons de contact (tel/WhatsApp/e-mail), photo (`PhotoSlot`)
2. **Certifications** — section conditionnelle, absente tant qu'aucune certification n'est
   confirmée par Loïc (pas de composant `CertBadges` vide ou de badge inventé)
3. **Services** — grille des 3 grandes familles (une carte par page service ci-dessus)
4. **Bloc vedette** — mise en avant des bornes de recharge IRVE (service différenciant à forte
   valeur ajoutée, comme chez Attis)
5. **Réalisations** — 3 photos avec légende, `PhotoSlot` en cadre de remplacement tant que les
   vraies photos ne sont pas fournies
6. **Témoignage** — l'avis d'anais2.dasilva
7. **Bande CTA finale**

## Identité visuelle

Base sur le logo existant de Bailey (bleu marine, doré/jaune pour l'ampoule, vert pour la
tagline "L'éclairage de vos projets"), avec une palette distincte de celle d'Attis pour ne pas
que les deux sites clients se ressemblent :

- Navy marine en couleur primaire (proche du logo existant)
- Doré/ambre pour les accents et boutons d'appel à l'action
- Vert comme couleur de mise en avant (remplace le cyan/rouge d'Attis)

Valeurs hexadécimales exactes à affiner une fois le logo redessiné en vectoriel (voir
ci-dessous) — estimation de départ à valider en implémentation, pas de mesure fiable possible
depuis une capture vidéo compressée.

## Photos et logo

- **Photos** : cadres de remplacement (`PhotoSlot`, comme Attis) pour la démo. Loïc a dit avoir
  des photos de chantier réelles (similaires à celles vues sur son Facebook) — à intégrer dans
  `src/lib/photos.ts` dès réception.
- **Logo** : aucun fichier haute résolution disponible. Proposition : redessiner le logo actuel
  en SVG vectoriel propre (même traitement que `logo-redraw.svg` sur Attis), à offrir
  gratuitement à Loïc plutôt que de concevoir une nouvelle identité de marque — hors périmètre
  de ce projet.

## Mode démo et workflow de livraison

Identique au modèle Attis :

- `DEMO_MODE = true` : bandeau "maquette de démonstration", `noindex, nofollow`, sitemap désactivé
- Nouveau dépôt GitHub sous le compte de l'utilisateur, déployé en démo sur GitHub Pages
- **Checklist à la signature** (reprise et adaptée du modèle Attis) :
  - [ ] `DEMO_MODE = false`
  - [ ] Confirmer les certifications avec Loïc et les ajouter si applicable
  - [ ] Vraies photos de chantier dans `photos.ts`
  - [ ] Logo vectoriel validé par Loïc
  - [ ] Mentions légales (raison sociale, forme juridique, SIRET, hébergeur) — non incluses en démo
  - [ ] Reconfirmer que le 06 34 14 02 74 est bien sur WhatsApp
  - [ ] Nom de domaine à définir, `SITE_URL` et `public/CNAME`
  - [ ] Relire les textes avec Loïc (services, zone d'intervention exacte)
  - [ ] Transférer le dépôt sur le compte GitHub de Loïc

## Hors périmètre

- Formulaire de contact, back-end, base de données (comme Attis)
- Conception d'une nouvelle identité de marque (seul un redessin vectoriel du logo existant est
  prévu)
- Nom de domaine et mentions légales (bloqués tant que le projet n'est pas signé)
