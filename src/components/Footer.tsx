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
