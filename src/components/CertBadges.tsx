import Icon from "@/components/Icons";
import { CERTIFICATIONS } from "@/lib/infos";

/**
 * Badges de certification. Ne rend rien tant que `CERTIFICATIONS` (lib/infos.ts) est vide —
 * aucune certification n'a été confirmée par Loïc, donc aucun badge n'est inventé ni affiché
 * vide. Dès qu'une entrée y est ajoutée, ce composant l'affiche automatiquement.
 */
export default function CertBadges({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  if (CERTIFICATIONS.length === 0) return null;

  const card = tone === "dark" ? "border-white/15 bg-white/5 text-white" : "border-line bg-white text-navy shadow-sm";
  const detail = tone === "dark" ? "text-white/70" : "text-muted";

  return (
    <ul className={`grid grid-cols-2 gap-3 lg:grid-cols-4 ${className}`}>
      {CERTIFICATIONS.map((cert) => (
        <li key={cert.id} className={`flex items-center gap-3 rounded-2xl border p-4 ${card}`}>
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${tone === "dark" ? "bg-white/10 text-gold" : "bg-gold/20 text-navy"}`}>
            <Icon name="shield" className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold leading-tight">{cert.label}</span>
            <span className={`block text-xs ${detail}`}>{cert.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
