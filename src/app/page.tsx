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
              Découvrir l’installation de bornes
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
