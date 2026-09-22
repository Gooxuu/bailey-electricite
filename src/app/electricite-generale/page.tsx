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
