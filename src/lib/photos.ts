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
