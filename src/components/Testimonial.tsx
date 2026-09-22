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
