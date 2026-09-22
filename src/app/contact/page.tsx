import type { Metadata } from "next";
import Icon, { type IconName } from "@/components/Icons";
import { Container, SectionHeading } from "@/components/Section";
import {
  ADDRESS,
  EMAIL,
  EMAIL_MAILTO,
  FACEBOOK_URL,
  HOURS,
  MAPS_URL,
  PAYMENT_METHODS,
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
              <p className="mt-1 text-muted">Zone d’intervention : {SERVICE_AREA}.</p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-navy/30 px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy/5"
              >
                Voir l’itinéraire
                <Icon name="arrow" className="size-4" />
              </a>

              <h2 className="mt-8 flex items-center gap-2 font-display text-xl font-extrabold text-navy">
                <Icon name="check" className="size-5 text-green" />
                Horaires
              </h2>
              <ul className="mt-4 space-y-1.5 text-ink">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4 text-sm">
                    <span className="font-medium">{h.day}</span>
                    <span className="text-muted">{h.hours}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">Moyens de paiement acceptés : {PAYMENT_METHODS.join(", ")}.</p>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 hover:underline"
              >
                Suivez-nous sur Facebook
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
