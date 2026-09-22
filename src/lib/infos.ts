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

/** Horaires d'ouverture (PagesJaunes), affichés sur la page Contact. */
export const HOURS: { day: string; hours: string }[] = [
  { day: "Lundi", hours: "08h00 - 19h00" },
  { day: "Mardi", hours: "08h00 - 19h00" },
  { day: "Mercredi", hours: "08h00 - 19h00" },
  { day: "Jeudi", hours: "08h00 - 19h00" },
  { day: "Vendredi", hours: "08h00 - 19h00" },
  { day: "Samedi", hours: "08h00 - 12h00" },
  { day: "Dimanche", hours: "Fermé" },
];

/** Moyens de paiement acceptés (PagesJaunes). */
export const PAYMENT_METHODS = ["Chèque", "Carte bancaire", "Visa"];

/** Page Facebook de l'entreprise. */
export const FACEBOOK_URL = "https://www.facebook.com/share/1Actrqrwyc/";

/**
 * Note Google (PagesJaunes, relevée le 2026-09-22), affichée en preuve sociale sur l'accueil.
 * Valeur figée — ce site est 100% statique, sans appel à l'API Google. À mettre à jour à la
 * main ici si la note évolue (voir README « Où modifier quoi »).
 */
export const GOOGLE_RATING = { score: "4,9", count: 17 };

export const NAV_LINKS = [
  { href: "/electricite-generale/", label: "Électricité Générale" },
  { href: "/chauffage-climatisation-ventilation/", label: "Chauffage & Climatisation" },
  { href: "/bornes-de-recharge-irve/", label: "Bornes de recharge", highlight: true },
  { href: "/contact/", label: "Contact" },
] as const;
