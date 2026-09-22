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
